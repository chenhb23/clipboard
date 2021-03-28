import WindowManage from './manage'
import {BrowserWindow} from 'electron'

class ListWindow extends WindowManage {
  createWindow(args: any) {
    return new BrowserWindow()
  }
}

export const listWindow = new ListWindow()
