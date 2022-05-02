import { createRouter, createWebHistory } from 'vue-router'
import addevent from '../views/addevent.vue'
import editevent from '../views/editevent.vue'
import showeventall from '../views/showeventall.vue'

const history = createWebHistory()

//const cors = require("cors"); 
const routes = [
  
 {
    path: '/',
    name: 'showeventall',
    component: showeventall,
  },
  {
    path: '/addevent',
    name: 'addevent',
    component: addevent,
  },
  {
    path: '/editevent',
    name: 'editevent',
    component: editevent,
  }

]
const router = createRouter({ history, routes })
export default router