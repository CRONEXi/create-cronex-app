import fs from 'fs-extra'
import path from 'path'
import type { InstallerOptions } from '../types.js'
import { createSpinner } from '../utils/logger.js'

export async function installTrpc(options: InstallerOptions): Promise<void> {
  const { projectDir } = options

  const spinner = createSpinner('Setting up tRPC...').start()

  try {
    // 1. Add dependencies to package.json
    const pkgPath = path.join(projectDir, 'package.json')
    const pkg = await fs.readJson(pkgPath)

    pkg.dependencies['@trpc/server'] = '^11.0.0'
    pkg.dependencies['@trpc/client'] = '^11.0.0'
    pkg.dependencies['@trpc/react-query'] = '^11.0.0'
    pkg.dependencies['@tanstack/react-query'] = '^5.0.0'
    pkg.dependencies['superjson'] = '^2.2.0'

    await fs.writeJson(pkgPath, pkg, { spaces: 2 })

    // 2. Create tRPC directory structure
    const trpcDir = path.join(projectDir, 'src/trpc')
    await fs.ensureDir(trpcDir)
    await fs.ensureDir(path.join(trpcDir, 'routers'))

    // 3. Create init.ts
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

    // 4. Create routers/_app.ts
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

    // 5. Create routers/example.ts
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

    // 6. Create API route handler
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

    // 7. Create client.ts
    await fs.writeFile(
      path.join(trpcDir, 'client.ts'),
      `'use client'

import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from './routers/_app'

export const trpc = createTRPCReact<AppRouter>()
`
    )

    // 8. Create provider.tsx
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

    spinner.succeed('Set up tRPC')
  } catch (error) {
    spinner.fail('Failed to set up tRPC')
    throw error
  }
}
