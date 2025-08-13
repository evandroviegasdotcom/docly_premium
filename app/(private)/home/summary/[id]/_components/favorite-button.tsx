"use client"

import { Button } from '@/components/ui/button'
import { favorite } from '@/services/favorite'
import { Bookmark } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'
import useSWR from 'swr'

export default function FavoriteButton({
    authedUserId,
    docId
}: {
    authedUserId: string 
    docId: string
}) {
    const { data: isFavorited, mutate: refreshFavorite, isLoading } = useSWR(`/api/is-favorited/${docId}`, () => favorite.isFavorited(docId, authedUserId))
    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    
        try {
            if(isFavorited) {
                //remove from the favorites list
                await favorite.removeFavorite(docId, authedUserId)
                toast.success("Removed from favorites.")
            } else {
                // add to the favorites list
                await favorite.addFavorite(docId, authedUserId)
                toast.success("Added to the favorites")
            }
            refreshFavorite()
        } catch (error: any) {
          toast.error(error?.message || "Something went wrong");
        }
      };
  return (
    <Button className="flex items-center gap-1" variant="outline" disabled={isLoading} onClick={toggleFavorite}>
    <span>Add to favorites</span>
    <Bookmark fill={isFavorited ? "black" : "none"} />
  </Button>
  )
}
