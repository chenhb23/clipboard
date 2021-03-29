import React from 'react'
import ReactDOM from 'react-dom'
import './list.css'

const App = () => {
  return (
    <div className={'container'}>
      <p className={'title'}>list</p>
      <input type='text' />
      <div className='content'>
        {Array.from({length: 500}).map((_, index) => (
          <p key={index}>{index}</p>
        ))}
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
