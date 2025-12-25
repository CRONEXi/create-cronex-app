import fs from 'fs-extra'
import path from 'path'
import type { InstallerOptions } from '../types.js'
import { EXTRAS_DIR } from '../helpers/index.js'
import { createSpinner } from '../utils/logger.js'

export async function installTrpc(options: InstallerOptions): Promise<void> {
  const { projectDir } = options

  const spinner = createSpinner('Setting up tRPC...').start()

  try {
    // 1. Copy tRPC source files
    await fs.copy(
      path.join(EXTRAS_DIR, 'src', 'trpc'),
      path.join(projectDir, 'src', 'trpc')
    )

    // 2. Copy tRPC API route
    await fs.copy(
      path.join(EXTRAS_DIR, 'src', 'app', 'api', 'trpc'),
      path.join(projectDir, 'src', 'app', 'api', 'trpc')
    )

    // 3. Load dependencies config and update package.json
    const depsConfig = await fs.readJson(path.join(EXTRAS_DIR, 'config', 'dependencies.json'))
    const trpcConfig = depsConfig['trpc']

    const pkgPath = path.join(projectDir, 'package.json')
    const pkg = await fs.readJson(pkgPath)

    Object.assign(pkg.dependencies, trpcConfig.add)

    await fs.writeJson(pkgPath, pkg, { spaces: 2 })

    spinner.succeed('Set up tRPC')
  } catch (error) {
    spinner.fail('Failed to set up tRPC')
    throw error
  }
}
