/**
 * Stub file for type-checking purposes only.
 * This file mimics the payload.config.ts that will exist in the generated project.
 * It exports a minimal config that satisfies the type requirements.
 */
import { buildConfig } from 'payload'

const config = buildConfig({
  collections: [],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: './payload-types.ts',
  },
  // This is a stub - the real config will have a proper db adapter
  db: undefined as any,
})

export default config
