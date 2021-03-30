import {ipcMain, nativeImage} from 'electron'
import {listWindow, mainWindow, searchWindow} from '../window'
import watcher from './watcher'

ipcMain.on('createListWindow', (event, args) => {
  if (listWindow.win) {
    listWindow.close()
  }
  listWindow.create(args)
})
// ipcMain.on('createSearchWindow', (event, args) => searchWindow.create())
ipcMain.on('closeSearchWindow', () => searchWindow.close())
ipcMain.on('closeListWindow', () => listWindow.close())

ipcMain.on('resizeMain', (event, args, animate) => {
  mainWindow.resize(args, animate)
})

ipcMain.on('onDragStart', (event, args) => {
  event.sender.startDrag({
    file: decodeURIComponent(args.file).replace(/^file:\/\//, ''),
    icon: nativeImage.createFromDataURL(watcher.icon[args.iconId]),
  })
})
