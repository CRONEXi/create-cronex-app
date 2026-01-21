import fs from 'fs-extra'
import path from 'path'
import type { DatabaseInstallerOptions } from '../types.js'
import { EXTRAS_DIR } from '../helpers/index.js'
import { createSpinner } from '../utils/logger.js'

export async function installDatabase(options: DatabaseInstallerOptions): Promise<void> {
  const { projectDir, database } = options

  const spinner = createSpinner(`Configuring ${database} adapter...`).start()

  try {
    // 1. Copy the db adapter file from extras
    const dbSource = path.join(EXTRAS_DIR, 'src', 'db', `${database}.ts`)
    const dbDest = path.join(projectDir, 'src', 'db', 'index.ts')

    await fs.copy(dbSource, dbDest)

    // 2. Copy the database-specific docker-compose file
    const dockerSource = path.join(EXTRAS_DIR, 'docker', `docker-compose.${database}.yml`)
    const dockerDest = path.join(projectDir, 'docker-compose.yml')

    await fs.copy(dockerSource, dockerDest)

    // 3. Load dependencies config
    const depsConfig = await fs.readJson(path.join(EXTRAS_DIR, 'config', 'dependencies.json'))
    const dbConfig = depsConfig[database]

    // 4. Update package.json
    const pkgPath = path.join(projectDir, 'package.json')
    const pkg = await fs.readJson(pkgPath)

    // Remove old dependencies
    for (const dep of dbConfig.remove || []) {
      delete pkg.dependencies[dep]
    }

    // Add new dependencies
    Object.assign(pkg.dependencies, dbConfig.add)

    await fs.writeJson(pkgPath, pkg, { spaces: 2 })

    spinner.succeed(`Configured ${database} adapter`)
  } catch (error) {
    spinner.fail(`Failed to configure ${database} adapter`)
    throw error
  }
}
