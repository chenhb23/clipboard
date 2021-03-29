import {clipboard} from 'electron'
import EventEmitter from 'events'

export type WatcherFormat = 'text' | 'link' | 'file' | 'image' | string // 4个预设的type

export interface WatcherDataItem {
  format: WatcherFormat
  value: string
  time?: Date
}

// export interface WatcherData {
//   [key: string]: WatcherDataItem[]
// }

export default class Watcher extends EventEmitter {
  throttle = 500

  data: {[key in WatcherDataItem['format'] | string]?: WatcherDataItem[]} = {
    // text: [],
    // file: [],
    // image: [],
  }

  get flatData(): WatcherDataItem[] {
    return Object.keys(this.data)
      .map(key => this.data[key])
      .flat()
      .sort((a, b) => b.time.getTime() - a.time.getTime())
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

  add(data: WatcherDataItem) {
    if (!this.data[data.format]) {
      this.data[data.format] = []
    }
    const fullData = {...data, time: data.time ?? new Date()}
    if (this.data[data.format][0]?.value !== data.value) {
      this.data[data.format] = [fullData, ...this.data[data.format].filter(value => value.value !== data.value)]
      this.onChange(fullData)
    }
  }

  remove(data: Pick<WatcherDataItem, 'format' | 'value'>) {
    this.data[data.format] = this.data[data.format]?.filter(value => value.value !== data.value)
  }

  /**
   * 不传删除全部
   */
  clear(format?: WatcherFormat) {
    if (format) {
      this.data[format] = []
    } else {
      Object.keys(this.data).forEach(key => {
        this.data[key] = []
      })
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

  // onTextChange(data: WatcherDataItem) {}
  //
  // onFileChange(data: WatcherDataItem) {}
  //
  // onImageChange(data: WatcherDataItem) {}
  //
  // onLinkChange(data: WatcherDataItem) {}

  on(event: 'text-change', listener: (data: WatcherDataItem) => void): this
  on(event: 'file-change', listener: (data: WatcherDataItem) => void): this
  on(event: 'image-change', listener: (data: WatcherDataItem) => void): this
  on(event: 'link-change', listener: (data: WatcherDataItem) => void): this
  on(event, listener) {
    return super.on(event, listener)
  }

  once(event: 'text-change', listener: (data: WatcherDataItem) => void): this
  once(event: 'file-change', listener: (data: WatcherDataItem) => void): this
  once(event: 'image-change', listener: (data: WatcherDataItem) => void): this
  once(event: 'link-change', listener: (data: WatcherDataItem) => void): this
  once(event, listener) {
    return super.once(event, listener)
  }
}
