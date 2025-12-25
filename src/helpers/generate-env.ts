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
      return 'mongodb://localhost:27017/payload'
    case 'sqlite':
      return 'file:./payload.db'
    case 'postgres':
    default:
      return 'postgresql://postgres:postgres@localhost:5432/payload'
  }
}

export async function generateEnv(
  projectDir: string,
  database: Database,
  options: { betterAuth?: boolean } = {}
): Promise<void> {
  const envPath = path.join(projectDir, '.env')
  const envExamplePath = path.join(projectDir, '.env.example')

  // Read .env.example if it exists
  let envContent = ''
  if (await fs.pathExists(envExamplePath)) {
    envContent = await fs.readFile(envExamplePath, 'utf-8')
  }

  // Replace placeholders with actual values
  const payloadSecret = generateSecret()
  const cronSecret = generateSecret(16)
  const previewSecret = generateSecret(16)
  const databaseUrl = getDatabaseUrl(database)

  // Update DATABASE_URL
  envContent = envContent.replace(
    /DATABASE_URL=.*/,
    `DATABASE_URL=${databaseUrl}`
  )

  // Update PAYLOAD_SECRET
  envContent = envContent.replace(
    /PAYLOAD_SECRET=.*/,
    `PAYLOAD_SECRET=${payloadSecret}`
  )

  // Update CRON_SECRET if present
  if (envContent.includes('CRON_SECRET=')) {
    envContent = envContent.replace(
      /CRON_SECRET=.*/,
      `CRON_SECRET=${cronSecret}`
    )
  }

  // Update PREVIEW_SECRET if present
  if (envContent.includes('PREVIEW_SECRET=')) {
    envContent = envContent.replace(
      /PREVIEW_SECRET=.*/,
      `PREVIEW_SECRET=${previewSecret}`
    )
  }

  // Add better-auth secret if needed
  if (options.betterAuth) {
    const betterAuthSecret = generateSecret()
    envContent += `\n# better-auth\nBETTER_AUTH_SECRET=${betterAuthSecret}\n`
  }

  await fs.writeFile(envPath, envContent)
}
