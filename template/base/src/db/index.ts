import { postgresAdapter } from '@payloadcms/db-postgres'

export const db = postgresAdapter({
  pool: {
    connectionString: process.env.DATABASE_URL || '',
  },
})
