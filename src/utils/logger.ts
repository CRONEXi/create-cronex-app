import chalk from 'chalk'
import ora, { type Ora } from 'ora'

export const logger = {
  info: (message: string) => console.log(chalk.blue('ℹ'), message),
  success: (message: string) => console.log(chalk.green('✓'), message),
  warning: (message: string) => console.log(chalk.yellow('⚠'), message),
  error: (message: string) => console.log(chalk.red('✖'), message),
  log: (message: string) => console.log(message),
  break: () => console.log(),
}

export function createSpinner(text: string): Ora {
  return ora({
    text,
    color: 'cyan',
  })
}

export function title() {
  console.log()
  console.log(chalk.bold.cyan('  create-cronex-app'))
  console.log(chalk.dim('  Payload CMS + Next.js template'))
  console.log()
}

export function nextSteps(projectName: string, packageManager: string) {
  const runCmd = packageManager === 'npm' ? 'npm run' : packageManager

  console.log()
  console.log(chalk.bold('  Next steps:'))
  console.log()

  let step = 1

  console.log(chalk.dim(`  ${step++}.`), `cd ${projectName}`)
  console.log(chalk.dim(`  ${step++}.`), 'Start your database (e.g., docker-compose up -d)')
  console.log(chalk.dim(`  ${step++}.`), `${runCmd} dev`)
  console.log()
  console.log(chalk.dim('  Open'), chalk.cyan('http://localhost:3000/admin'), chalk.dim('to create your first admin user'))
  console.log()
}
