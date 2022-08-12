const fs = require('fs')

class JSONStore {
    filePath = '/db.json'
    absolutePath = ''
    data = {}

    constructor(path) {
        this.filePath = path
        this.sync()
    }

    set = (key, value) => {
        this.sync()
        this.data[key] = value

        return this
    }
    get = key => this.data[key]
    add = (key, items) => this.data[key].push(items)

    path = () => process.cwd() + this.filePath
    sync = () => {
        this.absolutePath = this.path()
        data = require(this.absolutePath)
    }
    
    save = () => this.overwrite(data)
    empty = () => this.overwrite('')
    overwrite = data => fs.writeFile(this.absolutePath, data, err => {
        if (err) throw err
        console.log(`Data written to file ${this.absolutePath}`)
    })
}

module.exports = JSONStore