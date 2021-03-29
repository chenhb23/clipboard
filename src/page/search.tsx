import React, {useCallback, useEffect, useMemo, useState} from 'react'
import ReactDOM from 'react-dom'
import './search.css'
import {ipcRenderer, remote} from 'electron'
import type Watcher from '../main/watcher'
import type {WatcherDataItem} from '../main/watcher'
import {writeClipboard} from '../common/clipboard'
import {formatDate} from '../util'

const watcher: Watcher = remote.getGlobal('watcher')

function App() {
  const [activeIndex, _setActiveIndex] = useState(0)
  const [search, setSearch] = useState('')
  const [data] = useState<WatcherDataItem[]>(watcher.data)

  const list: WatcherDataItem[] = useMemo(() => {
    return search ? data.filter(value => value.value.includes(search)) : data
  }, [data, search])
  const activeItem = list[activeIndex]

  // console.log('activeItem', activeItem)
  // console.log(list)
  const setActive = useCallback(
    (index: number) => {
      _setActiveIndex(Math.max(0, Math.min(list.length - 1, index)))
      document.getElementById(`row-${index}`)?.scrollIntoView({block: 'nearest'})
    },
    [list.length]
  )

  const selectRow = useCallback(
    (index: number) => {
      writeClipboard(list[index])
      // todo: show console.log('已复制到粘贴板✔️')
      ipcRenderer.invoke('closeSearchWindow')
    },
    [list]
  )

  const handleKeyboard = useCallback(
    (event: KeyboardEvent) => {
      console.log(event)
      switch (event.code) {
        case 'Enter':
          return selectRow(activeIndex)
        case 'ArrowUp':
          return setActive(activeIndex - 1)
        case 'ArrowDown':
          return setActive(activeIndex + 1)
        case 'Escape':
          return ipcRenderer.invoke('closeSearchWindow')
      }
    },
    [activeIndex, selectRow, setActive]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyboard)
    return () => window.removeEventListener('keydown', handleKeyboard)
  }, [handleKeyboard])

  return (
    <div className={'container'}>
      {/*<div className='mask' />*/}
      <div className='search'>
        <svg className='icon' aria-hidden='true'>
          <use href='#icon-search' />
        </svg>
        <input
          type='text'
          className={'input'}
          autoFocus
          placeholder={'快速搜索'}
          onChange={event => {
            if (activeIndex !== 0) setActive(0)
            setSearch(event.target.value)
          }}
        />
      </div>
      <div className='drop'>
        <div className='list'>
          {list.map((value, index) => (
            <div
              onDoubleClick={() => selectRow(index)}
              key={index}
              id={`row-${index}`}
              className={`row ${activeIndex === index ? 'hover' : ''}`}
              onMouseEnter={() => setActive(index)}
            >
              <p>{value.value}</p>
            </div>
          ))}
        </div>
        <div className='detail'>
          <div className='content'>
            <pre>{activeItem?.value}</pre>
          </div>
          <p className={'time'}>{formatDate(activeItem?.time)}</p>
        </div>
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
