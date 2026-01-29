'use client'

import { CheckCircle, Circle, Lock } from 'lucide-react'

interface Lesson {
  id: number
  title: string
  slug: string
  order_index: number
}

interface Lesson {
  id: number
  title: string
  slug: string
  order_index: number
  tasks?: { id: number; completed?: boolean }[]
}

interface ProgressTrackerProps {
  lessons: Lesson[]
  currentLessonId?: number
  completedLessonIds?: number[]
}

export default function ProgressTracker({
  lessons,
  currentLessonId,
  completedLessonIds = []
}: ProgressTrackerProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Course Content</h3>
      <nav className="space-y-1">
        {lessons.map((lesson, index) => {
          const isCompleted = completedLessonIds.includes(lesson.id)
          const isCurrent = currentLessonId === lesson.id
          const isLocked = index > 0 && !completedLessonIds.includes(lessons[index - 1].id)

          return (
            <div
              key={lesson.id}
              className={`flex items-center space-x-3 rounded-lg px-3 py-2 transition-colors ${
                isCurrent
                  ? 'bg-indigo-50 text-indigo-700'
                  : isCompleted
                  ? 'text-gray-700 hover:bg-gray-50'
                  : 'text-gray-500'
              }`}
            >
              {isCompleted ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : isLocked ? (
                <Lock className="h-5 w-5 text-gray-400" />
              ) : (
                <Circle className={`h-5 w-5 ${isCurrent ? 'text-indigo-600' : 'text-gray-400'}`} />
              )}
              <span className={`flex-1 text-sm font-medium ${isCurrent ? 'text-indigo-700' : ''}`}>
                {index + 1}. {lesson.title}
              </span>
              {lesson.tasks && (
                <span className="text-xs text-gray-400">
                  {lesson.tasks.filter(t => t.completed).length}/{lesson.tasks.length} tasks
                </span>
              )}
            </div>
          )
        })}
      </nav>

      <div className="mt-4 border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Course Progress</span>
          <span className="font-medium text-indigo-600">
            {Math.round((completedLessonIds.length / lessons.length) * 100)}%
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${(completedLessonIds.length / lessons.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
