import { createRouter, createWebHistory } from 'vue-router'
/* หน้าผู้ป้วย */
import Home from '../views/Home.vue'
import Dashboard from '../views/Dashboard.vue'
import Chatbot from '../views/Chatbot.vue'
import SugarValue from '../views/SugarValue.vue';
import Knowledge from '../views/Knowledge.vue';
import HealthUser  from '../views/HealthUser.vue';
import InformationUser  from '../views/InformationUser.vue';
/* ------------------------------------------------------------------------------------- */

/* หน้าพยาบาล */
import NurseHome from '../views/NurseHome.vue'
import NurseDashboard from '../views/NurseDashboard.vue'
import Chat from '../views/Chat.vue'



 /* login-register พยาบาล */
import LoginNurse from '../Authentication/LoginNurse.vue';
import RegisterNurse from '../Authentication/RegisterNurse.vue';

 /* login-register ผู้ป่วย */
import LoginPatient from '../Authentication/LoginPatient.vue';
import RegisterPatient from '../Authentication/RegisterPatient.vue';



/* หน้าแสดงผล */
import HomeRole from '../views/HomeRole.vue';
import Features from '../views/Features.vue';
import WhatIs from '../views/WhatIs.vue';

const history = createWebHistory(`${import.meta.env.VITE_BASE_URL}`)

const routes = [

 
  {
    path: '/features',
    name: 'features',
    component:  Features ,
  },

  {
    path: '/what-is',
    name: 'what-is',
    component:  WhatIs ,
  },


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
  {
    path: '/knowledge',
    name: 'knowledge',
    component: Knowledge,
  },

  {
    path: '/healthUser',
    name: 'healthUser',
    component: HealthUser,
  },

  {
    path: '/informationUser',
    name: 'informationUser',
    component: InformationUser,
  },


  /* หน้าพยาบาล------------------------------------------------------------------------------------------ */
  {
    path: '/nurse-home',
    name: 'nursehome',
    component: NurseHome,
  },

  {
    path: '/nurse-dashboard',
    name: 'nursedashboard',
    component: NurseDashboard,
  },

  {
    path: '/chat',
    name: 'chat',
    component: Chat,
  },

]
const router = createRouter({ history, routes })
export default router