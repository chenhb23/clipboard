import React, {useCallback} from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import {ipcRenderer} from 'electron'

const btns = [
  {format: 'text', text: '文本', color: '#F6563F'},
  {format: 'file', text: '文件', color: '#e29d35'},
  {format: 'image', text: '图片', color: '#469f20'},
  {format: 'link', text: '链接', color: '#357bd7'},
]
// todo: 在 ipcMain 端设置 height
const windowHeight = btns.length * (45 - 1) + 8 * 2
ipcRenderer.invoke('resizeMain', {height: windowHeight})

const App = () => {
  const mouseEnter = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    ipcRenderer.invoke('resizeMain', {width: 100})
    event.currentTarget.classList.add('hover')
  }, [])
  const mouseLeave = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    ipcRenderer.invoke('resizeMain', {width: 20})
    event.currentTarget.classList.remove('hover')
  }, [])

  return (
    <div>
      {btns.map(value => (
        <div
          key={value.format}
          className='btn'
          style={{backgroundColor: value.color}}
          onClick={event => {
            ipcRenderer.invoke('createListWindow', {format: value.format, color: value.color})
            mouseLeave(event)
          }}
          onMouseEnter={mouseEnter}
          onMouseLeave={mouseLeave}
        >
          {value.text}
        </div>
      ))}
      {/*<div
        className='btn'
        style={{backgroundColor: 'red'}}
        onClick={event => {
          ipcRenderer.invoke('createListWindow', {type: 'text', color: 'red'})
          mouseLeave(event)
        }}
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseLeave}
      >
        文本
      </div>
      <div className='btn' onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} style={{backgroundColor: 'orange'}}>
        链接
      </div>
      <div className='btn' onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} style={{backgroundColor: 'green'}}>
        文件
      </div>*/}
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
