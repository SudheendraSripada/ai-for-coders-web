'use client'

import Link from 'next/link'
import { Clock, BookOpen } from 'lucide-react'
import { Course } from '@/lib/types'

interface CourseCardProps {
  course: Course
  languageSlug: string
  progress?: number
}

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700'
}

export default function CourseCard({ course, languageSlug, progress = 0 }: CourseCardProps) {
  const difficultyClass = difficultyColors[course.difficulty_level || 'beginner']

  return (
    <Link
      href={`/explore/${languageSlug}/${course.slug}`}
      className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-xl"
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${difficultyClass}`}>
              {course.difficulty_level || 'Beginner'}
            </span>
            <h3 className="mt-3 text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
              {course.title}
            </h3>
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
              {course.description}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
          {course.duration_hours && (
            <div className="flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              <span>{course.duration_hours}h</span>
            </div>
          )}
          <div className="flex items-center">
            <BookOpen className="mr-1 h-4 w-4" />
            <span>4 lessons</span>
          </div>
        </div>

        {progress > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium text-indigo-600">{progress}%</span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center text-sm font-medium text-indigo-600">
          <span>Start Learning</span>
          <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}
