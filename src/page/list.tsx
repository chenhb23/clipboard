import React, {useCallback, useMemo, useState} from 'react'
import ReactDOM from 'react-dom'
import './list.css'
import type Watcher from '../main/watcher'
import type {WatcherDataItem} from '../main/watcher'
import {ipcRenderer, remote} from 'electron'
import {formatDate} from '../util'
import {writeClipboard} from '../common/clipboard'

const watcher: Watcher = remote.getGlobal('watcher')
const urlParams = new URLSearchParams(location.search)
const format = urlParams.get('format')
const color = urlParams.get('color')

const App = () => {
  const [data, setValue] = useState(watcher.get(format))
  const [search, setSearch] = useState('')
  const list = useMemo(() => (search ? data.filter(value => value.value.includes(search)) : data), [data, search])

  const selectRow = useCallback((value: WatcherDataItem) => {
    writeClipboard(value)
    ipcRenderer.invoke('closeListWindow')
  }, [])

  return (
    <div className={'container'}>
      <p className={'title'} style={{backgroundColor: color}}>
        list
      </p>
      <input type='text' className={'search'} autoFocus onChange={event => setSearch(event.target.value)} />
      <div className='content'>
        {list.map(value => (
          <div key={value.value} className='row' onDoubleClick={() => selectRow(value)}>
            <p>{value.value}</p>
            <p className={'time'}>{formatDate(value.time)}</p>

            <div
              className='close'
              onClick={() => {
                console.log('value', value)
                watcher.remove(value)
                setValue(watcher.get(format))
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
