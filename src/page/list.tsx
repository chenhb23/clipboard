import React, {useState} from 'react'
import ReactDOM from 'react-dom'
import './list.css'
import type Watcher from '../main/watcher'
import {remote} from 'electron'

const watcher: Watcher = remote.getGlobal('watcher')

const App = () => {
  const [data, setValue] = useState(watcher.get(new URLSearchParams(location.search).get('type')))

  return (
    <div className={'container'}>
      <p className={'title'}>list</p>
      <input type='text' />
      <div className='content'>
        {data.map(value => (
          <p key={value.value}>{value.value}</p>
        ))}
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
