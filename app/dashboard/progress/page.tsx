'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { UserProgress } from '@/lib/types'
import { Brain, Code2, User, ArrowLeft, Trophy, Target, Clock, TrendingUp, CheckCircle } from 'lucide-react'

export default function ProgressPage() {
  const [progress, setProgress] = useState<UserProgress[]>([])
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    averageScore: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch('/api/progress')
        const data = await response.json()
        
        if (data.progress) {
          setProgress(data.progress)
          
          const completed = data.progress.filter((p: UserProgress) => p.completed).length
          const totalScore = data.progress.reduce((acc: number, p: UserProgress) => acc + (p.score || 0), 0)
          
          setStats({
            total: data.progress.length,
            completed,
            averageScore: data.progress.length > 0 ? Math.round(totalScore / data.progress.length) : 0
          })
        }
      } catch (error) {
        console.error('Error fetching progress:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProgress()
  }, [])

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
                href="/dashboard"
                className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Link>
              <Link
                href="/dashboard/profile"
                className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Progress</h1>
          <p className="mt-1 text-gray-600">
            Track your learning journey and achievements
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-blue-100 p-2">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-600">Total Attempts</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-green-100 p-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-bold text-gray-900">{stats.completed}</p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-purple-100 p-2">
                <Trophy className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-bold text-gray-900">{stats.averageScore}%</p>
            <p className="text-sm text-gray-600">Average Score</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-orange-100 p-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-bold text-gray-900">
              {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
            </p>
            <p className="text-sm text-gray-600">Completion Rate</p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900">Activity History</h2>
          {loading ? (
            <div className="mt-4 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse rounded-lg bg-white p-4 shadow-sm">
                  <div className="h-4 w-1/3 bg-gray-200 rounded" />
                  <div className="mt-2 h-4 w-1/2 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          ) : progress.length > 0 ? (
            <div className="mt-4 space-y-4">
              {progress.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`rounded-full p-2 ${
                      item.completed ? 'bg-green-100' : 'bg-yellow-100'
                    }`}>
                      {item.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Task {item.task_id || 'Unknown'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(item.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {item.score !== null && (
                      <span className={`text-lg font-semibold ${
                        item.score >= 70 ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {item.score}%
                      </span>
                    )}
                    <span className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      item.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.completed ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-xl border-2 border-dashed border-gray-300 p-8 text-center">
              <Trophy className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No progress yet</h3>
              <p className="mt-2 text-gray-600">
                Start completing tasks to see your progress here!
              </p>
              <Link
                href="/explore"
                className="mt-4 inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Browse Courses
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
