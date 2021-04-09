import {app} from 'electron'
import path from 'path'
import fs from 'fs'

const configPath = path.resolve(app.getAppPath(), 'config')
const configFileName = 'config'

export class Store {
  data: any = {}
  timer: {[key: string]: NodeJS.Timeout} = {}

  constructor() {
    if (!fs.existsSync(configPath)) {
      fs.mkdirSync(configPath)
    }
    // 恢复数据
    this.data.config = this.get(configFileName)
  }

  set(key: string, value: any) {
    this.data[key] = value
    clearTimeout(this.timer[key])
    this.timer[key] = setTimeout(() => {
      fs.writeFile(path.resolve(configPath, key), JSON.stringify(value), err => {
        if (!err) console.log('write finish!')
      })
    }, 50)
  }

  get<T = any>(key: string): T {
    if (this.data[key] === undefined) {
      const keyPath = path.resolve(configPath, key)
      if (fs.existsSync(keyPath)) {
        try {
          this.data[key] = JSON.parse(fs.readFileSync(keyPath).toString())
        } catch (e) {}
      } else {
        this.data[key] = null
      }
    }
    return this.data[key]
  }

  remove(key: string) {
    delete this.data[key]

    const keyPath = path.resolve(configPath, key)
    if (fs.existsSync(keyPath)) {
      fs.unlink(keyPath, err => {
        if (!err) console.log('delete finish')
      })
    }
  }
}

export const store = new Store()
