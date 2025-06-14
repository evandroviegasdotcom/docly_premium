import { auth } from '@/services/auth'
import { file } from '@/services/file'
import { Simonetta } from 'next/font/google'
import Link from 'next/link'
import React from 'react'
import DocumentsList from '../_components/documents-list'


export default async function Documents() {
  const authedUser = await auth.getAuthedUser()
  if (!authedUser?.id) return

  const summaries = await file.getUserSummaries(authedUser.id)

  return (
    <div>


      <DocumentsList summaries={summaries} />
  
    </div>
  )
}
