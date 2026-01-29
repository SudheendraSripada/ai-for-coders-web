'use client'

import Link from 'next/link'
import { Code2 } from 'lucide-react'
import { Language } from '@/lib/types'

interface LanguageCardProps {
  language: Language
}

const languageColors: Record<string, string> = {
  python: 'from-blue-500 to-blue-600',
  java: 'from-orange-500 to-orange-600',
  c: 'from-gray-500 to-gray-600'
}

const languageIcons: Record<string, JSX.Element> = {
  python: <Code2 className="h-8 w-8 text-white" />,
  java: <Code2 className="h-8 w-8 text-white" />,
  c: <Code2 className="h-8 w-8 text-white" />
}

export default function LanguageCard({ language }: LanguageCardProps) {
  const colorClass = languageColors[language.slug] || 'from-indigo-500 to-indigo-600'

  return (
    <Link
      href={`/explore/${language.slug}`}
      className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-xl"
    >
      <div className={`h-32 bg-gradient-to-r ${colorClass} p-6`}>
        <div className="flex items-center justify-between">
          <div className="rounded-lg bg-white/20 p-3 backdrop-blur-sm">
            {languageIcons[language.slug]}
          </div>
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm capitalize">
            {language.difficulty_level || 'Beginner'}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
          {language.name}
        </h3>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {language.description}
        </p>
        <div className="mt-4 flex items-center text-sm font-medium text-indigo-600">
          <span>Explore Courses</span>
          <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}
