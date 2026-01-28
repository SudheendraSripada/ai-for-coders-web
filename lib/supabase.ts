import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type { UserProfile, Language, Course, Lesson, Task, UserProgress } from '@/lib/types'

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          experience_level: 'beginner' | 'intermediate' | 'advanced' | null
          learning_goals: string | null
          preferred_language: string | null
          profile_image_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          experience_level?: 'beginner' | 'intermediate' | 'advanced' | null
          learning_goals?: string | null
          preferred_language?: string | null
          profile_image_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          experience_level?: 'beginner' | 'intermediate' | 'advanced' | null
          learning_goals?: string | null
          preferred_language?: string | null
          profile_image_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      languages: {
        Row: {
          id: number
          name: string
          slug: string
          description: string | null
          icon_url: string | null
          difficulty_level: string | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          slug: string
          description?: string | null
          icon_url?: string | null
          difficulty_level?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
          description?: string | null
          icon_url?: string | null
          difficulty_level?: string | null
          created_at?: string
        }
      }
      courses: {
        Row: {
          id: number
          language_id: number
          title: string
          slug: string
          description: string | null
          difficulty_level: string | null
          duration_hours: number | null
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          language_id: number
          title: string
          slug: string
          description?: string | null
          difficulty_level?: string | null
          duration_hours?: number | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          language_id?: number
          title?: string
          slug?: string
          description?: string | null
          difficulty_level?: string | null
          duration_hours?: number | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      lessons: {
        Row: {
          id: number
          course_id: number
          title: string
          slug: string
          description: string | null
          content_html: string | null
          code_example: string | null
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          course_id: number
          title: string
          slug: string
          description?: string | null
          content_html?: string | null
          code_example?: string | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          course_id?: number
          title?: string
          slug?: string
          description?: string | null
          content_html?: string | null
          code_example?: string | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: number
          lesson_id: number
          title: string
          slug: string
          problem_statement: string | null
          starter_code: string | null
          expected_output: string | null
          difficulty: string | null
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          lesson_id: number
          title: string
          slug: string
          problem_statement?: string | null
          starter_code?: string | null
          expected_output?: string | null
          difficulty?: string | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          lesson_id?: number
          title?: string
          slug?: string
          problem_statement?: string | null
          starter_code?: string | null
          expected_output?: string | null
          difficulty?: string | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_progress: {
        Row: {
          id: number
          user_id: string
          lesson_id: number
          task_id: number | null
          completed: boolean
          attempts: number
          score: number | null
          code_solution: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          lesson_id: number
          task_id?: number | null
          completed?: boolean
          attempts?: number
          score?: number | null
          code_solution?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          lesson_id?: number
          task_id?: number | null
          completed?: boolean
          attempts?: number
          score?: number | null
          code_solution?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
