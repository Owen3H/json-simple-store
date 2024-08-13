import { 
    PathLike,
    constants, 
    promises as pfs 
} from 'fs'

import { resolve } from 'path'

export default class JSONStore {
    #data: Record<string, any> = {}

    #defaultPath = 'default_store.json'
    private relativePath = ''
    private absolutePath = ''

    #initialized: boolean

    constructor(path?: string) {
        if (!path) path = this.#defaultPath

        const firstChar = path.charAt(0)
        if (firstChar === '/') path = path.slice(1)
   
        this.relativePath = path
        this.absolutePath = resolve(path)
    }

    init = async () => {
        if (!this.#initialized) await this.#syncWithFile()
        this.#initialized = true
    }

    #syncWithFile = async () => {
        const path = await this.#getFilePath()
        //await JSONStore.#write(this.#data, path)

        const contents = await this.#read(path)
        this.#data = JSON.parse(contents)

        return this.#data
    }

    #getFilePath = async () => {
        const curPath = resolve(this.relativePath)
        console.log(curPath)

        // #region Return curPath (make it if it doesn't exist).
        let curExists = await JSONStore.#exists(curPath)
        if (curExists) return curPath

        // Saving succeeded, able to return path.
        const saved = await JSONStore.#write(this.#data, curPath)
        if (saved) return curPath
        //#endregion
        
        const defaultPath = resolve(this.#defaultPath)

        // #region All previous failed, return defaultPath (make it if it doesn't exist).
        const defaultExists = await JSONStore.#exists(defaultPath)
        if (defaultExists) return defaultPath 

        if (!defaultExists) {
            await JSONStore.#write(this.#data, defaultPath)    
            console.log('Specified path is invalid! Using default file.')

            return defaultPath
        }
        //#endregion
    }

    /**
     * Grabs the value from using the given key.
     * @param key The unique name used to access a value in the store.
     * @returns The value associated with the key, or `undefined` if the key does not exist. 
     */
    get = async <T>(key: string): Promise<T> => {
        // If key is unavailable, try sync data with DB.
        if (!this.#data[key]) await this.#syncWithFile()
        return this.#data[key]
    }

    set(key: string, value: any)  {
        this.#data[key] = value
        return this.overwrite(this.#data)
    }

    // /**
    //  * @param key The unique name used to access a value in the store.
    //  * @param args The arguments to add to the accessed value. Supports `string`, `array` and `object`.
    //  */
    // append(key: string, ...args: any[]) {
    //     const value = this.#data[key]
    //     const type = typeof(value)

    //     if (Array.isArray(value)) return (this.#data[key] as any[]).push(...args)
    //     if (type == 'string') return (this.#data[key] as string).concat(...args)

    //     // Must be regular object
    //     throw new TypeError(`Type of the value associated with key '${key}' is not appendable.`)
    // }

    /**
     * Merges the data from this store with data from the specified store.\
     * If only the cache is updated, this method is essentially synchronous.\
     * @param store Another store instance. 
     * @param updateCache If the file should be written to with result of the merge. 
     * @param updateDB If the file should be written to with result of the merge. 
     */
    async merge(store: JSONStore, updateCache = true, updateDB = false) {
        const merged = { ...this.#data, ...store.#data }
        
        if (updateCache) this.#data = merged
        if (updateDB) await this.overwrite(merged)

        return merged
    }

    clearCache = () => this.#data = {}

    exists = async () => JSONStore.#exists(this.absolutePath)
    static #exists = async (path: PathLike) => {
        try { return pfs.access(path, constants.F_OK) } 
        catch(_) { return false }
    }
    
    #read = (path: PathLike): Promise<string | null> => 
        JSONStore.#exists(path) ? pfs.readFile(path, 'utf-8').catch(null) : null

    overwrite = (data: any) => JSONStore.#write(data, this.absolutePath)

    static #write = async (data: any, path?: PathLike) => {
        try { 
            await pfs.writeFile(path, JSON.stringify(data, null, '\t'))
            return true
        }
        catch(_) { return false }
    }
}