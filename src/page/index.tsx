import React, {useCallback} from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import {ipcRenderer} from 'electron'

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
      <div
        className='btn'
        style={{backgroundColor: 'red'}}
        onClick={event => {
          ipcRenderer.invoke('createListWindow', 'text')
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
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
