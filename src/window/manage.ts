import {BrowserWindow, Rectangle} from 'electron'

export default abstract class WindowManage<ARG = any> {
  protected abstract createWindow(...args: ARG[]): BrowserWindow

  public win: BrowserWindow

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

  private resizeTimer: NodeJS.Timeout
  resize(bounds: Partial<Rectangle>, animate = true) {
    clearTimeout(this.resizeTimer)
    this.resizeTimer = setTimeout(() => {
      const winBound = this.win.getBounds()
      if (Object.keys(bounds).some(key => bounds[key] !== winBound[key])) {
        this.win.setBounds(bounds, animate)
      }
    }, 25)
  }
}
