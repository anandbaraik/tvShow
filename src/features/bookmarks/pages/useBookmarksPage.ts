import { useBookmarksData } from '../composables/useBookmarksData'

export function useBookmarksPage() {
  const { bookmarks } = useBookmarksData()

  return { bookmarks }
}
