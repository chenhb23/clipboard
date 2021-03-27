// import {app, screen, BrowserWindow} from 'electron'
import {
  app,
  screen,
  BrowserWindow,
  clipboard,
  systemPreferences,
  globalShortcut,
  Tray,
  Menu,
  desktopCapturer,
  ipcMain,
} from 'electron'
import path from 'path'
import './store'
import {getCursorDisplay} from './util'
import {createMainWindow, createSearchWindow} from './window'

app.dock.hide()
console.log('__dirname', __dirname)

app.whenReady().then(() => {
  const appIcon = new Tray(path.resolve(__dirname, '../public/icon.png'))
  const context = Menu.buildFromTemplate([
    {
      label: 'about',
      click(menuItem, win, event) {
        console.log(menuItem)
      },
    },
    {
      label: '退出',
      click() {
        app.quit()
      },
    },
  ])
  appIcon.setContextMenu(context)

  const win1 = createMainWindow()
  // win1.on('ready-to-show', () => {
  //   console.log('ccccccccccccc')
  //   win1.webContents.send('aaa', '')
  // })
  // const win2 = createMainWindow()
  const win2 = createSearchWindow()
  setTimeout(() => {
    win1.webContents.send('aaa', '')
  }, 1000)
  // ipcMain
})

app.on('window-all-closed', () => {
  if (process.platform === 'darwin') {
    app.quit()
  }
})
