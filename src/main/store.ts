// import EventEmitter from 'events'
//
// class Store extends EventEmitter {
//   data = {}
//
//   set(value) {
//     this.data = value
//     this.emit('change', this.data)
//   }
// }
// const store = new Store()
//
// global.store = store
//
// let count = 0
// setInterval(() => {
//   store.set({count: ++count})
// }, 1000)
//
// // new Store().on('change', value => {
// //   console.log('change', value)
// // })
import Watcher from './watcher'
const watcher = new Watcher()

global.store = watcher.data
