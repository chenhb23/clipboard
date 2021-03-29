import {
  app,
  clipboard,
  globalShortcut,
  Tray,
  Menu,
  BrowserWindow,
  MenuItemConstructorOptions,
  nativeImage,
} from 'electron'
import path from 'path'
import watcher from './main/store'
import './main/handle'
import {mainWindow, searchWindow} from './window'
import {writeClipboard} from './common/clipboard'
import {delay, trimCenter} from './util'

app.dock.hide()
const baseMenu: MenuItemConstructorOptions[] = [
  {type: 'separator'},
  {
    label: '清除全部',
    click: () => {
      clipboard.clear()
      watcher.clear()
    },
  },
  {type: 'separator'},
  {
    label: '退出',
    click() {
      mainWindow.close()
      app.quit()
    },
    // accelerator: 'command+q',
  },
]

let appIcon: Tray
const icon = nativeImage.createFromPath(path.resolve(__dirname, '../public/icon.png'))
const iconActive = nativeImage.createFromPath(path.resolve(__dirname, '../public/icon-active.png'))

function createMenuContext(): Menu {
  return Menu.buildFromTemplate([
    ...watcher.data.slice(0, 18).map(value => ({
      label: trimCenter(value.value),
      click: async () => {
        writeClipboard(value)
        appIcon.setImage(iconActive)
        await delay(800)
        appIcon.setImage(icon)
      },
    })),
    ...baseMenu,
  ])
}

app.whenReady().then(() => {
  appIcon = new Tray(icon)
  appIcon.on('mouse-down', () => appIcon.setContextMenu(createMenuContext()))

  mainWindow.create()

  globalShortcut.register('command+j', () => (searchWindow.win ? searchWindow.close() : searchWindow.create()))
  globalShortcut.register('command+u', () => appIcon.popUpContextMenu(createMenuContext()))
})

app.on('activate', () => {
  if (!BrowserWindow.getAllWindows().length) {
    mainWindow.create()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
