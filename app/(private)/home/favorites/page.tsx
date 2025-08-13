import { auth } from '@/services/auth'
import { favorite } from '@/services/favorite'
import React from 'react'
import DocumentsList from '../_components/documents-list'

export default async function FavoritesPage() {
    const authedUser = await auth.getAuthedUser()
    if(!authedUser) return null
    const docs = await favorite.getUserFavoriteFiles(authedUser.id)
  return (
    <div>
      <DocumentsList summaries={docs} isFavorites />
    </div>
  )
}
