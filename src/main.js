import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'


import './assets/style.css'
import 'moment'
import 'sweetalert2/dist/sweetalert2.min.css'

import 'sweetalert2';

const app = createApp(App)


const echo = new Echo({
    broadcaster: 'pusher',
    key: 'c38b6cfa9a4f7e26bf76', // ใช้ค่าตรงจาก .env ตรงๆ
    cluster: 'ap1', // ใช้ค่าตรงจาก .env ตรงๆ
    encrypted: true,
    authEndpoint: 'YOUR_LARAVEL_AUTH_ENDPOINT',
    auth: {
        headers: {
            Authorization: 'Bearer ' + 'YOUR_API_TOKEN'
        }
    }
})

app.config.globalProperties.$echo = echo


app.use(router)
app.mount('#app')
