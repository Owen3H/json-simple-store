import { beforeAll } from "vitest"
import { promises as pfs } from 'fs'

beforeAll(async () => {
    try {
        await pfs.unlink('default_store.json')
    } catch (_) {}

    try {
        await pfs.unlink('store.json')
    } catch (_) {}

    // Ensures they are deleted before tests run.
    await new Promise(resolve => setTimeout(resolve, 400))
})