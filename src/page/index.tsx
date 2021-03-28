import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import {ipcRenderer} from 'electron'

const App = () => {
  return (
    <div>
      <div
        className='btn'
        style={{backgroundColor: 'red'}}
        onClick={() => {
          ipcRenderer.invoke('createSearchWindow')
        }}
        // onClick='show()'
        // onMouseEnter="test('onmouseenter')"
        // onMouseLeave="test('onmouseleave')"
      >
        文本
      </div>
      <div
        className='btn'
        // style='background-color: orange'
      >
        链接
      </div>
      <div
        className='btn'
        // style='background-color: green'
      >
        文件
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
