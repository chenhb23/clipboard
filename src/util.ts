import {BrowserWindow, screen} from 'electron'
import path from 'path'

export const delay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms))

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

export function formatDate(timestamp: number) {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

export function trimCenter(value: string) {
  const size = 38
  if (value.length <= size) return value
  return `${value.slice(0, size / 2)}...${value.slice(-size / 2)}`
}

export function decodeValue(value: string) {
  try {
    return decodeURIComponent(value)
  } catch (e) {
    return value
  }
}

export function getNameFromPath(p: string) {
  const arr = p.replace(new RegExp(`${path.sep}$`), '').split(path.sep)
  return arr[arr.length - 1]
}
