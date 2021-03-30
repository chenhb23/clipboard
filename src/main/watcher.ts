import {clipboard, desktopCapturer} from 'electron'
import EventEmitter from 'events'

export type WatcherFormat = 'text' | 'link' | 'file' | 'image' | string // 4个预设的type

export interface WatcherDataItem {
  format: WatcherFormat
  value: string
  time?: Date
  iconId?: string
}

export class Watcher extends EventEmitter {
  throttle = 500

  // 改为数组形式，降低 add 方法的计算消耗
  data: WatcherDataItem[] = []
  icon: {[id: string]: string} = {}

  get(format?: WatcherFormat) {
    if (!format) return this.data
    return this.data.filter(value => value.format === format)
  }

  constructor(props?) {
    super(props)
    this.start()
  }

  private timer: NodeJS.Timeout
  start() {
    this.timer = setInterval(this.readClipboard, this.throttle)
  }

  stop() {
    clearInterval(this.timer)
  }

  readClipboard = () => {
    // todo: id: icon dataUrl, 前提: 需要持久化
    // desktopCapturer.getSources({types: ['window'], fetchWindowIcons: true}).then(value => {
    //   fs.writeFileSync(path.resolve(__dirname, value[0].name), value[0].appIcon.toPNG())
    // })

    const file = clipboard.read('public.file-url')
    const text = clipboard.readText()
    if (file) {
      const image = clipboard.readImage()
      this.add({
        format: !image.isEmpty() ? 'image' : 'file',
        value: file,
      })
    } else if (text?.trim()) {
      this.add({format: /^ *https?:\/\/.+\..+/.test(text) ? 'link' : 'text', value: text})
    }
  }

  async add(data: WatcherDataItem) {
    if (this.data[0]?.value !== data.value) {
      const fullData = {...data, time: data.time ?? new Date()}
      // console.time('desktopCapturer')
      const value = await desktopCapturer.getSources({types: ['window'], fetchWindowIcons: true})
      const {id, appIcon} = value[0]
      if (!this.icon[id]) {
        this.icon[id] = appIcon.resize({width: 50, height: 50}).toDataURL()
      }
      fullData.iconId = id
      // console.timeEnd('desktopCapturer')

      this.data = [fullData, ...this.data.filter(value => value.value !== data.value)]
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
  on(event: 'text-change', listener: (data: WatcherDataItem) => void): this
  on(event: 'file-change', listener: (data: WatcherDataItem) => void): this
  on(event: 'image-change', listener: (data: WatcherDataItem) => void): this
  on(event: 'link-change', listener: (data: WatcherDataItem) => void): this
  on(event, listener) {
    return super.on(event, listener)
  }

  once(event: 'change', listener: (data: WatcherDataItem[]) => void): this
  once(event: 'text-change', listener: (data: WatcherDataItem) => void): this
  once(event: 'file-change', listener: (data: WatcherDataItem) => void): this
  once(event: 'image-change', listener: (data: WatcherDataItem) => void): this
  once(event: 'link-change', listener: (data: WatcherDataItem) => void): this
  once(event, listener) {
    return super.once(event, listener)
  }

  off(event: 'change', listener: (data: WatcherDataItem[]) => void): this
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

global.watcher = watcher

export default watcher
