const fs = require('fs').promises

class JSONStore {
    filePath = ''
    absolutePath = ''
    data = {}

    constructor(path='/default_store.json') {
        this.filePath = path
        this.sync()
    }

    path = () => process.cwd() + this.filePath
    sync = async () => {
        this.absolutePath = this.path()
        
        let exists = await fs.readFile(this.absolutePath).catch(() => {})
        if (!exists) {
            console.log('File does not exist, created a new one.')
            await this.#save()
        }

        this.data = require(this.absolutePath)
        return this.data
    }

    add = (key, items) => this.data[key].push(items)
    get = async key => this.sync().then(data => data[key])
    set = async(key, value) => {
        this.data[key] = value
        await this.#save()
    }
    
    #save = () => this.overwrite(this.data)
    empty = () => this.overwrite({})
    overwrite = data => fs.writeFile(this.absolutePath, JSON.stringify(data), err => {
        if (err) throw err
        console.log(`Data written to file ${this.absolutePath}`)
    })
}

module.exports = {
    JSONStore,
    store: new JSONStore()
}