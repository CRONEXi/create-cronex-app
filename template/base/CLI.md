# create-cronex-app CLI

This document outlines the plan for `create-cronex-app` - an npx-installable CLI that scaffolds new projects from this template.

**Usage:** `npx create-cronex-app my-project`

## Technology Stack

| Library          | Purpose                                            |
| ---------------- | -------------------------------------------------- |
| `commander`      | CLI argument parsing, flags, help generation       |
| `@clack/prompts` | Modern interactive prompts (like Astro CLI)        |
| `chalk`          | Colored terminal output                            |
| `ora`            | Loading spinners                                   |
| `fs-extra`       | File system operations                             |
| `degit`          | Clone template from GitHub (faster than git clone) |

## Interactive Wizard Flow

```
┌─────────────────────────────────────────────────────┐
│  create-cronex-app                                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ◆ Project name: my-awesome-app                     │
│                                                     │
│  ◆ Database adapter:                                │
│    ● PostgreSQL (recommended)                       │
│    ○ MongoDB                                        │
│    ○ SQLite                                         │
│                                                     │
│  ◆ Additional features: (space to toggle)           │
│    ◻ better-auth - Advanced authentication          │
│    ◻ tRPC - Type-safe API layer                     │
│                                                     │
│  ◆ Package manager:                                 │
│    ● pnpm (recommended)                             │
│    ○ npm                                            │
│    ○ yarn                                           │
│    ○ bun                                            │
│                                                     │
│  ◆ Initialize git repository? Yes                   │
│                                                     │
└─────────────────────────────────────────────────────┘

◇ Creating project...
│
├ ✓ Cloned template
├ ✓ Configured PostgreSQL adapter
├ ✓ Added better-auth
├ ✓ Generated environment variables
├ ✓ Installed dependencies
└ ✓ Initialized git repository

◇ Done! Next steps:
│
│  cd my-awesome-app
│  pnpm dev
│
└ Open http://localhost:3000
```

## CLI Flags (Non-Interactive Mode)

```bash
npx create-cronex-app my-project \
  --database postgres \
  --better-auth \
  --trpc \
  --package-manager pnpm \
  --git \
  --yes  # Skip all prompts, use defaults
```

## CLI Project Structure

```
create-cronex-app/           # Separate repository
├── package.json
├── tsconfig.json
├── README.md
├── src/
│   ├── index.ts             # Entry point (bin)
│   ├── cli.ts               # Commander setup
│   ├── prompts.ts           # Interactive prompts
│   ├── create-project.ts    # Main orchestration
│   ├── installers/
│   │   ├── index.ts         # Installer registry
│   │   ├── better-auth.ts   # Adds better-auth deps & config
│   │   ├── trpc.ts          # Adds tRPC setup
│   │   └── database.ts      # Swaps DB adapter in payload.config
│   ├── helpers/
│   │   ├── clone-template.ts    # degit wrapper
│   │   ├── install-deps.ts      # Run package manager install
│   │   ├── init-git.ts          # git init
│   │   ├── generate-env.ts      # Create .env with secrets
│   │   └── update-package.ts    # Update package.json name
│   └── utils/
│       ├── logger.ts        # Chalk + ora helpers
│       ├── validate.ts      # Input validation
│       └── get-package-manager.ts
└── dist/                    # Compiled output
```

## Implementation Phases

### Phase 1: Repository & CLI Setup

1. Create new repo `create-cronex-app`
2. Initialize with package.json, tsconfig.json
3. Set up `bin` field pointing to compiled entry
4. Implement Commander.js with flags

### Phase 2: Interactive Prompts

5. Implement @clack/prompts flow
6. Add validation for project name
7. Handle flag overrides (skip prompts when flags provided)

### Phase 3: Template Scaffolding

8. Use `degit` to clone cronex-payload-template from GitHub
9. Update package.json with project name
10. Generate .env with random secrets

### Phase 4: Feature Installers

Each installer is a module that conditionally modifies the scaffolded project.

#### Installer Architecture

```typescript
// src/installers/index.ts
export interface InstallerOptions {
  projectDir: string
}

export type Installer = (options: InstallerOptions) => Promise<void>
```

#### Main Orchestration

```typescript
// src/create-project.ts
import { installBetterAuth } from './installers/better-auth'
import { installDatabase } from './installers/database'
import { installTrpc } from './installers/trpc'

interface ProjectConfig {
  name: string
  database: 'postgres' | 'mongodb' | 'sqlite'
  features: {
    betterAuth: boolean
    trpc: boolean
  }
  packageManager: 'pnpm' | 'npm' | 'yarn' | 'bun'
  initGit: boolean
}

export async function createProject(config: ProjectConfig) {
  const projectDir = path.resolve(config.name)

  // 1. Clone base template
  await cloneTemplate(projectDir)

  // 2. Update package.json name
  await updatePackageName(projectDir, config.name)

  // 3. Always run database installer (swaps adapter if not postgres)
  if (config.database !== 'postgres') {
    await installDatabase({ projectDir, database: config.database })
  }

  // 4. Conditionally run feature installers
  if (config.features.betterAuth) {
    await installBetterAuth({ projectDir })
  }

  if (config.features.trpc) {
    await installTrpc({ projectDir })
  }

  // 5. Generate .env with secrets
  await generateEnv({ projectDir, database: config.database })

  // 6. Install dependencies
  await installDependencies(projectDir, config.packageManager)

  // 7. Initialize git
  if (config.initGit) {
    await initGit(projectDir)
  }
}
```

---

#### Database Installer

```typescript
// src/installers/database.ts
import path from 'path'

import fs from 'fs-extra'

const DB_CONFIGS = {
  mongodb: {
    package: '@payloadcms/db-mongodb',
    remove: '@payloadcms/db-postgres',
    importStatement: "import { mongooseAdapter } from '@payloadcms/db-mongodb'",
    adapterCall: `mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  })`,
  },
  sqlite: {
    package: '@payloadcms/db-sqlite',
    remove: '@payloadcms/db-postgres',
    importStatement: "import { sqliteAdapter } from '@payloadcms/db-sqlite'",
    adapterCall: `sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || 'file:./payload.db',
    },
  })`,
  },
}

export async function installDatabase({
  projectDir,
  database,
}: {
  projectDir: string
  database: 'mongodb' | 'sqlite'
}) {
  const config = DB_CONFIGS[database]

  // 1. Update package.json dependencies
  const pkgPath = path.join(projectDir, 'package.json')
  const pkg = await fs.readJson(pkgPath)

  delete pkg.dependencies[config.remove]
  pkg.dependencies[config.package] = 'latest'

  await fs.writeJson(pkgPath, pkg, { spaces: 2 })

  // 2. Update payload.config.ts
  const configPath = path.join(projectDir, 'src/payload.config.ts')
  let configFile = await fs.readFile(configPath, 'utf-8')

  // Replace import
  configFile = configFile.replace(
    /import \{ postgresAdapter \} from '@payloadcms\/db-postgres'/,
    config.importStatement,
  )

  // Replace adapter call
  configFile = configFile.replace(/postgresAdapter\(\{[\s\S]*?\}\)/, config.adapterCall)

  await fs.writeFile(configPath, configFile)
}
```

---

#### better-auth Installer

```typescript
// src/installers/better-auth.ts
import crypto from 'crypto'
import path from 'path'

import fs from 'fs-extra'

export async function installBetterAuth({ projectDir }: { projectDir: string }) {
  // 1. Add dependencies
  const pkgPath = path.join(projectDir, 'package.json')
  const pkg = await fs.readJson(pkgPath)

  pkg.dependencies['better-auth'] = '^1.2.0'

  await fs.writeJson(pkgPath, pkg, { spaces: 2 })

  // 2. Create auth config
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
  const authClientContent = `import { createAuthClient } from 'better-auth/react'

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
  await fs.writeFile(path.join(projectDir, 'src/app/api/auth/[...all]/route.ts'), routeContent)

  // 5. Add env variable placeholder
  const envPath = path.join(projectDir, '.env')
  let env = await fs.readFile(envPath, 'utf-8')
  const secret = crypto.randomBytes(32).toString('base64')
  env += `\n# better-auth\nBETTER_AUTH_SECRET=${secret}\n`
  await fs.writeFile(envPath, env)
}
```

---

#### tRPC Installer

```typescript
// src/installers/trpc.ts
import fs from 'fs-extra'
import path from 'path'

export async function installTrpc({ projectDir }: { projectDir: string }) {
  // 1. Add dependencies
  const pkgPath = path.join(projectDir, 'package.json')
  const pkg = await fs.readJson(pkgPath)

  pkg.dependencies['@trpc/server'] = '^11.0.0'
  pkg.dependencies['@trpc/client'] = '^11.0.0'
  pkg.dependencies['@trpc/react-query'] = '^11.0.0'
  pkg.dependencies['@tanstack/react-query'] = '^5.0.0'
  pkg.dependencies['superjson'] = '^2.2.0'

  await fs.writeJson(pkgPath, pkg, { spaces: 2 })

  // 2. Create tRPC router
  const trpcDir = path.join(projectDir, 'src/trpc')
  await fs.ensureDir(trpcDir)

  // src/trpc/init.ts
  await fs.writeFile(
    path.join(trpcDir, 'init.ts'),
    `import { initTRPC } from '@trpc/server'
import superjson from 'superjson'

const t = initTRPC.create({
  transformer: superjson,
})

export const router = t.router
export const publicProcedure = t.procedure
`
  )

  // src/trpc/routers/_app.ts
  await fs.ensureDir(path.join(trpcDir, 'routers'))
  await fs.writeFile(
    path.join(trpcDir, 'routers/_app.ts'),
    `import { router } from '../init'
import { exampleRouter } from './example'

export const appRouter = router({
  example: exampleRouter,
})

export type AppRouter = typeof appRouter
`
  )

  // src/trpc/routers/example.ts
  await fs.writeFile(
    path.join(trpcDir, 'routers/example.ts'),
    `import { z } from 'zod'
import { router, publicProcedure } from '../init'

export const exampleRouter = router({
  hello: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => {
      return { greeting: \`Hello \${input.name ?? 'World'}!\` }
    }),
})
`
  )

  // 3. Create API route handler
  await fs.ensureDir(path.join(projectDir, 'src/app/api/trpc/[trpc]'))
  await fs.writeFile(
    path.join(projectDir, 'src/app/api/trpc/[trpc]/route.ts'),
    `import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '@/trpc/routers/_app'

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => ({}),
  })

export { handler as GET, handler as POST }
`
  )

  // 4. Create client-side provider and hooks
  await fs.writeFile(
    path.join(trpcDir, 'client.ts'),
    `'use client'

import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from './routers/_app'

export const trpc = createTRPCReact<AppRouter>()
`
  )

  await fs.writeFile(
    path.join(trpcDir, 'provider.tsx'),
    `'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { useState } from 'react'
import superjson from 'superjson'
import { trpc } from './client'

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
          transformer: superjson,
        }),
      ],
    })
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  )
}
`
  )
}

### Phase 5: Post-Scaffold
11. Run package manager install
12. Initialize git repository
13. Display next steps

### Phase 6: Build & Publish
14. Set up build with tsup or esbuild
15. Test locally with `npm link`
16. Publish to npm

## Template Requirements

Before the CLI can work, this template needs:

1. **Tag a release** - So degit can clone a stable version
2. **Make DB adapter swappable** - Ensure payload.config.ts is structured for easy replacement
3. **Document template structure** - For installer scripts to know where to inject code
```
