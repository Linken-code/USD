import Vue from 'vue'
import VueRouter from 'vue-router'
import list from '../components/list.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/list'
  },
  {
    path: '/list',
    component: list
  }

]

const router = new VueRouter({
  routes
})
export default router