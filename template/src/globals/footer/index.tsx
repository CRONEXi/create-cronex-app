import type { Footer } from '@/payload-types'

import React from 'react'
import Link from 'next/link'

import { ThemeToggle } from '@/providers/theme/theme-toggle'

import { getCachedGlobal } from '@/utilities/get-globals'
import { CMSLink } from '@/components/link'
import { Logo } from '@/components/logo'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []

  return (
    <footer className="border-border dark:bg-card bg-background text-foreground mt-auto border-t">
      <div className="container flex flex-col gap-8 py-8 md:flex-row md:justify-between">
        <Link className="flex items-center" href="/">
          <Logo />
        </Link>

        <div className="flex flex-col-reverse items-start gap-4 md:flex-row md:items-center">
          <ThemeToggle />
          <nav className="flex flex-col gap-4 md:flex-row">
            {navItems.map(({ link }, i) => {
              return <CMSLink key={i} {...link} />
            })}
          </nav>
        </div>
      </div>
    </footer>
  )
}
