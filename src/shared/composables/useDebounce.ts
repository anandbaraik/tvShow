import { ref, watch, type Ref } from 'vue'

export function useDebounce<T>(source: Ref<T>, delay = 400): Ref<T> {
  const debounced = ref(source.value) as Ref<T>

  watch(source, (value, _oldValue, onCleanup) => {
    const timer = setTimeout(() => {
      debounced.value = value
    }, delay)

    onCleanup(() => clearTimeout(timer))
  })

  return debounced
}
