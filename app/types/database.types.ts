export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    // Allows to automatically instantiate createClient with right options
    // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
    __InternalSupabase: {
        PostgrestVersion: "14.1"
    }
    public: {
        Tables: {
            birth_charts: {
                Row: {
                    birth_city: string
                    birth_date: string
                    birth_time: string
                    chart_json: Json | null
                    created_at: string | null
                    id: string
                    latitude: number
                    longitude: number
                    user_id: string
                }
                Insert: {
                    birth_city: string
                    birth_date: string
                    birth_time: string
                    chart_json?: Json | null
                    created_at?: string | null
                    id?: string
                    latitude: number
                    longitude: number
                    user_id: string
                }
                Update: {
                    birth_city?: string
                    birth_date?: string
                    birth_time?: string
                    chart_json?: Json | null
                    created_at?: string | null
                    id?: string
                    latitude?: number
                    longitude?: number
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "birth_charts_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            compatibility_reports: {
                Row: {
                    content: string | null
                    created_at: string | null
                    id: string
                    is_paid: boolean | null
                    person1_birth_city: string
                    person1_birth_date: string
                    person1_birth_time: string
                    person1_chart_json: Json | null
                    person1_latitude: number
                    person1_longitude: number
                    person1_name: string | null
                    person2_birth_city: string
                    person2_birth_date: string
                    person2_birth_time: string
                    person2_chart_json: Json | null
                    person2_latitude: number
                    person2_longitude: number
                    person2_name: string | null
                    scores: Json | null
                    synastry_json: Json | null
                    type: string | null
                    user_id: string
                }
                Insert: {
                    content?: string | null
                    created_at?: string | null
                    id?: string
                    is_paid?: boolean | null
                    person1_birth_city: string
                    person1_birth_date: string
                    person1_birth_time: string
                    person1_chart_json?: Json | null
                    person1_latitude: number
                    person1_longitude: number
                    person1_name?: string | null
                    person2_birth_city: string
                    person2_birth_date: string
                    person2_birth_time: string
                    person2_chart_json?: Json | null
                    person2_latitude: number
                    person2_longitude: number
                    person2_name?: string | null
                    scores?: Json | null
                    synastry_json?: Json | null
                    type?: string | null
                    user_id: string
                }
                Update: {
                    content?: string | null
                    created_at?: string | null
                    id?: string
                    is_paid?: boolean | null
                    person1_birth_city?: string
                    person1_birth_date?: string
                    person1_birth_time?: string
                    person1_chart_json?: Json | null
                    person1_latitude?: number
                    person1_longitude?: number
                    person1_name?: string | null
                    person2_birth_city?: string
                    person2_birth_date?: string
                    person2_birth_time?: string
                    person2_chart_json?: Json | null
                    person2_latitude?: number
                    person2_longitude?: number
                    person2_name?: string | null
                    scores?: Json | null
                    synastry_json?: Json | null
                    type?: string | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "compatibility_reports_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            payments: {
                Row: {
                    amount: number
                    created_at: string | null
                    currency: string | null
                    id: string
                    report_id: string | null
                    status: string | null
                    telegram_payment_id: string | null
                    user_id: string
                }
                Insert: {
                    amount: number
                    created_at?: string | null
                    currency?: string | null
                    id?: string
                    report_id?: string | null
                    status?: string | null
                    telegram_payment_id?: string | null
                    user_id: string
                }
                Update: {
                    amount?: number
                    created_at?: string | null
                    currency?: string | null
                    id?: string
                    report_id?: string | null
                    status?: string | null
                    telegram_payment_id?: string | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "payments_report_id_fkey"
                        columns: ["report_id"]
                        isOneToOne: false
                        referencedRelation: "reports"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "payments_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            reports: {
                Row: {
                    birth_chart_id: string
                    content: string | null
                    created_at: string | null
                    id: string
                    is_paid: boolean | null
                    type: string
                    user_id: string
                }
                Insert: {
                    birth_chart_id: string
                    content?: string | null
                    created_at?: string | null
                    id?: string
                    is_paid?: boolean | null
                    type: string
                    user_id: string
                }
                Update: {
                    birth_chart_id?: string
                    content?: string | null
                    created_at?: string | null
                    id?: string
                    is_paid?: boolean | null
                    type?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "reports_birth_chart_id_fkey"
                        columns: ["birth_chart_id"]
                        isOneToOne: false
                        referencedRelation: "birth_charts"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "reports_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            users: {
                Row: {
                    created_at: string | null
                    id: string
                    subscription_status: string | null
                    telegram_id: string
                    username: string | null
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    subscription_status?: string | null
                    telegram_id: string
                    username?: string | null
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    subscription_status?: string | null
                    telegram_id: string
                    username?: string | null
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
    DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
    EnumName extends DefaultSchemaEnumNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
    public: {
        Enums: {},
    },
} as const
