import {ipcMain} from 'electron'
import {listWindow, mainWindow, searchWindow} from '../window'

ipcMain.handle('createListWindow', (event, args) => {
  if (listWindow.win) {
    listWindow.close()
  }
  listWindow.create(args)
})
ipcMain.handle('createSearchWindow', (event, args) => searchWindow.create())
ipcMain.handle('closeSearchWindow', () => searchWindow.close())
ipcMain.handle('closeListWindow', () => listWindow.close())

ipcMain.handle('resizeMain', (event, args, animate) => {
  mainWindow.resize(args, animate)
})
