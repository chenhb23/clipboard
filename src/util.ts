import {BrowserWindow, screen} from 'electron'

/**
 * 获取鼠标所在的显示器
 */
export function getCursorDisplay() {
  return screen.getDisplayNearestPoint(screen.getCursorScreenPoint())
}

/**
 * 获取窗口所在的显示器
 */
export function getWinDisplay(win: BrowserWindow) {
  return screen.getDisplayNearestPoint(win.getBounds())
}
