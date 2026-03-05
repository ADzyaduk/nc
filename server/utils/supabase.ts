import { serverSupabaseClient } from '#supabase/server'
import type { H3Event } from 'h3'
import type { Database } from '~~/app/types/database.types'

/**
 * Gets the Supabase client for server-side use.
 * Uses @nuxtjs/supabase's built-in server client which handles
 * headers, auth, and key format correctly.
 */
export async function useSupabaseAdmin(event: H3Event) {
    return await serverSupabaseClient<Database>(event)
}
