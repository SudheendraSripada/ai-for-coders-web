export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced'
export type DifficultyLevel = 'easy' | 'medium' | 'hard'
export type TaskDifficulty = 'easy' | 'medium' | 'hard'

// User Profile
export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  experience_level: ExperienceLevel | null
  learning_goals: string | null
  preferred_language: string | null
  profile_image_url: string | null
  bio: string | null
  created_at: string
  updated_at: string
}

// Language
export interface Language {
  id: number
  name: string
  slug: string
  description: string | null
  icon_url: string | null
  difficulty_level: string | null
  created_at: string
}

// Course
export interface Course {
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

// Lesson
export interface Lesson {
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

// Task
export interface Task {
  id: number
  lesson_id: number
  title: string
  slug: string
  problem_statement: string | null
  starter_code: string | null
  expected_output: string | null
  difficulty: TaskDifficulty | null
  order_index: number
  created_at: string
  updated_at: string
}

// User Progress
export interface UserProgress {
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

// Sign Up Form
export interface SignUpFormData {
  email: string
  password: string
  confirmPassword: string
  termsAccepted: boolean
}

// Login Form
export interface LoginFormData {
  email: string
  password: string
}

// OTP Form
export interface OtpFormData {
  email: string
}

// OTP Verify Form
export interface OtpVerifyFormData {
  email: string
  otp: string
}

// Onboarding Form
export interface OnboardingFormData {
  experience_level: ExperienceLevel
  learning_goals: string
}

// Lesson with Tasks (combined type)
export interface LessonWithTasks extends Lesson {
  tasks: Task[]
}

// Course with Lessons (combined type)
export interface CourseWithLessons extends Course {
  lessons: LessonWithTasks[]
}

// Language with Courses (combined type)
export interface LanguageWithCourses extends Language {
  courses: CourseWithLessons[]
}

// Progress Stats
export interface ProgressStats {
  total_lessons_completed: number
  total_tasks_completed: number
  total_courses_completed: number
  average_score: number | null
  preferred_language: string | null
}
