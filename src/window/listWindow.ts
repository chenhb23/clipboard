import WindowManage from './manage'
import {BrowserWindow} from 'electron'
import {getCursorDisplay} from '../util'
import path from 'path'

class ListWindow<T extends string = string> extends WindowManage<T> {
  createWindow(type?: T) {
    const {height} = getCursorDisplay().workArea
    const winHeight = 400
    const win = new BrowserWindow({
      height: winHeight,
      width: 800,
      x: 20,
      y: Math.round((height - winHeight) / 2),
      // modal: true,
      // titleBarStyle: 'hidden',
      // resizable: false,
      // fullscreenable: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
      },
    })

    win.loadFile(path.resolve(__dirname, '../../dist/list.html'), {
      query: {type},
    })

    return win
  }
}

export const listWindow = new ListWindow()
