'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import CourseCard from '@/components/CourseCard'
import { UserProfile, Course, ProgressStats } from '@/lib/types'
import { Brain, Code2, LogOut, User, BookOpen, Trophy, Clock, TrendingUp, ChevronRight, Explore } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [progressStats, setProgressStats] = useState<ProgressStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [userRes, coursesRes, progressRes] = await Promise.all([
          fetch('/api/auth/user'),
          fetch('/api/content/languages'),
          fetch('/api/progress')
        ])

        const userData = await userRes.json()
        const languagesData = await languagesRes.json()
        const progressData = await progressRes.json()

        if (userData.user) {
          setUser(userData.user)
        }

        if (languagesData.languages) {
          const allCourses: Course[] = []
          for (const lang of languagesData.languages) {
            const coursesRes = await fetch(`/api/content/courses?language=${lang.slug}`)
            const coursesData = await coursesRes.json()
            if (coursesData.courses) {
              allCourses.push(...coursesData.courses)
            }
          }
          setCourses(allCourses)
        }

        if (progressData.progress) {
          const completedTasks = progressData.progress.filter((p: any) => p.completed).length
          setProgressStats({
            total_lessons_completed: progressData.progress.length,
            total_tasks_completed: completedTasks,
            total_courses_completed: 0,
            average_score: null,
            preferred_language: null
          })
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2">
                <Code2 className="h-8 w-8 text-indigo-600" />
                <Brain className="h-8 w-8 text-purple-600" />
                <span className="text-xl font-bold text-gray-900">AI for Coders</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/explore"
                className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                <Explore className="h-4 w-4" />
                <span>Explore</span>
              </Link>
              <Link
                href="/dashboard/profile"
                className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.full_name || user?.email?.split('@')[0] || 'Coder'}!
          </h1>
          <p className="mt-1 text-gray-600">
            Continue your learning journey
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-blue-100 p-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">Lessons</span>
            </div>
            <p className="mt-4 text-3xl font-bold text-gray-900">
              {progressStats?.total_lessons_completed || 0}
            </p>
            <p className="text-sm text-gray-600">completed</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-green-100 p-2">
                <Trophy className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-sm text-gray-500">Tasks</span>
            </div>
            <p className="mt-4 text-3xl font-bold text-gray-900">
              {progressStats?.total_tasks_completed || 0}
            </p>
            <p className="text-sm text-gray-600">solved</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-purple-100 p-2">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <span className="text-sm text-gray-500">Hours</span>
            </div>
            <p className="mt-4 text-3xl font-bold text-gray-900">
              {progressStats?.total_courses_completed || 0}
            </p>
            <p className="text-sm text-gray-600">invested</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-orange-100 p-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <span className="text-sm text-gray-500">Streak</span>
            </div>
            <p className="mt-4 text-3xl font-bold text-gray-900">--</p>
            <p className="text-sm text-gray-600">days</p>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Continue Learning</h2>
            <Link
              href="/explore"
              className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              View all courses
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          {loading ? (
            <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse rounded-xl bg-gray-200 h-48" />
              ))}
            </div>
          ) : courses.length > 0 ? (
            <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.slice(0, 3).map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  languageSlug="python"
                  progress={0}
                />
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-xl border-2 border-dashed border-gray-300 p-8 text-center">
              <p className="text-gray-600">No courses available yet</p>
              <Link
                href="/explore"
                className="mt-2 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Browse available courses
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Your Progress</h2>
            <Link
              href="/dashboard/progress"
              className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              View details
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Keep up the great work!</h3>
                <p className="mt-1 text-indigo-100">
                  You&apos;re making excellent progress. Keep solving tasks to level up!
                </p>
              </div>
              <Link
                href="/explore"
                className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
              >
                Continue Learning
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
