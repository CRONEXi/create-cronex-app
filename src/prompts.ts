import * as p from '@clack/prompts'
import chalk from 'chalk'
import type { CLIFlags, Database, PackageManager, ProjectConfig } from './types.js'
import { detectPackageManager } from './utils/get-package-manager.js'
import { validateProjectName } from './utils/validate.js'

interface PromptOptions {
  projectName?: string
  flags: CLIFlags
}

export async function runPrompts(options: PromptOptions): Promise<ProjectConfig | null> {
  console.log()
  p.intro(chalk.bgCyan.black(' create-cronex-app '))

  const { projectName: initialName, flags } = options

  // Project name
  let projectName: string
  if (initialName && !validateProjectName(initialName)) {
    projectName = initialName
  } else {
    const nameResult = await p.text({
      message: 'Project name',
      placeholder: 'my-cronex-app',
      defaultValue: 'my-cronex-app',
      validate: (value) => {
        const error = validateProjectName(value)
        return error || undefined
      },
    })

    if (p.isCancel(nameResult)) {
      p.cancel('Operation cancelled')
      return null
    }

    projectName = nameResult
  }

  // Database selection
  let database: Database
  if (flags.database) {
    database = flags.database
  } else {
    const dbResult = await p.select({
      message: 'Database adapter',
      options: [
        { value: 'postgres', label: 'PostgreSQL', hint: 'recommended' },
        { value: 'mongodb', label: 'MongoDB' },
        { value: 'sqlite', label: 'SQLite', hint: 'for development' },
      ],
      initialValue: 'postgres',
    })

    if (p.isCancel(dbResult)) {
      p.cancel('Operation cancelled')
      return null
    }

    database = dbResult as Database
  }

  // Features selection
  let features = {
    trpc: flags.trpc || false,
  }

  if (!flags.trpc) {
    const featuresResult = await p.multiselect({
      message: 'Additional features',
      options: [
        { value: 'trpc', label: 'tRPC', hint: 'Type-safe API layer' },
      ],
      required: false,
    })

    if (p.isCancel(featuresResult)) {
      p.cancel('Operation cancelled')
      return null
    }

    features = {
      trpc: (featuresResult as string[]).includes('trpc'),
    }
  }

  // Package manager selection
  let packageManager: PackageManager
  if (flags.packageManager) {
    packageManager = flags.packageManager
  } else {
    const detected = detectPackageManager()
    const pmResult = await p.select({
      message: 'Package manager',
      options: [
        { value: 'pnpm', label: 'pnpm', hint: detected === 'pnpm' ? 'detected' : 'recommended' },
        { value: 'npm', label: 'npm', hint: detected === 'npm' ? 'detected' : undefined },
        { value: 'yarn', label: 'yarn', hint: detected === 'yarn' ? 'detected' : undefined },
        { value: 'bun', label: 'bun', hint: detected === 'bun' ? 'detected' : undefined },
      ],
      initialValue: detected,
    })

    if (p.isCancel(pmResult)) {
      p.cancel('Operation cancelled')
      return null
    }

    packageManager = pmResult as PackageManager
  }

  // Git initialization
  let initGit: boolean
  if (flags.git !== undefined) {
    initGit = flags.git
  } else {
    const gitResult = await p.confirm({
      message: 'Initialize git repository?',
      initialValue: true,
    })

    if (p.isCancel(gitResult)) {
      p.cancel('Operation cancelled')
      return null
    }

    initGit = gitResult
  }

  return {
    name: projectName,
    database,
    features,
    packageManager,
    initGit,
  }
}
