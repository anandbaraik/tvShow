import { nextTick, ref } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useDebounce } from './useDebounce'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useDebounce', () => {
  it('does not update before the delay elapses', async () => {
    const source = ref('a')
    const debounced = useDebounce(source, 400)

    source.value = 'b'
    await nextTick()
    vi.advanceTimersByTime(399)

    expect(debounced.value).toBe('a')
  })

  it('updates once the delay elapses', async () => {
    const source = ref('a')
    const debounced = useDebounce(source, 400)

    source.value = 'b'
    await nextTick()
    vi.advanceTimersByTime(400)

    expect(debounced.value).toBe('b')
  })

  it('resets the timer on rapid successive changes, committing only the last value', async () => {
    const source = ref('a')
    const debounced = useDebounce(source, 400)

    source.value = 'b'
    await nextTick()
    vi.advanceTimersByTime(200)

    source.value = 'c'
    await nextTick()
    vi.advanceTimersByTime(200)
    expect(debounced.value).toBe('a')

    vi.advanceTimersByTime(200)
    expect(debounced.value).toBe('c')
  })
})
