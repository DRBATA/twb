'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface ExperienceModalProps {
  experience: {
    title: string
    description: string
    images: string[]
    schedule?: {
      weekday: string
      weekend: string
    }
    duration?: string
    options?: string[]
  }
  onCloseAction: () => void
}

export function ExperienceModal({ experience, onCloseAction }: ExperienceModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseAction()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onCloseAction])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCloseAction}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl mx-4 bg-black/80 rounded-lg shadow-2xl overflow-hidden">
        {/* Close button */}
        <button
          onClick={onCloseAction}
          className="absolute top-4 right-4 text-white/60 hover:text-white z-10"
          aria-label="Close experience details"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="p-8">
          {/* Title */}
          <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-teal-100 to-rose-100">
            {experience.title}
          </h2>

          {/* Image Gallery */}
          <div className="relative mb-8">
            <div className="flex space-x-4 overflow-x-auto pb-4 snap-x snap-mandatory">
              {experience.images.map((src, i) => (
                <div 
                  key={i} 
                  className="flex-none w-[300px] h-[200px] relative rounded-lg overflow-hidden snap-center"
                >
                  <Image
                    src={src}
                    alt={`${experience.title} ${i + 1}`}
                    fill
                    sizes="300px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6 text-white">
            <p className="text-lg text-gray-300">
              {experience.description}
            </p>

            {experience.schedule && (
              <div className="space-y-2">
                <p className="text-rose-300 font-semibold">Schedule:</p>
                <p className="text-gray-300">{experience.schedule.weekday}</p>
                <p className="text-gray-300">{experience.schedule.weekend}</p>
              </div>
            )}

            {experience.duration && (
              <p className="text-rose-300 font-semibold">
                Duration: {experience.duration}
              </p>
            )}

            {experience.options && (
              <div className="space-y-2">
                <p className="text-rose-300 font-semibold">Available Options:</p>
                <ul className="space-y-2">
                  {experience.options.map((option, i) => (
                    <li key={i} className="text-gray-300 flex items-start space-x-2">
                      <span className="text-rose-400 mt-1">✓</span>
                      <span>{option}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
