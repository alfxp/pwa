
import Vue from 'vue'
import Vuetify from 'vuetify'

import 'vuetify/dist/vuetify.css'

import App from './App'
import router from './router'

Vue.use(Vuetify, {
  theme: {
    primary: '#0085AF',
    secondary: '#FFBB00'
  }
})

Vue.config.productionTip = false

import storage from 'vue-localstorage'

Vue.use(storage)

Vue.use(storage, {
  name: 'ls',
  bind: true
})

/* eslint-disable no-unused-vars */
import db from './db'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  data: {
    trySync: true
  }
})
