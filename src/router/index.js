import { createRouter, createWebHistory } from 'vue-router'
import addevent from '../views/addevent.vue'
import editevent from '../components/editevent.vue'
import showeventall from '../views/showeventall.vue'
import showeventwithid from '../views/showeventwithid.vue'

const history = createWebHistory('http://intproj21.sit.kmutt.ac.th/kw2')
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
    path: '/edit-event/:editid',
    name: 'editevent',
    component: editevent,
  },
  {
    path: '/event-id/:eventid',
    name: 'showeventwithid',
    component: showeventwithid,
  }

]
const router = createRouter({ history, routes })
export default router