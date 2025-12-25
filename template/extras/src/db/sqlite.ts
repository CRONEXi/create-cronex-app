import { sqliteAdapter } from '@payloadcms/db-sqlite'

export const db = sqliteAdapter({
  client: {
    url: process.env.DATABASE_URL || 'file:./payload.db',
  },
})
