import {clipboard} from 'electron'

export type WatcherFormat = 'text' | 'file' | 'image' | string // 3个预设的type

export interface WatcherDataItem {
  format: WatcherFormat
  value: string
  time?: Date
}

// export interface WatcherData {
//   [key: string]: WatcherDataItem[]
// }

export default class Watcher {
  throttle = 500

  data: {[key in WatcherDataItem['format'] | string]?: WatcherDataItem[]} = {
    // text: [],
    // file: [],
    // image: [],
  }

  constructor() {
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
    const file = clipboard.read('public.file-url')
    const text = clipboard.readText()
    if (file) {
      const image = clipboard.readImage()
      this.add({
        format: !image.isEmpty() ? 'image' : 'file',
        value: file,
      })
    } else if (text) {
      this.add({format: 'text', value: text})
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
        return this.onTextChange?.(data)
      case 'file':
        return this.onFileChange?.(data)
      case 'image':
        return this.onImageChange?.(data)
    }
  }

  onTextChange(data: WatcherDataItem) {}

  onFileChange(data: WatcherDataItem) {}

  onImageChange(data: WatcherDataItem) {}
}
