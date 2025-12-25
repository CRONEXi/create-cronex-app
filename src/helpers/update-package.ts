import fs from 'fs-extra'
import path from 'path'

export async function updatePackageName(projectDir: string, name: string): Promise<void> {
  const pkgPath = path.join(projectDir, 'package.json')
  const pkg = await fs.readJson(pkgPath)

  pkg.name = name

  // Remove template-specific fields
  delete pkg.repository
  delete pkg.bugs
  delete pkg.homepage

  await fs.writeJson(pkgPath, pkg, { spaces: 2 })
}
