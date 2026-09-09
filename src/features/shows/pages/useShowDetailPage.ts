import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { useShowsData } from '../composables/useShowsData'
import { useBookmarksData } from '../../bookmarks/composables/useBookmarksData'

export function useShowDetailPage() {
  const route = useRoute()
  const id = route.params.id as string
  const { showDetails, detailStatus, detailError, fetchShowById } = useShowsData()
  const { isBookmarked, toggleBookmark } = useBookmarksData()

  onMounted(() => fetchShowById(id))

  const show = computed(() => showDetails.value[id])
  const bookmarked = computed(() => isBookmarked(id))

  function toggleShowBookmark() {
    if (show.value) toggleBookmark(show.value)
  }

  return { show, status: detailStatus, error: detailError, bookmarked, toggleShowBookmark }
}
