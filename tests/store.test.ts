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

suite('primitive', async () => {
    const key = 'testNum'
    const num = 120373866342109

    test('can set key', async () => {
        const err = await store.set(key, num)
        expect(err).toBeTruthy()
    })

    test('can read value back from key', async () => {
        const result = await store.get(key)

        expect(result).toBeDefined()
        expect(result).toBe(num)
    })
})

suite('object', async () => {
        const key = 'testObj'
    const obj = { 
        randomNum: 120373866342109,
        randomStr: "blehbleh69", 
        nestedObj: {
            randomBool: false
        }
    }

    test('can set key', async () => {
        const err = await store.set(key, obj)
        expect(err).toBeTruthy()
    })

    test('can read value back from key', async () => {
        const result = await store.get(key)

        expect(result).toBeDefined()
        expect(result).toEqual(obj)
    })
})