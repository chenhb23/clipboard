import {BrowserWindow} from 'electron'
import path from 'path'
import {getCursorDisplay, getWinDisplay} from './util'

export function createMainWindow() {
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
    // autoHideMenuBar: true
  })
  // win.loadURL('http://localhost:1234')
  win.loadFile(path.resolve(__dirname, '../dist/index.html'))

  const timer = setInterval(() => {
    const viewDisplay = getWinDisplay(win)
    const cursorDisplay = getCursorDisplay()
    if (viewDisplay.id !== cursorDisplay.id) {
      const {x, y, height, width} = cursorDisplay.bounds
      win.setBounds({x, y: y + (height - 200) / 2})
    }
  }, 500)
  win.on('closed', () => clearInterval(timer))
  return win

  // setTimeout(() => {
  //   win.setClosable(true)
  //   win.close()
  // }, 5000)
}

/**
 * 列表，紧靠便签
 */
export function createListWindow() {}

/**
 * 屏幕中间
 */
export function createSearchWindow() {
  const {height} = getCursorDisplay().bounds

  const win = new BrowserWindow({
    // height: 84,
    // width: 224,
    // center: true,
    // x: 0,
    // y: Math.round((height - 200) / 2),
    // frame: false,
    // transparent: true,
    // alwaysOnTop: true,
    // hasShadow: false,
    // closable: false,
    // resizable: false,
    // fullscreenable: false,
    webPreferences: {
      // devTools: true,
      webSecurity: false,
      nodeIntegration: true,
      contextIsolation: false,
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
  win.loadFile(path.resolve(__dirname, '../dist/search.html'), {
    query: {type: '2'},
  })
  win.webContents.openDevTools()
  return win
}
