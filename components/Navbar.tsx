'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Brain, Code2, Menu, X, ChevronDown } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/user')
        setIsLoggedIn(response.ok)
      } catch {
        setIsLoggedIn(false)
      }
    }
    checkSession()
  }, [])

  const isAuthPage = pathname?.startsWith('/auth/')
  const isDashboard = pathname?.startsWith('/dashboard')

  if (isAuthPage) {
    return null
  }

  return (
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

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/explore"
              className={`text-sm font-medium transition-colors ${
                pathname?.startsWith('/explore')
                  ? 'text-indigo-600'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Explore
            </Link>
            
            {isLoggedIn && (
              <>
                <Link
                  href="/dashboard"
                  className={`text-sm font-medium transition-colors ${
                    pathname?.startsWith('/dashboard')
                      ? 'text-indigo-600'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Dashboard
                </Link>
              </>
            )}

            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                <span>My Learning</span>
              </Link>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-gray-200 md:hidden">
          <div className="space-y-1 px-4 py-3">
            <Link
              href="/explore"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Explore Courses
            </Link>
            {isLoggedIn && (
              <Link
                href="/dashboard"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            {!isLoggedIn && (
              <>
                <Link
                  href="/auth/login"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  href="/auth/signup"
                  className="block rounded-md bg-indigo-600 px-3 py-2 text-base font-medium text-white hover:bg-indigo-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
