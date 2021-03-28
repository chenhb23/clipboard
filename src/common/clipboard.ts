import type {WatcherDataItem} from '../main/watcher'
import {clipboard} from 'electron'

export function writeClipboard(data: WatcherDataItem) {
  switch (data.format) {
    case 'text':
      return clipboard.writeText(data.value)
    case 'image': // return clipboard.writeImage(NativeImage.createFromPath(data.value))
    case 'file':
      return clipboard.writeBuffer('public.file-url', Buffer.from(data.value))
  }
}
