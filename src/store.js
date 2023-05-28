const fs = require('fs'),
      { constants, promises: pfs } = fs

module.exports = class JSONStore {
    #defaultPath = '/default_store.json'
    relativePath = ''
    absolutePath = ''

    #data = {}

    constructor(path=this.#defaultPath) {
        const firstChar = path.charAt(0)

        if (firstChar === '.') path = path.slice(1)
        if (!path.includes('/')) path = `/` + path

        this.relativePath = path
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

    async get(key) { 
        return this.#sync().then(data => data[key]) 
    }

    async set(key, value)  {
        this.#data[key] = value
        await this.#write(this.#data)
    }

    add(key, items) { this.#data[key].push(items) }
    async empty() { await this.#write({}) }

    async exists(path) {
        // No error = accessed successfully
        return pfs.access(path, constants.F_OK).then(() => true).catch(() => false)
    }

    #read = path => this.exists(path) ? pfs.readFile(path).catch(() => false) : false
    #write = async (data, path=this.absolutePath) => pfs.writeFile(path, JSON.stringify(data, null, '\t')).catch(() => false)
}