import {clipboard, desktopCapturer} from 'electron'
import EventEmitter from 'events'
import fs from 'fs'

export type WatcherFormat = 'text' | 'link' | 'file' | 'image' | string // 4个预设的type

export interface WatcherDataItem {
  format: WatcherFormat
  value: string
  time?: number
  iconId?: string
  rank?: number // 排序
}
// todo: 移动到 worker
export class Watcher extends EventEmitter {
  throttle = 800
  currentRank = 0

  // 改为数组形式，降低 add 方法的计算消耗
  data: WatcherDataItem[] = []
  icon: {[id: string]: string} = {}

  get(format?: WatcherFormat, sort = true) {
    const data = sort ? this.sortData() : this.data
    if (!format) return data
    return data.filter(value => value.format === format)
  }

  constructor(props?) {
    super(props)
    this.start()
  }

  // 使用函数返回，防止直接修改 this.data 内部数据的情况
  private sortData() {
    const splitData = this.data.reduce<WatcherDataItem[][]>(
      (prev, item) => {
        prev[item.rank ? 0 : 1].push(item)
        return prev
      },
      [[], []]
    )
    splitData[0].sort((a, b) => b.rank - a.rank)
    return splitData.flat()
  }

  toggleFixed(value: WatcherDataItem['value']) {
    const item = this.data.find(item => item.value === value)
    if (item) {
      item.rank = item.rank ? undefined : ++this.currentRank
      this.emit('change', this.data)
    }
  }

  restore(value: Partial<Pick<Watcher, 'data' | 'icon'>>) {
    this.data = value?.data ?? this.data
    this.icon = value?.icon ?? this.icon

    for (const item of this.data) {
      if (item.rank && item.rank > this.currentRank) {
        this.currentRank = item.rank
      }
    }
  }

  private timer: NodeJS.Timeout
  start() {
    this.timer = setInterval(this.readClipboard, this.throttle)
  }

  stop() {
    clearInterval(this.timer)
  }

  private imgExt = ['.png', '.jpg', '.jpeg']
  readClipboard = () => {
    // todo: windows for -> FileNameW
    // const file = clipboard.read('NSFilenamesPboardType')
    // console.log('clipboard.availableFormats()', clipboard.availableFormats())
    const file = clipboard.read('public.file-url')
    const text = clipboard.readText()
    if (file) {
      let isImage = false
      const filepath = decodeURIComponent(file).replace(/^file:\/\//, '') // todo: macos 以 file:// 开头
      if (
        this.imgExt.some(value => file.toLowerCase().endsWith(value)) ||
        (fs.existsSync(filepath) && fs.statSync(filepath).size <= 1024 * 1024 * 20) // 只读取20m文件
      ) {
        isImage = !clipboard.readImage().isEmpty()
      }
      this.add({format: isImage ? 'image' : 'file', value: file})
    } else if (text?.trim()) {
      this.add({format: /^ *https?:\/\/.+\..+/.test(text) ? 'link' : 'text', value: text})
    }
  }

  async add(data: WatcherDataItem) {
    if (this.data[0]?.value !== data.value) {
      const index = this.data.findIndex(value => value.value === data.value)
      const fullData: WatcherDataItem = {...data, time: Date.now(), iconId: data.iconId || this.data[index]?.iconId}

      if (!fullData.iconId) {
        const value = await desktopCapturer.getSources({types: ['window'], fetchWindowIcons: true})
        const {id, appIcon} = value[0]
        if (!this.icon[id]) {
          this.icon[id] = appIcon.resize({width: 50, height: 50}).toDataURL()
          this.emit('add-icon', this.icon)
        }
        fullData.iconId = id
      }

      if (index >= 0) {
        // 不用数组展开的方式，直接操作数组比较快
        this.data.splice(index, 1)
      }
      this.data.unshift(fullData)

      this.emit('change', this.data)
      this.onChange(fullData)
    }
  }

  remove(data: Pick<WatcherDataItem, 'format' | 'value'>) {
    const first = this.data[0]
    this.data = this.data.filter(value => value.value !== data.value || value.format !== data.format)
    this.checkClipboard(first)

    this.emit('change', this.data)
  }

  /**
   * 不传删除全部
   */
  clear(format?: WatcherFormat) {
    const first = this.data[0]
    if (format) {
      this.data = this.data.filter(value => value.format !== format)
    } else {
      this.data = []
    }
    this.checkClipboard(first)
    this.emit('change', this.data)
  }

  // 如果过滤后端的第一项和原始的第一项不相同，则清除粘贴板内容
  checkClipboard(firstItem: WatcherDataItem) {
    if (firstItem.value && firstItem.value !== this.data[0]?.value) {
      clipboard.clear()
    }
  }

  private onChange(data: WatcherDataItem) {
    switch (data.format) {
      case 'text':
        // return this.onTextChange?.(data)
        return this.emit('text-change', data)
      case 'file':
        // return this.onFileChange?.(data)
        return this.emit('file-change', data)
      case 'image':
        // return this.onImageChange?.(data)
        return this.emit('image-change', data)
      case 'link':
        // return this.onLinkChange?.(data)
        return this.emit('link-change', data)
    }
  }

  on(event: 'change', listener: (data: WatcherDataItem[]) => void): this
  on(event: 'add-icon', listener: (icon: Watcher['icon']) => void): this
  on(event: 'text-change', listener: (data: WatcherDataItem) => void): this
  on(event: 'file-change', listener: (data: WatcherDataItem) => void): this
  on(event: 'image-change', listener: (data: WatcherDataItem) => void): this
  on(event: 'link-change', listener: (data: WatcherDataItem) => void): this
  on(event, listener) {
    return super.on(event, listener)
  }

  once(event: 'change', listener: (data: WatcherDataItem[]) => void): this
  once(event: 'add-icon', listener: (icon: Watcher['icon']) => void): this
  once(event: 'text-change', listener: (data: WatcherDataItem) => void): this
  once(event: 'file-change', listener: (data: WatcherDataItem) => void): this
  once(event: 'image-change', listener: (data: WatcherDataItem) => void): this
  once(event: 'link-change', listener: (data: WatcherDataItem) => void): this
  once(event, listener) {
    return super.once(event, listener)
  }

  off(event: 'change', listener: (data: WatcherDataItem[]) => void): this
  off(event: 'add-icon', listener: (icon: Watcher['icon']) => void): this
  off(event: 'text-change', listener: (data: WatcherDataItem) => void): this
  off(event: 'file-change', listener: (data: WatcherDataItem) => void): this
  off(event: 'image-change', listener: (data: WatcherDataItem) => void): this
  off(event: 'link-change', listener: (data: WatcherDataItem) => void): this
  off(event, listener) {
    return super.off(event, listener)
  }
}

const watcher = new Watcher()

// watcher.on('change', data => {
//   // fs.writeFile
//   const USER_DATA = app.getPath('userData')
// })

// function getAppIcon() {
//   return new Promise(resolve => {
//     desktopCapturer.getSources({types: ['window'], fetchWindowIcons: true}).then(value => {
//       const {id, appIcon} = value[0]
//       if (!this.icon[id]) {
//         this.icon[id] = appIcon.toDataURL()
//       }
//       fullData.iconId = id
//     })
//   })
// }

export default watcher
