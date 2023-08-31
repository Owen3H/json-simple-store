import JSONStore from './store'

async function run() {
    let store = new JSONStore('store.json')
    await store.set('last_tweet', 120373866342109)
    
    return await store.get('last_tweet')
}

run().then(console.log)