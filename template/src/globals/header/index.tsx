import type { Header } from '@/payload-types'

import { HeaderClient } from './header-client'
import { getCachedGlobal } from '@/utilities/get-globals'

export async function Header() {
  const headerData: Header = await getCachedGlobal('header', 1)()

  return <HeaderClient data={headerData} />
}
