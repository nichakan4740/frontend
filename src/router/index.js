import { createRouter, createWebHistory } from 'vue-router'
import addevent from '../views/addevent.vue'
import editevent from '../components/editevent.vue'
import showeventall from '../views/showeventall.vue'
import showeventwithid from '../views/showeventwithid.vue'
import home from '../views/Home.vue'
import showcategory from '../views/category.vue'
import checkAppointments from '../views/checkAppointments.vue'
import editcategory from '../views/showcategorywithid.vue'


const history = createWebHistory(`${import.meta.env.VITE_BASE_URL}`)

const routes = [
  
  {
    path: '/',
    name: 'home',
    component: home,
  },
  {
    path: '/category',
    name: 'showcategory',
    component: showcategory,
  },
  {
    path: '/edit-category/:categoryid',
    name: 'editcategory',
    component: editcategory,
  },
 {
    path: '/eventall',
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
  },
  {
    path: '/checkAppointments',
    name: 'checkAppointments',
    component: checkAppointments,
  }

]
const router = createRouter({ history, routes })
export default router