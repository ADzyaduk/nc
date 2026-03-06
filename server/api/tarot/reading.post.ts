import { tarotReadingSchema } from '~~/server/utils/schemas'
import { drawTarotCards } from '~~/server/utils/tarot'
import { generateTarotInterpretation } from '~~/server/utils/openrouter'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const parsed = tarotReadingSchema.safeParse(body)
    if (!parsed.success) {
        throw createError({
            statusCode: 400,
            statusMessage: parsed.error.issues[0]?.message || 'Invalid request',
        })
    }

    const { question, telegramId, locale } = parsed.data

    const supabase = await useSupabaseAdmin(event)

    const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('telegram_id', telegramId)
        .single()

    if (!user) {
        throw createError({ statusCode: 401, statusMessage: 'User not found' })
    }

    const cards = drawTarotCards(3)

    const config = useRuntimeConfig()
    const apiKey = config.openrouterApiKey as string
    const modelId = (config.openrouterModelId as string) || 'mistralai/mistral-7b-instruct'

    const interpretation = await generateTarotInterpretation(
        question,
        cards,
        apiKey,
        modelId,
        locale,
    )

    const positions = locale === 'ru'
        ? ['Ситуация', 'Препятствие', 'Совет']
        : ['Situation', 'Challenge', 'Advice']

    return {
        cards,
        positions,
        interpretation,
    }
})
