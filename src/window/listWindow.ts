import WindowManage from './manage'
import {BrowserWindow} from 'electron'
import {getCursorDisplay} from '../util'
import path from 'path'

class ListWindow<T extends {type?: string; color?: string} = any> extends WindowManage<T> {
  createWindow(args?: T) {
    const {x, y, height} = getCursorDisplay().workArea
    const winHeight = 520
    const win = new BrowserWindow({
      height: winHeight,
      width: 380,
      x: 20 + x,
      y: Math.round(y + (height - winHeight) / 2),
      modal: true,
      titleBarStyle: 'hidden',
      resizable: false,
      fullscreenable: false,
      show: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
      },
    })

    win.once('ready-to-show', () => win.show())

    win.loadFile(path.resolve(__dirname, '../../dist/list.html'), {
      query: args,
    })

    return win
  }
}

export const listWindow = new ListWindow()
