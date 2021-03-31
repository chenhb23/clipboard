import React, {useMemo, useState} from 'react'

export interface VirtualListProps<T> {
  list: T[]
  /**
   * 带上key
   */
  renderItem?: (item: T, index: number) => React.ReactNode
  itemHeight?: number
}

const style: React.CSSProperties = {overflowX: 'hidden', overflowY: 'scroll', position: 'relative', height: '100%'}
function absolute(transform: string): React.CSSProperties {
  return {position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, transform}
}

export function VirtualList<T>(props: VirtualListProps<T>) {
  const [current, setCurrent] = useState(0)
  const [itemHeight, setItemHeight] = useState(props.itemHeight ?? 0)
  const [height, setHeight] = useState(0)
  const offset = useMemo(() => (itemHeight ? Math.ceil(height / itemHeight) + 1 : 1), [height, itemHeight])
  const listLength = props.list.length
  const renderList = useMemo(() => props.list.slice(current, current + offset), [props.list, current, offset])

  return (
    <div
      {...(!height ? {ref: v => setHeight(prev => v?.getBoundingClientRect().height ?? prev)} : {})}
      style={style}
      onScroll={event => {
        if (itemHeight) {
          const index = Math.floor(event.currentTarget.scrollTop / itemHeight)
          if (index !== current) {
            setCurrent(Math.min(index, listLength - offset))
          }
        }
      }}
    >
      {/*撑开内容*/}
      <div style={{height: itemHeight * listLength}} />
      {/*获取ItemHeight*/}
      {!itemHeight && !!props.list?.length && (
        <div style={{visibility: 'hidden'}} ref={v => setItemHeight(prev => v?.getBoundingClientRect().height ?? prev)}>
          {props.renderItem(props.list[0], 0)}
        </div>
      )}
      {/*虚拟展示区域*/}
      <div style={absolute(`translateY(${current * itemHeight}px)`)}>
        {renderList.map((value, index) => props.renderItem(value, index + current))}
      </div>
    </div>
  )
}
