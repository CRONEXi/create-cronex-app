import type { PackageManager } from '../types.js'

export function detectPackageManager(): PackageManager {
  // Check npm_config_user_agent for the package manager that invoked us
  const userAgent = process.env.npm_config_user_agent

  if (userAgent) {
    if (userAgent.startsWith('pnpm')) return 'pnpm'
    if (userAgent.startsWith('yarn')) return 'yarn'
    if (userAgent.startsWith('bun')) return 'bun'
    if (userAgent.startsWith('npm')) return 'npm'
  }

  // Default to pnpm as it's the recommended package manager
  return 'pnpm'
}

export function getInstallCommand(packageManager: PackageManager): string {
  switch (packageManager) {
    case 'pnpm':
      return 'pnpm install'
    case 'yarn':
      return 'yarn'
    case 'bun':
      return 'bun install'
    case 'npm':
    default:
      return 'npm install'
  }
}

export function getRunCommand(packageManager: PackageManager, script: string): string {
  switch (packageManager) {
    case 'pnpm':
      return `pnpm ${script}`
    case 'yarn':
      return `yarn ${script}`
    case 'bun':
      return `bun run ${script}`
    case 'npm':
    default:
      return `npm run ${script}`
  }
}
