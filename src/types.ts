export type Database = 'postgres' | 'mongodb' | 'sqlite'
export type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun'

export interface ProjectConfig {
  name: string
  database: Database
  features: {
    betterAuth: boolean
    trpc: boolean
  }
  packageManager: PackageManager
  initGit: boolean
}

export interface CLIFlags {
  database?: Database
  betterAuth?: boolean
  trpc?: boolean
  packageManager?: PackageManager
  git?: boolean
  yes?: boolean
}

export interface InstallerOptions {
  projectDir: string
}

export interface DatabaseInstallerOptions extends InstallerOptions {
  database: 'mongodb' | 'sqlite'
}
