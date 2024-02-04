import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import Dashboard from '../views/Dashboard.vue'
import Chatbot from '../views/Chatbot.vue'
import SugarValue from '../views/SugarValue.vue';

 /* login-register พยาบาล */
import LoginNurse from '../views/Authentication/LoginNurse.vue';
import RegisterNurse from '../views/Authentication/RegisterNurse.vue';

 /* login-register ผู้ป่วย */
import LoginPatient from '../views/Authentication/LoginPatient.vue';
import RegisterPatient from '../views/Authentication/RegisterPatient.vue';

import HomeRole from '../views/HomeRole.vue';



const history = createWebHistory(`${import.meta.env.VITE_BASE_URL}`)

const routes = [

 
  /* login-register พยาบาล */
  {
    path: '/login/nurse',
    name: 'loginNurse',
    component:  LoginNurse ,
  },

  {
    path: '/register/nurse',
    name: 'registerNurse',
    component: RegisterNurse,
  },

 /* login-register ผู้ป่วย */
  {
    path: '/login/patient',
    name: 'loginPatient',
    component:  LoginPatient ,
  },

  {
    path: '/register/patient',
    name: 'registerPatient',
    component: RegisterPatient,
  },


  {
    path: '/',
    name: 'homerole',
    component: HomeRole,
  },


  {
    path: '/home',
    name: 'home',
    component: Home,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
  },
  {
    path: '/chatbot',
    name: 'chatbot',
    component: Chatbot,
  },
  {
    path: '/sugar-value',
    name: 'SugarValue',
    component: SugarValue,
  },
 

]
const router = createRouter({ history, routes })
export default router