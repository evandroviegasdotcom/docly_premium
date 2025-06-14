import React from 'react'
import QuickUpload from '../_components/quick-upload'
import DocumentsList from '../_components/documents-list'
import { file } from '@/services/file'
import { auth } from '@/services/auth'

export default async function DashboardPage() {
    const authedUser = await auth.getAuthedUser()
    if(!authedUser) return
    const summaries = await file.getFourLatestUserSummaries(authedUser.id)
    return (
    <div>
    <QuickUpload />
    <DocumentsList summaries={summaries} />  
    </div>
  )
}
