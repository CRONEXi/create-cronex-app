import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'
import { createSpinner } from '../utils/logger.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Template paths - from dist/index.js, go up one level to package root
const TEMPLATE_ROOT = path.resolve(__dirname, '..', 'template')
export const BASE_DIR = path.join(TEMPLATE_ROOT, 'base')
export const EXTRAS_DIR = path.join(TEMPLATE_ROOT, 'extras')

export async function cloneTemplate(projectDir: string): Promise<void> {
  const spinner = createSpinner('Copying template...').start()

  try {
    await fs.copy(BASE_DIR, projectDir, {
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
