import { storeToRefs } from 'pinia'

import { useBookmarksStore } from '../store/bookmarks.store'

export function useBookmarksData() {
  const store = useBookmarksStore()
  const { bookmarks } = storeToRefs(store)

  return {
    bookmarks,
    isBookmarked: store.isBookmarked,
    toggleBookmark: store.toggleBookmark,
  }
}
