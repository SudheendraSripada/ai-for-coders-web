import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string
          experience_level: 'beginner' | 'intermediate' | 'advanced' | null
          learning_goals: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          experience_level?: 'beginner' | 'intermediate' | 'advanced' | null
          learning_goals?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          experience_level?: 'beginner' | 'intermediate' | 'advanced' | null
          learning_goals?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
