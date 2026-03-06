import { serverSupabaseServiceRole } from '#supabase/server'
import type { H3Event } from 'h3'
import type { Database } from '~~/app/types/database.types'

/**
 * Server-side Supabase client with service role (bypasses RLS).
 * Uses SUPABASE_SECRET_KEY from .env.
 */
export async function useSupabaseAdmin(event: H3Event) {
    return serverSupabaseServiceRole<Database>(event)
}
