'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import LanguageCard from '@/components/LanguageCard'
import { Language } from '@/lib/types'
import { Code2, BookOpen, Award } from 'lucide-react'

export default function ExplorePage() {
  const [languages, setLanguages] = useState<Language[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch('/api/content/languages')
        const data = await response.json()
        if (data.languages) {
          setLanguages(data.languages)
        }
      } catch (error) {
        console.error('Error fetching languages:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLanguages()
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Choose Your Programming Language
              </h1>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-indigo-100">
                Start your coding journey with our structured courses designed for all skill levels.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="flex items-center space-x-4 rounded-lg bg-white p-6 shadow-sm">
                <div className="rounded-full bg-blue-100 p-3">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Structured Learning</h3>
                  <p className="text-sm text-gray-600">Step-by-step lessons</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 rounded-lg bg-white p-6 shadow-sm">
                <div className="rounded-full bg-green-100 p-3">
                  <Code2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Hands-on Practice</h3>
                  <p className="text-sm text-gray-600">Real coding exercises</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 rounded-lg bg-white p-6 shadow-sm">
                <div className="rounded-full bg-purple-100 p-3">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Track Progress</h3>
                  <p className="text-sm text-gray-600">Earn achievements</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-8 text-2xl font-bold text-gray-900">Available Languages</h2>
            {loading ? (
              <div className="grid gap-6 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse rounded-xl bg-gray-200 h-64" />
                ))}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-3">
                {languages.map((language) => (
                  <LanguageCard key={language.id} language={language} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
