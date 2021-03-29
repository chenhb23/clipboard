import {ipcMain} from 'electron'
import {listWindow, mainWindow, searchWindow} from '../window'

ipcMain.handle('createListWindow', (event, args) => listWindow.create(args))
ipcMain.handle('createSearchWindow', (event, args) => searchWindow.create())
ipcMain.handle('closeSearchWindow', () => searchWindow.close())

ipcMain.handle('resizeMain', (event, args, animate) => {
  // console.log(args, animate)
  mainWindow.resize(args, animate)
})
