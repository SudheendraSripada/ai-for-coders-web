export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced'

export interface UserProfile {
  id: string
  email: string
  experience_level: ExperienceLevel | null
  learning_goals: string | null
  created_at: string
  updated_at: string
}

export interface SignUpFormData {
  email: string
  password: string
  confirmPassword: string
  termsAccepted: boolean
}

export interface LoginFormData {
  email: string
  password: string
}

export interface OnboardingFormData {
  experience_level: ExperienceLevel
  learning_goals: string
}
