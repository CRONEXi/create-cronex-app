import { spawn } from 'child_process'
import { createSpinner, logger } from '../utils/logger.js'

function runGitCommand(args: string[], cwd: string): Promise<{ success: boolean; error?: string }> {
  return new Promise((resolve) => {
    const child = spawn('git', args, {
      cwd,
      stdio: 'pipe',
      shell: true,
    })

    let stderr = ''
    child.stderr?.on('data', (data) => {
      stderr += data.toString()
    })

    child.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true })
      } else {
        resolve({ success: false, error: stderr })
      }
    })

    child.on('error', (error) => {
      resolve({ success: false, error: error.message })
    })
  })
}

export async function initGit(projectDir: string): Promise<void> {
  const spinner = createSpinner('Initializing git repository...').start()

  // Initialize git
  const initResult = await runGitCommand(['init'], projectDir)
  if (!initResult.success) {
    spinner.fail('Failed to initialize git repository')
    return
  }

  // Add all files
  const addResult = await runGitCommand(['add', '.'], projectDir)
  if (!addResult.success) {
    spinner.warn('Initialized git repository (could not stage files)')
    return
  }

  // Create initial commit - this might fail if git user isn't configured
  const commitResult = await runGitCommand(
    ['commit', '-m', 'Initial commit from create-cronex-app'],
    projectDir
  )

  if (!commitResult.success) {
    // Check if it's a user config issue
    if (commitResult.error?.includes('user.email') || commitResult.error?.includes('user.name')) {
      spinner.warn('Initialized git repository (run `git config` to set user before committing)')
    } else {
      spinner.warn('Initialized git repository (initial commit skipped)')
    }
    return
  }

  spinner.succeed('Initialized git repository')
}
