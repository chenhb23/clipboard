namespace NodeJS {
  import type {Watcher} from './main/watcher'
  import type {Store} from './main/store'
  interface Global {
    watcher: Watcher
    store: Store
  }
}
