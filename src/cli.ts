import { Command } from 'commander'
import { createProject } from './create-project.js'
import { runPrompts } from './prompts.js'
import type { CLIFlags, Database, PackageManager } from './types.js'

const VALID_DATABASES: Database[] = ['postgres', 'mongodb', 'sqlite']
const VALID_PACKAGE_MANAGERS: PackageManager[] = ['pnpm', 'npm', 'yarn', 'bun']

export function createCLI() {
  const program = new Command()

  program
    .name('create-cronex-app')
    .description('Create a new Payload CMS + Next.js project')
    .version('0.1.0')
    .argument('[project-name]', 'Name of the project')
    .option('-d, --database <type>', `Database adapter (${VALID_DATABASES.join(', ')})`)
    .option('--better-auth', 'Include better-auth for authentication')
    .option('--trpc', 'Include tRPC for type-safe API')
    .option('-p, --package-manager <pm>', `Package manager (${VALID_PACKAGE_MANAGERS.join(', ')})`)
    .option('--git', 'Initialize git repository')
    .option('--no-git', 'Skip git initialization')
    .option('-y, --yes', 'Skip prompts and use defaults')
    .action(async (projectName: string | undefined, options: CLIFlags) => {
      // Validate database option
      if (options.database && !VALID_DATABASES.includes(options.database)) {
        console.error(`Invalid database: ${options.database}. Must be one of: ${VALID_DATABASES.join(', ')}`)
        process.exit(1)
      }

      // Validate package manager option
      if (options.packageManager && !VALID_PACKAGE_MANAGERS.includes(options.packageManager)) {
        console.error(`Invalid package manager: ${options.packageManager}. Must be one of: ${VALID_PACKAGE_MANAGERS.join(', ')}`)
        process.exit(1)
      }

      // If --yes flag, use defaults
      if (options.yes) {
        const config = {
          name: projectName || 'my-cronex-app',
          database: options.database || 'postgres',
          features: {
            betterAuth: options.betterAuth || false,
            trpc: options.trpc || false,
          },
          packageManager: options.packageManager || 'pnpm',
          initGit: options.git !== false,
        }
        await createProject(config)
        return
      }

      // Run interactive prompts
      const config = await runPrompts({
        projectName,
        flags: options,
      })

      if (config) {
        await createProject(config)
      }
    })

  return program
}
