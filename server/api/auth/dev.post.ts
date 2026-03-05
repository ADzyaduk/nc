export default defineEventHandler(async (event) => {
    const supabase = await useSupabaseAdmin(event)
    const devTelegramId = 'dev-user'

    const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('telegram_id', devTelegramId)
        .single()

    if (existingUser) {
        return { user: existingUser, language_code: 'ru' }
    }

    const { data: newUser, error } = await supabase
        .from('users')
        .insert({ telegram_id: devTelegramId, username: 'Developer' })
        .select()
        .single()

    if (error) {
        throw createError({ statusCode: 500, statusMessage: 'Failed to create dev user' })
    }

    return { user: newUser, language_code: 'ru' }
})
