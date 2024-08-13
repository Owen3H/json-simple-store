import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    testTimeout: 6000,
    globals: true,
    watch: false,
    reporters: 'verbose',
    sequence: {
      concurrent: false
    },
    // pool: '',
    // poolOptions: {
    //   forks: {
    //     //memoryLimit: 0.15, // 15% of sys mem
    //     minForks: 2, // always use 2 threads
    //     maxForks: 6 // 6 threads is enough
    //   }
    // },
    typecheck: {
      enabled: true,
      include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)']
    },
  }
})