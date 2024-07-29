import { it, expect } from 'vitest'
import JSONStore from "../src/store.js"

it('should successfully set an entry', async () => {
    let store = new JSONStore('store.json')
    await store.set('randomNum', 120373866342109)
    
    const result = await store.get('randomNum')
    expect(result).toBeDefined()
})