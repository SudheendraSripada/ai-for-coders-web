'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { MessageSquare, Bug, TrendingUp, ArrowRight, Code2, Brain } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Code2 className="h-12 w-12 text-indigo-600" />
              <Brain className="h-12 w-12 text-purple-600" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Learn to Think Like a Programmer
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-600">
              A comprehensive coding education platform with structured courses in Python, Java, and C.
            </p>
            <div className="mt-10 flex justify-center space-x-4">
              <Link
                href="/explore"
                className="flex items-center space-x-2 rounded-md bg-indigo-600 px-8 py-3 text-base font-semibold text-white hover:bg-indigo-700"
              >
                <span>Start Learning Free</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/auth/login"
                className="flex items-center space-x-2 rounded-md border border-gray-300 bg-white px-8 py-3 text-base font-semibold text-gray-700 hover:bg-gray-50"
              >
                <span>Log In</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-lg bg-white p-8 shadow-sm">
                <div className="mb-4 inline-flex rounded-lg bg-indigo-100 p-3">
                  <Code2 className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Structured Courses
                </h3>
                <p className="text-gray-600">
                  Learn Python, Java, or C with step-by-step lessons designed for all skill levels.
                </p>
              </div>

              <div className="rounded-lg bg-white p-8 shadow-sm">
                <div className="mb-4 inline-flex rounded-lg bg-purple-100 p-3">
                  <Bug className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Practice Tasks
                </h3>
                <p className="text-gray-600">
                  Reinforce your learning with hands-on coding exercises and immediate feedback.
                </p>
              </div>

              <div className="rounded-lg bg-white p-8 shadow-sm">
                <div className="mb-4 inline-flex rounded-lg bg-green-100 p-3">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Track Progress
                </h3>
                <p className="text-gray-600">
                  Monitor your learning journey with detailed progress tracking and achievements.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              What Learners Are Saying
            </h2>
            <div className="mt-10 rounded-lg bg-gray-50 p-8">
              <blockquote className="text-lg text-gray-700">
                &ldquo;I used to just search for answers. Now I actually understand the concepts behind them. AI for Coders changed how I learn programming.&rdquo;
              </blockquote>
              <cite className="mt-6 block text-gray-600">
                — Sarah M., Software Engineering Student
              </cite>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Choose Your Path
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Python</h3>
                <p className="text-blue-100 mb-4">
                  Versatile and beginner-friendly. Perfect for web development, data science, and automation.
                </p>
                <Link
                  href="/explore/python"
                  className="inline-flex items-center text-white font-medium hover:text-blue-200"
                >
                  Explore Python <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>

              <div className="rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Java</h3>
                <p className="text-orange-100 mb-4">
                  Robust and object-oriented. Industry standard for enterprise applications and Android.
                </p>
                <Link
                  href="/explore/java"
                  className="inline-flex items-center text-white font-medium hover:text-orange-200"
                >
                  Explore Java <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>

              <div className="rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">C</h3>
                <p className="text-gray-100 mb-4">
                  Foundational systems language. Learn computer science fundamentals and memory management.
                </p>
                <Link
                  href="/explore/c"
                  className="inline-flex items-center text-white font-medium hover:text-gray-200"
                >
                  Explore C <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
