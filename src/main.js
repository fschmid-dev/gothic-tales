import './assets/main.scss'

import { createApp, toRaw } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import * as localforage from 'localforage'
import '@fortawesome/fontawesome-free/js/all.min.js'
import { i18n } from '@/i18n.js'

const app = createApp(App)

async function indexDbPlugin({ store }) {
  const storeKey = `gothic_tales-${store.$id}-saveData`
  const stored = await localforage.getItem(storeKey)
  if (stored) {
    store.$patch(stored)
  }

  store.$subscribe(() => {
    let storeData = null
    if (store.$id === 'hero') {
      storeData = { heroes: toRaw(store.getHeroes()) }
    }

    if (!storeData) {
      return
    }

    localforage.setItem(storeKey, storeData)
  })
}

const pinia = createPinia()
pinia.use(indexDbPlugin)

app.use(i18n)
app.use(router)
app.use(pinia)

app.mount('#app')
