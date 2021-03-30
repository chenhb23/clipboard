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

// const find = (value: string, match: string) => {
//   if (value.includes(match)) return true
//   let cur = 0
//   for (const char of value) {
//     if (char === match[cur]) {
//       cur++
//       if (cur >= match.length) return true
//     }
//   }
//   return false
// }

const App = () => {
  const [data, setValue] = useState(watcher.get(format))
  const [search, setSearch] = useState('')
  const list = useMemo(
    () =>
      search
        ? data
            .filter(value => value.value.toLowerCase().includes(search.toLowerCase()))
            // .filter(value => find(value.value.toLowerCase(), search.toLowerCase()))
            .sort((a, b) => {
              const searchLower = search.toLowerCase()
              return a.value.toLowerCase().indexOf(searchLower) - b.value.toLowerCase().indexOf(searchLower)
              // return a.value.toLowerCase().indexOf(searchLower[0]) - b.value.toLowerCase().indexOf(searchLower[0])
            })
        : data,
    [data, search]
  )

  const selectRow = useCallback((value: WatcherDataItem) => {
    writeClipboard(value)
    ipcRenderer.send('closeListWindow')
  }, [])

  return (
    <div className={'container'}>
      <p className={'title'} style={{backgroundColor: color}} />
      <div className={'search-container'}>
        {!!search && !!list[0] && (
          <div className={'search-wait ellipsis'}>
            <span style={{visibility: 'hidden'}}>{search}</span> — {list[0].value}
          </div>
        )}
        <input
          type='text'
          placeholder={'搜索'}
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
        {list.map(value => {
          const isFile = ['image', 'file'].includes(value.format)
          const decodeName = decodeURIComponent(value.value)

          return (
            <div
              title={decodeName}
              key={value.value}
              className='row'
              draggable={isFile}
              onDragStart={event => {
                event.preventDefault()
                ipcRenderer.send('onDragStart', {file: value.value, iconId: value.iconId})
              }}
              onDoubleClick={() => selectRow(value)}
              onMouseDown={event => {
                if (event.button === 2) {
                  const context = remote.Menu.buildFromTemplate([
                    {label: '复制到粘贴板', click: () => selectRow(value)},
                  ])
                  context.popup()
                }
              }}
            >
              <img
                className={'left'}
                src={value.format === 'image' ? value.value : watcher.icon[value.iconId]}
                alt={''}
              />
              <div className='right'>
                <p className={'ellipsis'}>{decodeName}</p>
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
          )
        })}
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
