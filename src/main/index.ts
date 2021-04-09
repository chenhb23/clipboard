import './global'
import './handle'
import watcher from './watcher'
import {store} from './store'

const watchKey = 'watcher-data'
const watchIconKey = 'watcher-icon'

const data = store.get(watchKey)
const icon = store.get(watchIconKey)
watcher.restore({data, icon})

watcher.on('change', data => store.set(watchKey, data))
watcher.on('add-icon', data => store.set(watchIconKey, data))
