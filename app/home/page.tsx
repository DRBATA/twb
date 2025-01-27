'use client'

import { useState } from 'react'
import { VideoBackground } from '@/components/video-background'
import { Button } from '@/components/ui/button'
import { ExperienceModal } from '@/components/experience-modal'
export default function HomePage() {
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null)

  const experiences = {
    yacht: {
      title: 'Sunrise Yacht Sessions',
      description: 'Begin your day with tranquility and purpose aboard a luxury yacht. Soak in the breathtaking sunrise over Dubai Creek, a view unobstructed by cityscapes.',
      schedule: {
        weekday: '6:00 AM - 9:00 AM (Mon-Fri)',
        weekend: '9:00 AM - 12:00 PM (Sat-Sun)'
      },
      images: ['/wellness/boat back.webp', '/wellness/boat comp.webp']
    },
    iceBath: {
      title: 'Ice Bath Experience',
      description: 'Challenge your limits and reap the benefits of cold exposure therapy. Our guided ice bath sessions help reduce inflammation and boost recovery.',
      duration: '20 minutes per session',
      images: ['/wellness/ice_bath_updated.jpg', '/wellness/ice3.webp']
    },
    reflexology: {
      title: 'Reflexology Session',
      description: 'Experience deep relaxation and energy balancing through targeted pressure points. Our expert practitioners help restore your body\'s natural flow.',
      duration: '20 minutes per session',
      images: ['/wellness/reflex1.png', '/wellness/reflex2.png']
    },
    drinks: {
      title: 'Premium Wellness Drinks',
      description: 'Enhance your experience with our curated selection of non-alcoholic beverages, each chosen for their unique health benefits.',
      options: [
        'Non-Alcoholic Red Wine - Rich in antioxidants',
        'Majalis Beer - B vitamins and natural fibers',
        'Innermost Electrolytes - Essential minerals',
        'Chaga Elixir - Immune support'
      ],
      images: ['/drinks/drinks1.webp', '/drinks/drinks2.png', '/drinks/drinks3.webp', '/drinks/drinks4.webp']
    }
  }

  return (
    <main className="relative min-h-screen">
      <VideoBackground />
      
      <div className="relative z-10 min-h-screen text-white">
        {/* Hero Section */}
        <div className="min-h-screen flex flex-col items-center justify-center p-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-teal-100 to-rose-100">
              Discover Wellness
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Begin your day with tranquility and purpose aboard a luxury yacht. Soak in the breathtaking 
              sunrise over Dubai Creek, a view unobstructed by cityscapes, and embrace the benefits of 
              early-morning light exposure.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {Object.entries(experiences).map(([key, exp]) => (
                <Button 
                  key={key}
                  onClick={() => setSelectedExperience(key)}
                  className={`bg-rose-500 hover:bg-rose-600 text-white text-lg px-6 py-4
                    shadow-lg shadow-rose-500/20 transition-all duration-300 
                    hover:shadow-xl hover:shadow-rose-500/30 hover:scale-[1.02] active:scale-100
                    ${selectedExperience === key ? 'ring-2 ring-rose-300' : ''}`}
                >
                  Explore {exp.title}
                </Button>
              ))}
            </div>
            <div className="flex gap-4 justify-center">
              <a 
                href="https://thewaterbar.ae/register" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button 
                  className="mt-12 bg-teal-500/90 hover:bg-teal-600 text-white text-xl px-12 py-6
                    shadow-lg shadow-teal-500/20 transition-all duration-300 
                    hover:shadow-xl hover:shadow-teal-500/30 hover:scale-[1.02] active:scale-100
                    border-2 border-teal-400/20"
                >
                  Book Now
                </Button>
              </a>
              <a 
                href="https://fpvbzfybmgofevvv.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button 
                  className="mt-12 bg-blue-500/90 hover:bg-blue-600 text-white text-xl px-12 py-6
                    shadow-lg shadow-blue-500/20 transition-all duration-300 
                    hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-100
                    border-2 border-blue-400/20"
                >
                  Water Tracker
                </Button>
              </a>
              <a href="/blog">
                <Button 
                  className="mt-12 bg-purple-500/90 hover:bg-purple-600 text-white text-xl px-12 py-6
                    shadow-lg shadow-purple-500/20 transition-all duration-300 
                    hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-100
                    border-2 border-purple-400/20"
                >
                  Blog
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Experience Modal */}
        {selectedExperience && (
          <ExperienceModal
            experience={experiences[selectedExperience as keyof typeof experiences]}
            onCloseAction={() => setSelectedExperience(null)}
          />
        )}

        {/* Benefits Section */}
        <div className="py-24 bg-black/40 backdrop-blur-lg">
          <div className="max-w-6xl mx-auto px-8">
            <h2 className="text-4xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-teal-100 to-rose-100">
              Wellness Benefits
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Sunrise Yacht Sessions */}
              <div>
                <h3 className="text-2xl font-bold mb-4 text-rose-300">Sunrise Yacht Sessions</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start space-x-2">
                    <span className="text-rose-400 mt-1">✓</span>
                    <span>Circadian Rhythm Regulation: Supports natural sleep-wake cycles</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-rose-400 mt-1">✓</span>
                    <span>Vitamin D Boost: Encourages healthy bone density and immune support</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-rose-400 mt-1">✓</span>
                    <span>Stress Reduction: Calms the mind with serene waterfront views</span>
                  </li>
                </ul>
              </div>

              {/* Curated Activities */}
              <div>
                <h3 className="text-2xl font-bold mb-4 text-rose-300">Curated Activities</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start space-x-2">
                    <span className="text-rose-400 mt-1">✓</span>
                    <span>Ice Bath: Reduces inflammation, improves circulation, and supports emotional resilience</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-rose-400 mt-1">✓</span>
                    <span>Reflexology: Enhances relaxation, reduces tension, and balances energy flow</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-rose-400 mt-1">✓</span>
                    <span>Community Connection: Meet like-minded individuals who uplift and inspire</span>
                  </li>
                </ul>
              </div>

              {/* Premium Drinks */}
              <div>
                <h3 className="text-2xl font-bold mb-4 text-rose-300">Premium Drinks</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start space-x-2">
                    <span className="text-rose-400 mt-1">✓</span>
                    <span>Non-Alcoholic Red Wine: Rich in polyphenols for cardiovascular health</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-rose-400 mt-1">✓</span>
                    <span>Majalis Beer: Replenishes electrolytes and supports gut health</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-rose-400 mt-1">✓</span>
                    <span>Chaga Elixir: Boosts immunity and regulates stress with adaptogens</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Info */}
        <div className="py-16 text-center bg-gradient-to-b from-black/0 to-black/40">
          <div className="max-w-4xl mx-auto px-8">
            <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-teal-100 to-rose-100">
              Experience Schedule
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-2xl font-bold text-rose-300 mb-2">Weekdays</p>
                <p className="text-gray-300">6:00 AM - 9:00 AM (Mon-Fri)</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-rose-300 mb-2">Weekends</p>
                <p className="text-gray-300">9:00 AM - 12:00 PM (Sat-Sun)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
