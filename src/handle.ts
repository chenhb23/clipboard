import {ipcRenderer, remote} from 'electron'
// const {ipcRenderer} = require('electron')

console.log(ipcRenderer)

ipcRenderer.on('aaa', (event, args) => {
  console.log('bbbbbbb')
})

// export default {}
// export const a = {}
if (remote) {
  console.log("remote.getGlobal('store')", remote.getGlobal('store'))
  remote.getGlobal('store').on('change', value => {
    console.log('change', value)
  })
}

console.log('location', new URL(location.href).searchParams.get('type'))
