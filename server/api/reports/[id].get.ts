import { getReportSchema } from '~~/server/utils/schemas'

export default defineEventHandler(async (event) => {
    const reportId = getRouterParam(event, 'id')
    if (!reportId) {
        throw createError({ statusCode: 400, statusMessage: 'Missing report ID' })
    }

    const query = getQuery(event)
    const parsed = getReportSchema.safeParse({ telegramId: query.telegramId })
    if (!parsed.success) {
        throw createError({ statusCode: 400, statusMessage: 'Missing telegramId' })
    }

    const supabase = await useSupabaseAdmin(event)

    const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('telegram_id', parsed.data.telegramId)
        .single()

    if (!user) {
        throw createError({ statusCode: 401, statusMessage: 'User not found' })
    }

    const { data: report } = await supabase
        .from('reports')
        .select('*')
        .eq('id', reportId)
        .eq('user_id', user.id)
        .single()

    if (!report) {
        throw createError({ statusCode: 404, statusMessage: 'Report not found' })
    }

    if (report.type === 'full' && !report.is_paid) {
        return {
            report: {
                ...report,
                content: report.content?.slice(0, 300) + '\n\n...',
                is_truncated: true,
            },
        }
    }

    return { report }
})
