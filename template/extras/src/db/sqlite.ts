import { sqliteAdapter } from '@payloadcms/db-sqlite'

export const db = sqliteAdapter({
  client: {
    url: process.env.DATABASE_URL || 'file:./payload.db',
  },
  // Auto-create tables on startup. Payload only manages its own tables
  // and won't touch external tables (like better-auth tables).
  push: true,
})
