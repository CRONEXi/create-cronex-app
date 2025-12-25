import path from 'path'
import { fileURLToPath } from 'url'

import { Categories } from '@/collections/categories/categories.config'
import { Media } from '@/collections/media/media.config'
import { Pages } from '@/collections/pages/pages.config'
import { Posts } from '@/collections/posts/posts.config'
import { Users } from '@/collections/users/users.config'
import { defaultLexical } from '@/fields/default-lexical'
import { Footer } from '@/globals/footer/footer.config'
import { Header } from '@/globals/header/header.config'
import { db } from '@/db'
import { buildConfig, PayloadRequest } from 'payload'
import sharp from 'sharp'

import { plugins } from './plugins'
import { getServerSideURL } from '@/utilities/get-URL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db,
  collections: [Pages, Posts, Media, Categories, Users],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer],
  plugins,
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
})
