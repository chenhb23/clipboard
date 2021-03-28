import {ipcMain} from 'electron'
import {searchWindow} from '../window'

ipcMain.handle('createSearchWindow', () => searchWindow.create())
ipcMain.handle('closeSearchWindow', () => searchWindow.close())
