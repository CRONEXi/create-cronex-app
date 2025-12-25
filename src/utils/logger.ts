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
  console.log()
  console.log(chalk.bold('  Next steps:'))
  console.log()
  console.log(chalk.dim('  1.'), `cd ${projectName}`)
  console.log(chalk.dim('  2.'), 'Update .env with your database credentials')
  console.log(chalk.dim('  3.'), `${packageManager} dev`)
  console.log()
  console.log(chalk.dim('  Open'), chalk.cyan('http://localhost:3000'))
  console.log()
}
