import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true, // Enable global variables like `describe`, `it`, etc.
    environment: 'happy-dom', // Use the happy-dom environment for testing
  },
})