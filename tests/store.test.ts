import { expect, suite, test } from 'vitest'
import JSONStore from "../src/store.js"

let store: JSONStore = null

suite('setup', () => {
    test('init new store creates valid file', async () => {
        store = new JSONStore('store.json')

        const created = await store.exists('store.json')
        expect(created).toBe(true)
    })
})

suite('primitives', async () => {
    const num = 120373866342109

    test('can set into file', async () => {
        const err = await store.set('randomNum', num)
        expect(err).toBeTruthy()
    })

    test('can read key/value back', async () => {
        const result = await store.get('randomNum')

        expect(result).toBeDefined()
        expect(result).toBe(num)
    })
})

suite.skip('object', async () => {
    
})