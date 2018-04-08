import Vue from 'vue'
import Router from 'vue-router'

const options = [
  { path: '/', component: 'Stocks', name: 'Ações', props: false },
  { path: '/help', component: 'Help', name: 'Ajuda', props: false },
  { path: '/settings', component: 'Settings', name: 'Configurações', props: false },
  { path: '/about', component: 'About', name: 'Sobre', props: false }
]

const routes = options.map(route => {
  return {
    path: route.path,
    component: () => import(`@/pages/${route.component}.vue`),
    name: route.name,
    props: route.props
  }
})

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes
})
