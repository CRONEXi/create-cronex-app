import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'
import { createSpinner } from '../utils/logger.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Template is at the package root /template folder
// From dist/index.js, go up one level to package root
const TEMPLATE_DIR = path.resolve(__dirname, '..', 'template')

export async function cloneTemplate(projectDir: string): Promise<void> {
  const spinner = createSpinner('Copying template...').start()

  try {
    await fs.copy(TEMPLATE_DIR, projectDir, {
      filter: (src) => {
        // Exclude files/folders that shouldn't be copied
        const basename = path.basename(src)
        return !['node_modules', '.git', '.next', '.turbo'].includes(basename)
      },
    })
    spinner.succeed('Copied template')
  } catch (error) {
    spinner.fail('Failed to copy template')
    throw error
  }
}
