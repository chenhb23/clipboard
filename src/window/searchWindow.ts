import WindowManage from './manage'
import {BrowserWindow} from 'electron'
import path from 'path'

class SearchWindow<T extends string = string> extends WindowManage<T> {
  protected createWindow() {
    const win = new BrowserWindow({
      // height: 300 + 12 * 2,
      // width: 224,
      center: true,
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      hasShadow: false,
      closable: false,
      resizable: false,
      fullscreenable: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false, // parcel 编译相关: Uncaught ReferenceError: process is not defined
        enableRemoteModule: true,
        // preload: path.join(__dirname, 'preload.js'),
      },
      // skipTaskbar: true,
      // skipTaskbar: true
      // kiosk: true, // 只允许运行一个应用
      // backgroundColor: 'blue',
      // autoHideMenuBar: true
    })
    // win.loadURL('http://localhost:1234/search.html')
    win.loadFile(path.resolve(__dirname, '../../dist/search.html'))
    // win.webContents.openDevTools()

    win.once('blur', () => this.close())

    return win
  }
}

export const searchWindow = new SearchWindow()
