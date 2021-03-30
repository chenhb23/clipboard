import React, {useCallback, useMemo, useState} from 'react'
import ReactDOM from 'react-dom'
import './list.css'
import type {WatcherDataItem, Watcher} from '../main/watcher'
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
  const list = useMemo(
    () =>
      search
        ? data
            .filter(value => value.value.toLowerCase().includes(search.toLowerCase()))
            .sort((a, b) => {
              const searchLower = search.toLowerCase()
              return a.value.toLowerCase().indexOf(searchLower) - b.value.toLowerCase().indexOf(searchLower)
            })
        : data,
    [data, search]
  )

  const selectRow = useCallback((value: WatcherDataItem) => {
    writeClipboard(value)
    ipcRenderer.invoke('closeListWindow')
  }, [])

  return (
    <div className={'container'}>
      <p className={'title'} style={{backgroundColor: color}}>
        list
      </p>
      <div className={'search-container'}>
        {!!search && !!list[0] && (
          <div className={'search-wait ellipsis'}>
            <span style={{visibility: 'hidden'}}>{search}</span> — {list[0].value}
          </div>
        )}
        <input
          type='text'
          className={'search'}
          autoFocus
          onChange={event => setSearch(event.target.value)}
          onKeyDown={event => {
            if (event.code === 'Enter' && search && list.length) {
              selectRow(list[0])
            }
          }}
        />
      </div>
      <ScrollView>
        {list.map(value => (
          <div
            title={value.value}
            key={value.value}
            className='row'
            onDoubleClick={() => selectRow(value)}
            onMouseDown={event => {
              if (event.button === 2) {
                const context = remote.Menu.buildFromTemplate([{label: '复制到粘贴板', click: () => selectRow(value)}])
                context.popup()
              }
            }}
          >
            {value.format === 'image' ? (
              <img className={'left'} src={value.value} alt={''} />
            ) : (
              <img className={'left'} src={watcher.icon[value.iconId]} alt={''} />
            )}
            <div className='right'>
              <p className={'ellipsis'}>{value.value}</p>
              <p className={'time'}>{formatDate(value.time)}</p>
            </div>

            <svg
              className='icon close'
              onClick={() => {
                watcher.remove(value)
                setValue(watcher.get(format))
              }}
            >
              <use href='#icon-delete' />
            </svg>
          </div>
        ))}
      </ScrollView>
    </div>
  )
}

const ScrollView: React.FC<{direction?: 'row' | 'column'}> = props => {
  return (
    <div className={'scrollView'} style={{flexDirection: props.direction ?? 'column'}}>
      {props.children}
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
