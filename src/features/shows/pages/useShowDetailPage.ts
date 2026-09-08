import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { useShowsData } from '../composables/useShowsData'

export function useShowDetailPage() {
  const route = useRoute()
  const id = route.params.id as string
  const { showDetails, detailStatus, detailError, fetchShowById } = useShowsData()

  onMounted(() => fetchShowById(id))

  const show = computed(() => showDetails.value[id])

  return { show, status: detailStatus, error: detailError }
}
