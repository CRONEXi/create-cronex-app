import fs from 'fs-extra'
import path from 'path'
import type { InstallerOptions } from '../types.js'
import { createSpinner } from '../utils/logger.js'

export async function installBetterAuth(options: InstallerOptions): Promise<void> {
  const { projectDir } = options

  const spinner = createSpinner('Setting up better-auth...').start()

  try {
    // 1. Add dependencies to package.json
    const pkgPath = path.join(projectDir, 'package.json')
    const pkg = await fs.readJson(pkgPath)

    pkg.dependencies['better-auth'] = '^1.2.0'

    await fs.writeJson(pkgPath, pkg, { spaces: 2 })

    // 2. Create auth server config
    const authConfigContent = `import { betterAuth } from 'better-auth'
import { Pool } from 'pg'

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  emailAndPassword: {
    enabled: true,
  },
})

export type Session = typeof auth.$Infer.Session
`

    await fs.ensureDir(path.join(projectDir, 'src/lib'))
    await fs.writeFile(path.join(projectDir, 'src/lib/auth.ts'), authConfigContent)

    // 3. Create auth client
    const authClientContent = `'use client'

import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
})

export const { signIn, signUp, signOut, useSession } = authClient
`

    await fs.writeFile(path.join(projectDir, 'src/lib/auth-client.ts'), authClientContent)

    // 4. Create API route
    const routeContent = `import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'

export const { GET, POST } = toNextJsHandler(auth.handler)
`

    await fs.ensureDir(path.join(projectDir, 'src/app/api/auth/[...all]'))
    await fs.writeFile(
      path.join(projectDir, 'src/app/api/auth/[...all]/route.ts'),
      routeContent
    )

    spinner.succeed('Set up better-auth')
  } catch (error) {
    spinner.fail('Failed to set up better-auth')
    throw error
  }
}
