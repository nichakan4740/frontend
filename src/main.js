import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/style.css'
import 'moment'
import 'sweetalert2/dist/sweetalert2.min.css'

import 'sweetalert2';

const app = createApp(App)

app.use(router)
app.mount('#app')
