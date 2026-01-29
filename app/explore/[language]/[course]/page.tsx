'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProgressTracker from '@/components/ProgressTracker'
import { Lesson, Course } from '@/lib/types'
import { ArrowLeft, BookOpen, Clock, CheckCircle } from 'lucide-react'

interface CourseData {
  id: number
  title: string
  slug: string
  description: string | null
  difficulty_level: string | null
  duration_hours: number | null
  lessons: Lesson[]
}

export default function CoursePage() {
  const params = useParams()
  const languageSlug = params.language as string
  const courseSlug = params.course as string
  
  const [course, setCourse] = useState<CourseData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/content/courses?language=${languageSlug}`)
        const data = await response.json()
        
        const foundCourse = data.courses?.find((c: Course) => c.slug === courseSlug)
        
        if (foundCourse) {
          const lessonsResponse = await fetch(`/api/content/lessons?course_id=${foundCourse.id}`)
          const lessonsData = await lessonsResponse.json()
          
          setCourse({
            ...foundCourse,
            lessons: lessonsData.lessons || []
          })
        }
      } catch (error) {
        console.error('Error fetching course:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [languageSlug, courseSlug])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </main>
        <Footer />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Course not found</h1>
            <Link href="/explore" className="mt-4 text-indigo-600 hover:text-indigo-500">
              Back to Explore
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const getLanguageColor = (slug: string) => {
    switch (slug) {
      case 'python': return 'bg-blue-500'
      case 'java': return 'bg-orange-500'
      case 'c': return 'bg-gray-500'
      default: return 'bg-indigo-500'
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <div className={`${getLanguageColor(languageSlug)} py-8`}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link
              href={`/explore/${languageSlug}`}
              className="inline-flex items-center text-sm text-white/80 hover:text-white mb-4"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to {languageSlug.charAt(0).toUpperCase() + languageSlug.slice(1)}
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              {course.title}
            </h1>
            <p className="mt-2 text-white/90">
              {course.description}
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">Course Content</h2>
              <div className="space-y-4">
                {course.lessons.map((lesson, index) => (
                  <Link
                    key={lesson.id}
                    href={`/explore/${languageSlug}/${courseSlug}/${lesson.slug}`}
                    className="flex items-center space-x-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-indigo-200"
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${getLanguageColor(languageSlug)} text-white font-semibold`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-1">{lesson.description}</p>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <BookOpen className="mr-1 h-4 w-4" />
                      <span>View lesson</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-6">
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <h3 className="mb-4 font-semibold text-gray-900">Course Info</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Lessons</span>
                      <span className="font-medium text-gray-900">{course.lessons.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Tasks</span>
                      <span className="font-medium text-gray-900">
                        {course.lessons.length}
                      </span>
                    </div>
                    {course.duration_hours && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Duration</span>
                        <span className="font-medium text-gray-900">{course.duration_hours}h</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Level</span>
                      <span className="font-medium text-gray-900 capitalize">
                        {course.difficulty_level || 'Beginner'}
                      </span>
                    </div>
                  </div>
                </div>

                <ProgressTracker
                  lessons={course.lessons.map(l => ({
                    id: l.id,
                    title: l.title,
                    slug: l.slug,
                    order_index: l.order_index,
                    tasks: []
                  }))}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
