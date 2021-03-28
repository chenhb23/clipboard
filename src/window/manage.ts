import {BrowserWindow} from 'electron'

export default abstract class WindowManage<ARG = any> {
  protected abstract createWindow(...args: ARG[]): BrowserWindow

  win: BrowserWindow

  create(...args: ARG[]) {
    if (!this.win) {
      this.win = this.createWindow(...args)
      this.win.once('closed', () => (this.win = null))
    }
  }

  close() {
    if (this.win) {
      if (!this.win.closable) {
        this.win.setClosable(true)
      }
      this.win.close()
    }
  }
}
