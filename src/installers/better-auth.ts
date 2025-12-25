import fs from 'fs-extra'
import path from 'path'
import type { InstallerOptions } from '../types.js'
import { EXTRAS_DIR } from '../helpers/index.js'
import { createSpinner } from '../utils/logger.js'

export async function installBetterAuth(options: InstallerOptions): Promise<void> {
  const { projectDir } = options

  const spinner = createSpinner('Setting up better-auth...').start()

  try {
    // 1. Copy lib files (auth.ts, auth-client.ts)
    await fs.ensureDir(path.join(projectDir, 'src', 'lib'))
    await fs.copy(
      path.join(EXTRAS_DIR, 'src', 'lib', 'auth.ts'),
      path.join(projectDir, 'src', 'lib', 'auth.ts')
    )
    await fs.copy(
      path.join(EXTRAS_DIR, 'src', 'lib', 'auth-client.ts'),
      path.join(projectDir, 'src', 'lib', 'auth-client.ts')
    )

    // 2. Copy auth API route
    await fs.copy(
      path.join(EXTRAS_DIR, 'src', 'app', 'api', 'auth'),
      path.join(projectDir, 'src', 'app', 'api', 'auth')
    )

    // 3. Load dependencies config and update package.json
    const depsConfig = await fs.readJson(path.join(EXTRAS_DIR, 'config', 'dependencies.json'))
    const authConfig = depsConfig['better-auth']

    const pkgPath = path.join(projectDir, 'package.json')
    const pkg = await fs.readJson(pkgPath)

    Object.assign(pkg.dependencies, authConfig.add)

    await fs.writeJson(pkgPath, pkg, { spaces: 2 })

    spinner.succeed('Set up better-auth')
  } catch (error) {
    spinner.fail('Failed to set up better-auth')
    throw error
  }
}
