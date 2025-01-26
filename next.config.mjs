import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const config = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  generateBuildId: async () => {
    // This will generate a new build ID on each build
    return `build-${Date.now()}`
  },
  experimental: {
    serverComponentsExternalPackages: ['jsonwebtoken']
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(mp4|webm)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/videos/',
          outputPath: 'static/videos/',
          name: '[name].[hash].[ext]',
        },
      },
    })
    return config
  }
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

export default withMDX(config)
