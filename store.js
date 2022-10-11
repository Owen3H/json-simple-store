const fs = require('fs'),
      { constants, promises: pfs } = fs

class JSONStore {
    #defaultPath = '/default_store.json'
    relativePath = ''
    absolutePath = ''

    data = {}

    constructor(path=this.#defaultPath) {
        this.relativePath = path
        this.sync()
    }

    sync = async () => this.getFilePath().then(async fp => {
        await this.write(this.data, fp)

        this.data = require(fp)
        return this.data
    })

    getFilePath = async () => {
        let curPath = process.cwd() + this.relativePath,
            curFile = await this.read(curPath)

        if (!curFile) {
            // try make one with same name
            let saved = await this.write(this.data, curPath)
            if (!saved) {
                // if error, use default.
                let defaultPath = process.cwd() + this.#defaultPath,
                    hasFile = await this.read(curPath)

                if (!hasFile) {
                    await this.write(this.data, curPath)    
                    console.log('Specified path is invalid! Using default file.')
    
                    return defaultPath
                }
            }
        }

        return curPath
    }

    empty = () => this.write({})
    add = (key, items) => this.data[key].push(items)
    get = async key => this.sync().then(data => data[key])
    set = async(key, value) => {
        this.data[key] = value
        await this.write(this.data)
    }
    
    exists = path => pfs.access(path, constants.F_OK).then(() => true).catch(() => false)

    read = path => this.exists(path) ? pfs.readFile(path).catch(() => false) : false
    write = async (data, path=this.absolutePath) => pfs.writeFile(path, JSON.stringify(data, null, '\t')).catch(() => false)
}

module.exports = JSONStore