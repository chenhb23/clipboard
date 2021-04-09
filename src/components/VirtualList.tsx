import React from 'react'

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

interface VirtualListState {
  current: number
  itemHeight: number
  height: number
}

export class VirtualList<T> extends React.Component<VirtualListProps<T>, VirtualListState> {
  constructor(props) {
    super(props)
    this.state = {
      current: 0,
      itemHeight: this.props.itemHeight ?? 0,
      height: 0,
    }
  }

  private get offset() {
    return this.state.itemHeight ? Math.ceil(this.state.height / this.state.itemHeight) + 1 : 1
  }

  private get renderList() {
    return this.props.list.slice(this.state.current, this.state.current + this.offset)
  }

  private divRef = React.createRef<HTMLDivElement>()

  componentDidMount() {
    if (!this.state.height) {
      this.setState({height: this.divRef.current.getBoundingClientRect().height})
    }
  }
  componentDidUpdate(prevProps: Readonly<VirtualListProps<T>>) {
    if (prevProps.list.length !== this.props.list.length) {
      const {height, current} = this.state
      if (height * current > this.divRef.current.scrollHeight) {
        this.setState({current: 0})
        this.divRef.current.scrollTo(0, 0)
      }
    }
  }

  render() {
    const listLength = this.props.list.length
    const {itemHeight, current} = this.state

    return (
      <div
        ref={this.divRef}
        style={style}
        onScroll={event => {
          if (itemHeight) {
            const index = Math.floor(event.currentTarget.scrollTop / itemHeight)
            if (index !== current) {
              this.setState({current: Math.min(index, listLength)})
            }
          }
        }}
      >
        {/*撑开内容*/}
        <div style={{height: itemHeight * listLength}} />
        {/*获取ItemHeight*/}
        {!itemHeight && !!this.props.list?.length && (
          <div
            style={{visibility: 'hidden'}}
            ref={v => this.setState(prev => ({itemHeight: v?.getBoundingClientRect().height ?? prev.itemHeight}))}
          >
            {this.props.renderItem(this.props.list[0], 0)}
          </div>
        )}
        {/*虚拟展示区域*/}
        <div style={absolute(`translateY(${current * itemHeight}px)`)}>
          {this.renderList.map((value, index) => this.props.renderItem(value, index + current))}
        </div>
      </div>
    )
  }
}
