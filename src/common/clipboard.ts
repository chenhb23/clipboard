import type {WatcherDataItem} from '../main/watcher'
import {clipboard} from 'electron'
// import EventEmitter from 'events'

export function writeClipboard(data: WatcherDataItem) {
  switch (data.format) {
    case 'text':
    case 'link':
      return clipboard.writeText(data.value)
    case 'image': // return clipboard.writeImage(NativeImage.createFromPath(data.value))
    case 'file':
      return clipboard.writeBuffer('public.file-url', Buffer.from(data.value))
  }
}

// class ClipboardHandle extends EventEmitter {
//   write(data: WatcherDataItem) {
//     switch (data.format) {
//       case 'text':
//         this.emit('write', data)
//         return clipboard.writeText(data.value)
//       case 'image': // return clipboard.writeImage(NativeImage.createFromPath(data.value))
//       case 'file':
//         this.emit('write', data)
//         return clipboard.writeBuffer('public.file-url', Buffer.from(data.value))
//     }
//   }
//
//   on(event: 'write', listener: (data: WatcherDataItem) => void): this
//   on(event, listener) {
//     return super.on(event, listener)
//   }
//
//   once(event: 'write', listener: (data: WatcherDataItem) => void): this
//   once(event, listener) {
//     return super.once(event, listener)
//   }
// }
//
// const clipboardHandle = new ClipboardHandle()
//
// export default clipboardHandle
