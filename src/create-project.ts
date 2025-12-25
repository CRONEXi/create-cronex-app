import * as p from '@clack/prompts'
import fs from 'fs-extra'
import path from 'path'
import {
  cloneTemplate,
  generateEnv,
  initGit,
  installDependencies,
  updatePackageName,
} from './helpers/index.js'
import { installBetterAuth, installDatabase, installTrpc } from './installers/index.js'
import type { ProjectConfig } from './types.js'
import { nextSteps } from './utils/logger.js'

export async function createProject(config: ProjectConfig): Promise<void> {
  const projectDir = path.resolve(config.name)

  // Check if directory exists and is not empty
  if (await fs.pathExists(projectDir)) {
    const files = await fs.readdir(projectDir)
    if (files.length > 0) {
      p.cancel(`Directory "${config.name}" already exists and is not empty`)
      process.exit(1)
    }
  }

  console.log()
  p.log.step('Creating project...')
  console.log()

  try {
    // 1. Clone base template
    await cloneTemplate(projectDir)

    // 2. Update package.json name
    await updatePackageName(projectDir, config.name)

    // 3. Swap database adapter if not postgres
    if (config.database !== 'postgres') {
      await installDatabase({ projectDir, database: config.database })
    }

    // 4. Install better-auth if selected
    if (config.features.betterAuth) {
      await installBetterAuth({ projectDir })
    }

    // 5. Install tRPC if selected
    if (config.features.trpc) {
      await installTrpc({ projectDir })
    }

    // 6. Generate .env file with secrets
    await generateEnv(projectDir, config.database, {
      betterAuth: config.features.betterAuth,
    })

    // 7. Install dependencies
    await installDependencies(projectDir, config.packageManager)

    // 8. Initialize git repository
    if (config.initGit) {
      await initGit(projectDir)
    }

    // Done!
    p.outro('Project created successfully!')
    nextSteps(config.name, config.packageManager)
  } catch (error) {
    // Clean up on failure
    if (await fs.pathExists(projectDir)) {
      await fs.remove(projectDir)
    }

    p.cancel('Failed to create project')
    console.error(error)
    process.exit(1)
  }
}
