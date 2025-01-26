'use client'

import { useState } from 'react'
import { ClientVideoBackground } from '@/app/components/client-video-background'
import Link from 'next/link'

export default function BlogPage() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const categories = [
    { name: 'Yacht Sessions', tag: 'yacht' },
    { name: 'Ice Bath', tag: 'ice-bath' },
    { name: 'Reflexology', tag: 'reflexology' },
    { name: 'Wellness Drinks', tag: 'drinks' }
  ]

  const posts = [
    {
      title: 'The Science Behind Ice Bath Recovery',
      excerpt: 'Discover how cold exposure therapy enhances physical and mental wellbeing...',
      image: '/wellness/ice_bath_updated.jpg',
      date: 'January 26, 2025',
      tags: ['ice-bath', 'wellness'],
      slug: 'ice-bath-science'
    },
    {
      title: 'Dawn on Dubai Creek: A Morning Ritual',
      excerpt: 'Experience the tranquility of sunrise yoga sessions aboard our luxury yacht...',
      image: '/wellness/boat back.webp',
      date: 'January 25, 2025',
      tags: ['yacht', 'wellness'],
      slug: 'dawn-ritual'
    },
    {
      title: 'Crafting Our Signature Wellness Drinks',
      excerpt: 'Behind the scenes of our carefully curated non-alcoholic beverage selection...',
      image: '/drinks/drinks1.webp',
      date: 'January 24, 2025',
      tags: ['drinks', 'wellness'],
      slug: 'signature-drinks'
    }
  ]

  const filteredPosts = selectedTag 
    ? posts.filter(post => post.tags.includes(selectedTag))
    : posts

  return (
    <main className="relative min-h-screen">
      <ClientVideoBackground />
      
      <div className="relative z-10 min-h-screen text-white pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-teal-100 to-rose-100">
              The Water Bar Journal
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Stories, insights, and journeys in wellness from Dubai&apos;s premier morning experience
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex justify-center gap-4 mb-12">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-4 py-2 rounded-full transition-all ${
                !selectedTag 
                  ? 'bg-rose-500 text-white' 
                  : 'bg-black/50 text-gray-300 hover:bg-black/70'
              }`}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category.tag}
                onClick={() => setSelectedTag(category.tag)}
                className={`px-4 py-2 rounded-full transition-all ${
                  selectedTag === category.tag
                    ? 'bg-rose-500 text-white'
                    : 'bg-black/50 text-gray-300 hover:bg-black/70'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map(post => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden border border-rose-500/20 hover:border-rose-500/40 transition-all block"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex gap-2 mb-3">
                    {post.tags.map(tag => (
                      <span 
                        key={tag}
                        className="text-xs text-rose-300 bg-rose-500/10 px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-xl font-bold mb-2 text-rose-100">{post.title}</h2>
                  <p className="text-gray-300 mb-4 text-sm">{post.excerpt}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">{post.date}</span>
                    <span className="text-rose-400 group-hover:text-rose-300 transition-colors">
                      Read more →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
