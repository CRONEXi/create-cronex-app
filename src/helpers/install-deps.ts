import { spawn } from 'child_process'
import type { PackageManager } from '../types.js'
import { getInstallCommand } from '../utils/get-package-manager.js'
import { createSpinner } from '../utils/logger.js'

export async function installDependencies(
  projectDir: string,
  packageManager: PackageManager
): Promise<void> {
  const spinner = createSpinner(`Installing dependencies with ${packageManager}...`).start()

  const command = getInstallCommand(packageManager)
  const [cmd, ...args] = command.split(' ')

  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd: projectDir,
      stdio: 'pipe',
      shell: true,
    })

    let errorOutput = ''

    child.stderr?.on('data', (data) => {
      errorOutput += data.toString()
    })

    child.on('close', (code) => {
      if (code === 0) {
        spinner.succeed('Installed dependencies')
        resolve()
      } else {
        spinner.fail('Failed to install dependencies')
        reject(new Error(`Install failed with code ${code}: ${errorOutput}`))
      }
    })

    child.on('error', (error) => {
      spinner.fail('Failed to install dependencies')
      reject(error)
    })
  })
}
