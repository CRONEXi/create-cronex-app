import fs from 'fs-extra'
import path from 'path'

export function validateProjectName(name: string): string | undefined {
  // Check if name is empty
  if (!name || name.trim() === '') {
    return 'Project name cannot be empty'
  }

  // Check for invalid characters (npm package name rules)
  const validNameRegex = /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/
  if (!validNameRegex.test(name)) {
    return 'Project name must be lowercase, alphanumeric, and may include hyphens, underscores, and dots'
  }

  // Check if directory already exists
  const projectDir = path.resolve(name)
  if (fs.existsSync(projectDir)) {
    const files = fs.readdirSync(projectDir)
    if (files.length > 0) {
      return `Directory "${name}" already exists and is not empty`
    }
  }

  return undefined
}

export function isValidProjectName(name: string): boolean {
  return validateProjectName(name) === undefined
}
