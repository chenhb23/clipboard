import WindowManage from './manage'
import {BrowserWindow} from 'electron'
import path from 'path'
import {getCursorDisplay} from '../util'

class MainWindow extends WindowManage {
  protected createWindow() {
    const {height} = getCursorDisplay().bounds

    const win = new BrowserWindow({
      height: 200,
      width: 120,
      x: 0,
      y: Math.round((height - 200) / 2),
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      hasShadow: false,
      closable: false,
      resizable: false,
      fullscreenable: false,

      // skipTaskbar: true,
      // skipTaskbar: true
      // kiosk: true, // 只允许运行一个应用
      // backgroundColor: 'blue',
      // autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false, // parcel 编译相关: Uncaught ReferenceError: process is not defined
        enableRemoteModule: true,
      },
    })
    // win.loadURL('http://localhost:1234')
    win.loadFile(path.resolve(__dirname, '../../dist/index.html'))
    return win
  }
}

export const mainWindow = new MainWindow()
