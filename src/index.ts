// import {app, screen, BrowserWindow} from 'electron'
import {app, clipboard, globalShortcut, Tray, Menu, BrowserWindow} from 'electron'
import path from 'path'
import './main/store'
import './main/handle'
import {mainWindow, searchWindow} from './window'

app.dock.hide()

app.whenReady().then(() => {
  globalShortcut.register('command+j', () => {
    searchWindow.win ? searchWindow.close() : searchWindow.create()
  })

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
        // app.quit()
        mainWindow.close()
      },
    },
  ])
  appIcon.setContextMenu(context)
  mainWindow.create()

  app.on('activate', () => {
    if (!BrowserWindow.getAllWindows().length) {
      mainWindow.create()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
