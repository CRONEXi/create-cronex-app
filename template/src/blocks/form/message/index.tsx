import React from 'react'

import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import { Width } from '../width'
import RichText from '@/components/rich-text'

export const Message: React.FC<{ message: DefaultTypedEditorState }> = ({ message }) => {
  return (
    <Width className="my-12" width="100">
      {message && <RichText data={message} />}
    </Width>
  )
}
