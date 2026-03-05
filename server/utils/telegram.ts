import crypto from 'node:crypto'

interface TelegramUser {
    id: number
    first_name: string
    last_name?: string
    username?: string
    language_code?: string
}

interface ValidatedInitData {
    user: TelegramUser
    auth_date: number
    hash: string
    query_id?: string
}

/**
 * Validates Telegram WebApp initData using HMAC-SHA256.
 * Never trust client-provided telegram_id — always validate server-side.
 */
export function validateTelegramInitData(initData: string, botToken: string): ValidatedInitData {
    if (!initData) {
        throw createError({ statusCode: 401, statusMessage: 'Missing Telegram initData' })
    }

    const params = new URLSearchParams(initData)
    const hash = params.get('hash')

    if (!hash) {
        throw createError({ statusCode: 401, statusMessage: 'Missing hash in initData' })
    }

    // Remove hash from params and sort alphabetically
    params.delete('hash')
    const dataCheckString = Array.from(params.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${value}`)
        .join('\n')

    // HMAC-SHA256 validation
    const secretKey = crypto
        .createHmac('sha256', 'WebAppData')
        .update(botToken)
        .digest()

    const computedHash = crypto
        .createHmac('sha256', secretKey)
        .update(dataCheckString)
        .digest('hex')

    if (computedHash !== hash) {
        throw createError({ statusCode: 401, statusMessage: 'Invalid Telegram initData signature' })
    }

    // Check auth_date is not too old (allow 24 hours)
    const authDate = parseInt(params.get('auth_date') || '0', 10)
    const now = Math.floor(Date.now() / 1000)
    if (now - authDate > 86400) {
        throw createError({ statusCode: 401, statusMessage: 'Telegram initData expired' })
    }

    // Parse user data
    const userStr = params.get('user')
    if (!userStr) {
        throw createError({ statusCode: 401, statusMessage: 'Missing user data in initData' })
    }

    const user: TelegramUser = JSON.parse(userStr)

    return {
        user,
        auth_date: authDate,
        hash,
        query_id: params.get('query_id') || undefined,
    }
}
