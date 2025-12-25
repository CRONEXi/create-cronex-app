import degit from 'degit'
import { createSpinner } from '../utils/logger.js'

const TEMPLATE_REPO = 'CRONEXi/cronex-payload-template'

export async function cloneTemplate(projectDir: string): Promise<void> {
  const spinner = createSpinner('Cloning template...').start()

  try {
    const emitter = degit(TEMPLATE_REPO, {
      cache: false,
      force: true,
      verbose: false,
    })

    await emitter.clone(projectDir)
    spinner.succeed('Cloned template')
  } catch (error) {
    spinner.fail('Failed to clone template')
    throw error
  }
}
