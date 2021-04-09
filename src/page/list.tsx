import React, {useCallback, useEffect, useMemo, useState} from 'react'
import ReactDOM from 'react-dom'
import './list.css'
import type {WatcherDataItem, Watcher} from '../main/watcher'
import {ipcRenderer, remote} from 'electron'
import {decodeValue, formatDate, getNameFromPath} from '../util'
import {writeClipboard} from '../common/clipboard'
import {VirtualList} from '../components/VirtualList'
import {Icon} from '../components/Icon'

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
  const [fixedStatus, setFixedStatus] = useState(false)
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

  useEffect(() => {
    ipcRenderer.invoke('getFixedStatus').then(setFixedStatus)
  }, [])

  return (
    <div className={'container'}>
      <p className={'title'} style={{backgroundColor: color}}>
        <Icon
          iconName={fixedStatus ? 'fixed' : 'fix'}
          onClick={() => ipcRenderer.invoke('toggleFixedStatus').then(setFixedStatus)}
        />
      </p>
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
      <VirtualList
        list={list}
        // itemHeight={50}
        renderItem={item => {
          const isFile = ['image', 'file'].includes(item.format)
          // const decodeName = decodeName(item.value)
          const decodeName = decodeValue(item.value)
          // const decodeName = item.value

          return (
            <div
              title={decodeName}
              key={decodeName}
              className='row'
              draggable={isFile}
              onDragStart={event => {
                event.preventDefault()
                ipcRenderer.send('onDragStart', {file: item.value, iconId: item.iconId})
              }}
              onDoubleClick={() => selectRow(item)}
              onMouseDown={event => {
                if (event.button === 2) {
                  const context = remote.Menu.buildFromTemplate([{label: '复制到粘贴板', click: () => selectRow(item)}])
                  context.popup()
                }
              }}
            >
              {/*<div
                key={`${item.fixed}`}
                style={{
                  position: 'absolute',
                  left: -15,
                  top: -15,
                  width: 30,
                  height: 30,
                  backgroundColor: item.fixed ? 'red' : 'blue',
                  transform: 'rotate(45deg)',
                }}
                onClick={() => {
                  watcher.toggleFixed(item.value)
                  setValue(watcher.get(format))
                }}
              >
                <span style={{color: '#fff'}}>{item.fixed ? 'true' : 'false'}</span>
              </div>*/}
              <img className={'left'} src={item.format === 'image' ? item.value : watcher.icon[item.iconId]} alt={''} />
              <div className='right'>
                {isFile ? (
                  <>
                    <p className={'ellipsis'}>{getNameFromPath(decodeName)}</p>
                    <p className={'subtitle ellipsis'}>{decodeName}</p>
                  </>
                ) : (
                  <p className={'ellipsis'}>{decodeName}</p>
                )}

                <p className={'subtitle'}>{formatDate(item.time)}</p>
              </div>

              <Icon
                className={'close'}
                iconName={'delete'}
                onClick={() => {
                  watcher.remove(item)
                  setValue(watcher.get(format))
                }}
              />
            </div>
          )
        }}
      />
      {/*<ScrollView
        style={{display: 'none'}}
        onScroll={event => {
          // const {scrollTop, scrollHeight} = event.currentTarget
          // console.log('scrollTop, scrollHeight', scrollTop, scrollHeight)
          // event.persist()
          // console.log(event)
          // event.currentTarget
        }}
      >
        {list.map(value => {
          const isFile = ['image', 'file'].includes(value.format)
          const decodeName = decodeURIComponent(value.value)

          return (
            <div
              // ref={v => v.getBoundingClientRect()}
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
                {isFile ? (
                  <>
                    <p className={'ellipsis'}>{getNameFromPath(decodeName)}</p>
                    <p className={'subtitle ellipsis'}>{decodeName}</p>
                  </>
                ) : (
                  <p className={'ellipsis'}>{decodeName}</p>
                )}

                <p className={'subtitle'}>{formatDate(value.time)}</p>
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
      </ScrollView>*/}
    </div>
  )
}

const ScrollView: React.FC<{direction?: 'row' | 'column'} & JSX.IntrinsicElements['div']> = ({
  direction,
  className,
  style,
  ...props
}) => {
  return (
    <div
      className={`scrollView${className ? ` ${className}` : ''}`}
      style={{flexDirection: direction ?? 'column', ...style}}
      {...props}
    >
      {props.children}
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
