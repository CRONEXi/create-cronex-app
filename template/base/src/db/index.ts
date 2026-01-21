import { postgresAdapter } from '@payloadcms/db-postgres'

export const db = postgresAdapter({
  pool: {
    connectionString: process.env.DATABASE_URL || '',
  },
  // Auto-create tables on startup. Payload only manages its own tables
  // and won't touch external tables (like better-auth tables).
  push: false,
})
