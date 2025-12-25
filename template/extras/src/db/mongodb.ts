import { mongooseAdapter } from '@payloadcms/db-mongodb'

export const db = mongooseAdapter({
  url: process.env.DATABASE_URL || '',
})
