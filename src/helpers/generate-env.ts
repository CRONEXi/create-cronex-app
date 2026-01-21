import crypto from 'crypto'
import fs from 'fs-extra'
import path from 'path'
import type { Database } from '../types.js'

function generateSecret(length: number = 32): string {
  return crypto.randomBytes(length).toString('base64')
}

function getDatabaseUrl(database: Database): string {
  switch (database) {
    case 'mongodb':
      // Use 127.0.0.1 instead of localhost to avoid IPv6 issues with Docker
      return 'mongodb://127.0.0.1:27017/payload'
    case 'sqlite':
      return 'file:./payload.db'
    case 'postgres':
    default:
      // Use 127.0.0.1 instead of localhost to avoid IPv6 issues with Docker
      // Matches docker-compose.postgres.yml credentials
      return 'postgresql://payload:payload@127.0.0.1:5432/payload'
  }
}

export async function generateEnv(projectDir: string, database: Database): Promise<void> {
  const envPath = path.join(projectDir, '.env')

  // Generate all secrets
  const payloadSecret = generateSecret()
  const cronSecret = generateSecret(16)
  const previewSecret = generateSecret(16)
  const databaseUrl = getDatabaseUrl(database)

  const envContent = `# Database
DATABASE_URL=${databaseUrl}

# Payload
PAYLOAD_SECRET=${payloadSecret}

# Server URL (used for CORS, links, etc.)
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# Preview & Cron secrets
PREVIEW_SECRET=${previewSecret}
CRON_SECRET=${cronSecret}
`

  await fs.writeFile(envPath, envContent)
}
