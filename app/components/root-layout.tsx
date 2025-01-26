'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface RootLayoutProps {
  children: React.ReactNode
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="min-h-screen bg-black">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-black/0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-white font-bold text-xl">
                  Morning Party
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-white hover:text-gray-300">
                Explore
              </Link>
              <Link href="/blog" className="text-white hover:text-gray-300">
                Blog
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}
