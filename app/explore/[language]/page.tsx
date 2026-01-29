'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CourseCard from '@/components/CourseCard'
import { Language, Course } from '@/lib/types'
import { ArrowLeft, Clock, Users } from 'lucide-react'

export default function LanguagePage() {
  const params = useParams()
  const languageSlug = params.language as string
  
  const [language, setLanguage] = useState<Language | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`/api/content/courses?language=${languageSlug}`)
        const data = await response.json()
        if (data.courses) {
          setCourses(data.courses)
          setLanguage(data.language)
        }
      } catch (error) {
        console.error('Error fetching courses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [languageSlug])

  const getLanguageColor = (slug: string) => {
    switch (slug) {
      case 'python':
        return 'from-blue-500 to-blue-600'
      case 'java':
        return 'from-orange-500 to-orange-600'
      case 'c':
        return 'from-gray-500 to-gray-600'
      default:
        return 'from-indigo-500 to-indigo-600'
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        {language ? (
          <>
            <div className={`bg-gradient-to-r ${getLanguageColor(languageSlug)} py-12`}>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Link
                  href="/explore"
                  className="inline-flex items-center text-sm text-white/80 hover:text-white mb-4"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Back to Languages
                </Link>
                <h1 className="text-4xl font-bold tracking-tight text-white">
                  {language.name}
                </h1>
                <p className="mt-2 max-w-2xl text-lg text-white/90">
                  {language.description}
                </p>
                <div className="mt-4 flex items-center space-x-6 text-sm text-white/80">
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>{courses.length} courses</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-1 h-4 w-4" />
                    <span>All levels</span>
                  </div>
                </div>
              </div>
            </div>

            <section className="py-12 px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-7xl">
                <h2 className="mb-8 text-2xl font-bold text-gray-900">Available Courses</h2>
                {loading ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="animate-pulse rounded-xl bg-gray-200 h-48" />
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                    {courses.map((course) => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        languageSlug={languageSlug}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        ) : loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
          </div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-600">Language not found</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
