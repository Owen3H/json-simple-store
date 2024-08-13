import { assertType, expect, expectTypeOf, suite, test } from 'vitest'
import JSONStore from "../src/store.js"

let store: JSONStore = null

suite('setup', async () => {
    // test('[NO PATH] store construction creates a valid file', async () => {
    //     const defaultStore = new JSONStore()

    //     const created = await defaultStore.exists()
    //     expect(created).toBe(true)
    // })

    test('[CUSTOM PATH] store construction creates a valid file', async () => {
        store = new JSONStore('store.json')
        //await store.init()

        // const created = await store.exists()
        // expect(created).toBe(true)
    })
})

suite('primitive', async () => {
    const key = 'testNum'
    const num = 120373866342109

    test('can set key', async () => {
        const success = await store.set(key, num)
        expect(success).toBeTruthy()
    })

    test('can read value back from key', async () => {
        const result = await store.get<number>(key)

        expect(result).toBeDefined()
        expect(result).toBe(num)
    })
})

interface TestObj {
    randomNum: number,
    randomStr: string, 
    nestedObj: {
        randomBool: boolean
    }
}

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
        const success = await store.set(key, obj)
        expect(success).toBeTruthy()
    })

    test('can read value back from key', async () => {
        const result: TestObj = await store.get(key)

        expect(result).toBeDefined()

        assertType<TestObj>(result)
        expect(result).toEqual(obj)
    })
})