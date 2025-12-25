import fs from 'fs-extra'
import path from 'path'
import type { DatabaseInstallerOptions } from '../types.js'
import { createSpinner } from '../utils/logger.js'

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
} as const

export async function installDatabase(options: DatabaseInstallerOptions): Promise<void> {
  const { projectDir, database } = options
  const config = DB_CONFIGS[database]

  const spinner = createSpinner(`Configuring ${database} adapter...`).start()

  try {
    // 1. Update package.json dependencies
    const pkgPath = path.join(projectDir, 'package.json')
    const pkg = await fs.readJson(pkgPath)

    delete pkg.dependencies[config.remove]
    pkg.dependencies[config.package] = 'latest'

    await fs.writeJson(pkgPath, pkg, { spaces: 2 })

    // 2. Update payload.config.ts
    const configPath = path.join(projectDir, 'src/payload.config.ts')
    let configFile = await fs.readFile(configPath, 'utf-8')

    // Replace import statement
    configFile = configFile.replace(
      /import \{ postgresAdapter \} from '@payloadcms\/db-postgres'/,
      config.importStatement
    )

    // Replace adapter call
    configFile = configFile.replace(
      /postgresAdapter\(\{[\s\S]*?pool:[\s\S]*?\}\s*,?\s*\}\)/,
      config.adapterCall
    )

    await fs.writeFile(configPath, configFile)

    spinner.succeed(`Configured ${database} adapter`)
  } catch (error) {
    spinner.fail(`Failed to configure ${database} adapter`)
    throw error
  }
}
