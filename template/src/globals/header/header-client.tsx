'use client'

import type { Header } from '@/payload-types'

import React from 'react'
import Link from 'next/link'

import { HeaderNav } from './nav'
import { Logo } from '@/components/logo'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  return (
    <header className="border-border bg-background sticky top-0 z-20 border-b">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>
        <HeaderNav data={data} />
      </div>
    </header>
  )
}
