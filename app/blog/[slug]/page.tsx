import { notFound } from 'next/navigation'
import { ClientVideoBackground } from '@/app/components/client-video-background'
import Link from 'next/link'
import { readFile } from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'

interface BlogPostProps {
  params: {
    slug: string
  }
}

interface PostData {
  title: string
  date: string
  tags: string[]
  image: string
  author: string
  content: string
}

async function getPostData(slug: string): Promise<PostData | null> {
  const postsDirectory = path.join(process.cwd(), 'app/blog/posts')
  const fullPath = path.join(postsDirectory, `${slug}.mdx`)

  try {
    const fileContents = await readFile(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    
    return {
      title: data.title,
      date: data.date,
      tags: data.tags,
      image: data.image,
      author: data.author,
      content
    }
  } catch (error) {
    return null
  }
}

const options = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHighlight],
  },
}

export default async function BlogPost({ params }: BlogPostProps) {
  const post = await getPostData(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="relative min-h-screen">
      <ClientVideoBackground />
      
      <div className="relative z-10 min-h-screen text-white pt-24">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-8">
            <Link 
              href="/blog"
              className="text-rose-400 hover:text-rose-300 transition-colors inline-flex items-center"
            >
              ← Back to Journal
            </Link>
          </div>

          {/* Article Header */}
          <header className="mb-12">
            <div className="flex gap-2 mb-4">
              {post.tags.map(tag => (
                <span 
                  key={tag}
                  className="text-sm text-rose-300 bg-rose-500/10 px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-teal-100 to-rose-100">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-gray-400">
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.author}</span>
            </div>
          </header>

          {/* Featured Image */}
          <div className="aspect-[2/1] relative rounded-lg overflow-hidden mb-12">
            <img
              src={post.image}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {/* Article Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <MDXRemote source={post.content} options={options} />
          </div>

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t border-white/10">
            <div className="flex justify-between items-center">
              <div className="text-gray-400">
                Share this article:
                {/* Add social share buttons here */}
              </div>
              <Link 
                href="/blog"
                className="text-rose-400 hover:text-rose-300 transition-colors"
              >
                More articles →
              </Link>
            </div>
          </footer>
        </article>
      </div>
    </main>
  )
}
