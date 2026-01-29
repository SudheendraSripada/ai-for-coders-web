'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }
      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    // AuthProvider will handle the redirect
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              AI for Coders
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:block">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 mb-8 text-white shadow-lg">
          <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
          <p className="text-blue-100">Continue your learning journey with AI for Coders</p>
        </div>

        {/* Learning Paths */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Language</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Python */}
            <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition overflow-hidden group">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 h-32 flex items-center justify-center">
                <div className="text-7xl">🐍</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Python</h3>
                <p className="text-gray-600 text-sm mb-4">Master the fundamentals with practical exercises</p>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-semibold text-gray-900">0%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>
                <button className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium group-hover:shadow-md">
                  Start Learning →
                </button>
              </div>
            </div>

            {/* Java */}
            <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition overflow-hidden group">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 h-32 flex items-center justify-center">
                <div className="text-7xl">☕</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Java</h3>
                <p className="text-gray-600 text-sm mb-4">Learn object-oriented programming</p>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-semibold text-gray-900">0%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>
                <button className="w-full px-4 py-2.5 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition font-medium group-hover:shadow-md">
                  Start Learning →
                </button>
              </div>
            </div>

            {/* C */}
            <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition overflow-hidden group">
              <div className="bg-gradient-to-br from-gray-700 to-gray-900 h-32 flex items-center justify-center">
                <div className="text-7xl">⚙️</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">C</h3>
                <p className="text-gray-600 text-sm mb-4">Understand systems programming</p>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-semibold text-gray-900">0%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gray-800 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>
                <button className="w-full px-4 py-2.5 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition font-medium group-hover:shadow-md">
                  Start Learning →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-2">
                <div className="text-gray-600 text-sm font-semibold">Lessons Completed</div>
                <div className="text-2xl">📚</div>
              </div>
              <div className="text-3xl font-bold text-gray-900">0</div>
              <div className="text-xs text-gray-500 mt-1">Keep learning!</div>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-2">
                <div className="text-gray-600 text-sm font-semibold">Tasks Solved</div>
                <div className="text-2xl">✅</div>
              </div>
              <div className="text-3xl font-bold text-gray-900">0</div>
              <div className="text-xs text-gray-500 mt-1">Start coding now!</div>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-2">
                <div className="text-gray-600 text-sm font-semibold">Current Streak</div>
                <div className="text-2xl">🔥</div>
              </div>
              <div className="text-3xl font-bold text-gray-900">0</div>
              <div className="text-xs text-gray-500 mt-1">days</div>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-2">
                <div className="text-gray-600 text-sm font-semibold">XP Earned</div>
                <div className="text-2xl">⭐</div>
              </div>
              <div className="text-3xl font-bold text-gray-900">0</div>
              <div className="text-xs text-gray-500 mt-1">Start earning XP!</div>
            </div>
          </div>
        </div>

        {/* Motivational Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-8 text-white shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-2xl font-bold mb-2">Ready to Start Learning?</h3>
              <p className="text-purple-100">
                Choose a language and begin your coding journey today!
              </p>
            </div>
            <Link
              href="/explore"
              className="px-6 py-3 bg-white text-purple-600 rounded-md hover:bg-purple-50 transition font-semibold shadow-md"
            >
              Explore Courses
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>© 2024 AI for Coders. Built with ❤️ for learners everywhere.</p>
        </div>
      </footer>
    </div>
  )
}
