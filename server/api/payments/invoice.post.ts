/**
 * Creates a Telegram Stars (XTR) invoice link for a given product type.
 * The link is opened on the client via Telegram.WebApp.openInvoice().
 */

const PRODUCTS = {
    natal: {
        title: 'Full Natal Report',
        description: 'Detailed AI interpretation of all aspects of your natal chart',
        label: 'Natal Chart',
        amount: 50,
    },
    compatibility: {
        title: 'Full Compatibility Analysis',
        description: 'Detailed AI interpretation of your compatibility across all aspects',
        label: 'Compatibility',
        amount: 50,
    },
    tarot: {
        title: 'Tarot Reading',
        description: 'Personalized 3-card Major Arcana spread with AI interpretation',
        label: 'Tarot Reading',
        amount: 25,
    },
} as const

type ProductType = keyof typeof PRODUCTS

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const type = body?.type as ProductType | undefined
    const reportId = body?.reportId as string | undefined
    const telegramId = body?.telegramId as string | undefined

    if (!type || !PRODUCTS[type]) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid product type' })
    }

    const { telegramBotToken: botToken } = useRuntimeConfig(event)
    if (!botToken) {
        throw createError({ statusCode: 500, statusMessage: 'Bot token not configured' })
    }

    const product = PRODUCTS[type]
    const payload = JSON.stringify({ type, reportId, telegramId, ts: Date.now() })

    const response = await $fetch<{ ok: boolean, result: string }>(
        `https://api.telegram.org/bot${botToken}/createInvoiceLink`,
        {
            method: 'POST',
            body: {
                title: product.title,
                description: product.description,
                payload,
                provider_token: '',
                currency: 'XTR',
                prices: [{ label: product.label, amount: product.amount }],
            },
        },
    )

    if (!response.ok || !response.result) {
        throw createError({ statusCode: 502, statusMessage: 'Failed to create invoice link' })
    }

    return { invoiceLink: response.result }
})
