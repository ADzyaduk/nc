import { telegramAuthSchema } from '~~/server/utils/schemas'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    // Validate request
    const parsed = telegramAuthSchema.safeParse(body)
    if (!parsed.success) {
        throw createError({
            statusCode: 400,
            statusMessage: parsed.error.issues[0]?.message || 'Invalid request',
        })
    }

    // Validate Telegram initData
    const config = useRuntimeConfig()
    const telegramData = validateTelegramInitData(parsed.data.initData, config.telegramBotToken)

    // Upsert user in Supabase
    const supabase = await useSupabaseAdmin(event)
    const telegramId = String(telegramData.user.id)
    const username = telegramData.user.username || telegramData.user.first_name || 'user'

    const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('telegram_id', telegramId)
        .single()

    if (existingUser) {
        if (existingUser.username !== username) {
            await supabase
                .from('users')
                .update({ username })
                .eq('telegram_id', telegramId)
        }
        return { user: existingUser, language_code: telegramData.user.language_code || 'ru' }
    }

    const { data: newUser, error } = await supabase
        .from('users')
        .insert({ telegram_id: telegramId, username })
        .select()
        .single()

    if (error) {
        throw createError({ statusCode: 500, statusMessage: 'Failed to create user' })
    }

    return { user: newUser, language_code: telegramData.user.language_code || 'ru' }
})
