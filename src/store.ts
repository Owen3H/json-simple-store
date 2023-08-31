import { 
    PathLike,
    constants, 
    promises as pfs 
} from 'fs'

export default class JSONStore {
    #data = {}

    #defaultPath = '/default_store.json'
    private relativePath = ''
    private absolutePath = ''

    constructor(path: string) {
        if (!path) path = this.#defaultPath

        const firstChar = path.charAt(0)
        if (firstChar === '.') path = path.slice(1)
        if (!path.includes('/')) path = `/` + path

        this.relativePath = path
        this.absolutePath = process.cwd() + path

        this.#sync()
    }

    #sync = () => this.#getFilePath().then(async fp => {
        await this.#write(this.#data, fp)

        this.#data = require(fp)
        return this.#data
    })

    #getFilePath = async () => {
        const curPath = process.cwd() + this.relativePath,
              curFile = await this.#read(curPath)

        if (!curFile) {
            // Try make one with the same name
            const saved = await this.#write(this.#data, curPath)
            if (!saved) {
                // Error occurred, fall back to default path.
                const defaultPath = process.cwd() + this.#defaultPath,
                    hasFile = await this.#read(curPath)

                if (!hasFile) {
                    await this.#write(this.#data, curPath)    
                    console.log('Specified path is invalid! Using default file.')
    
                    return defaultPath
                }
            }
        }

        return curPath
    }

    get = (key: string) => this.#sync().then(data => data[key]) 

    async set(key: string, value: any)  {
        this.#data[key] = value
        await this.#write(this.#data)
    }

    add(key: string, items) { this.#data[key].push(items) }
    empty = () => this.#write({})

    exists = async (path: PathLike) => {
        // If no error, it was accessed successfully.
        try {
            return !!pfs.access(path, constants.F_OK)
        } catch(e) {
            return false
        }
    }

    #read = (path: PathLike) => this.exists(path) ? pfs.readFile(path).catch(() => false) : false
    #write = async (data, path?: PathLike) => {
        if (!path) path = this.absolutePath

        try { return pfs.writeFile(path, JSON.stringify(data, null, '\t')) }
        catch(e) { return false }
    }
}