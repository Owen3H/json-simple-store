# json-simple-store
A simple KV store, where entries are both cached for current use, and stored in a JSON file as a database.\
**Note:** This type of local DB will not work on hosting solutions with ephemeral storage.

While the library has a similar syntax to `Map`, it is actually a plain object (`Record<string, any>`) matching the structure of JSON.\
This means you can **only use strings for keys**.

## Why?
This package was mainly made for myself - I'm sure there are more efficient solutions, but I could not find any that were both simple and not "in-memory".
Many times I have needed a local database and so I just made this out of necessity for use in other projects.

## Installation
`bun i json-simple-store`

## Creating a store
Constructs a new store with an optional path.
If no path is specified, it defaults to `default_store.json`.

> [!WARNING]
> When a store is created with a path to a file that already exists, the new store is able to overwrite it!

```ts
const customStore = new JSONStore('custom_store.json')
const defaultStore = new JSONStore()
```

## Documentation
**Get**\
Signature: `get(key: string, skipCache?: boolean) => Promise<T>`

Gets the value associated with the given key.

By default, it will try to use the cached value to prevent reading from the file.\
You can specify `true` as the last argument to access the DB directly instead of utilizing the cache.

```ts
interface MyObject {
    test: {
        count: number
        timestamp?: number
    }
}

const obj = await store.get<TestObj>('myObject')
const { count, timestamp } = obj.test
```

**Set**\
Signature: `set(key: string, value: any) => Promise<boolean>`

Overwrites or adds a new entry to the file.\
Returns a boolean indicating whether writing to the file succeeded.
```ts
const saved = await store.set('myObject', { test: { count: 69 } })

// Not allowed!
await store.set(420, { test: { count: 69 } })
```

<!-- **Add**\n
Signature: `add(key: string), items: any => Promise<boolean>`

Appends given `items` to an 
Like `set`, this also returns a boolean indicating whether the file write succeeded.
```ts

``` -->

**Clear** (`clear() => Promise<boolean>`)\
Clears every entry by writing an empty object to the file.\
Like `set`, this also returns a boolean indicating whether the file write succeeded.
```ts

```

**Exists** (`exists() => Promise<boolean>`)\
Whether the file at the absolute path (made when constructing the store) still exists.
```ts
const store = new JSONStore('example_store.json')
const created = await store.exists()
```
