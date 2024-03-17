<script setup>
import { useRouter } from "vue-router";
import LayoutNurse from '../layouts/LayoutNurse.vue';
import moment from "moment";
import Swal from "sweetalert2";
import Echo from 'laravel-echo';
import { ref, onMounted } from "vue";


const conversations = ref([]);
const message = ref('');
/* const group_id = ref(null); */
const group_id = 3;
const userId = 1; // นี่คือ ID ของผู้ใช้ปัจจุบัน และอาจต้องเปลี่ยนแปลงตามลำดับ
const adminId = 1; // นี่คือ ID ของผู้ดูแลระบบ และอาจต้องเปลี่ยนแปลงตามลำดับ

const store = () => {
    fetch(`${import.meta.env.VITE_BASE_URL}api/conversations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + 'YOUR_API_TOKEN'
        },
        body: JSON.stringify({ 
            message: message.value, 
            group_id: group_id.value,
            user_id: userId,
            admin_id: adminId
        })
    })
    .then(response => response.json())
    .then(data => {
        message.value = '';
        conversations.value.push(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
};

const listenForNewMessage = () => {
    const echo = new Echo({
        broadcaster: 'pusher',
        key: 'c38b6cfa9a4f7e26bf76',
        cluster: 'ap1',
        encrypted: true,
        authEndpoint: '/broadcasting/auth',
        auth: {
            headers: {
                Authorization: 'Bearer ' + 'YOUR_API_TOKEN'
            }
        }
    });

    // ฟังก์ชันที่จะเรียกเมื่อมีข้อความใหม่
    const handleNewMessage = (data) => {
        conversations.value.push(data);
    };

    // Listen to private channel for the current user
    echo.private(`users.${userId}`)
        .listen('.NewMessage', handleNewMessage);

    // Listen to private channel for the admin
    echo.private(`admins.${adminId}`)
        .listen('.NewMessage', handleNewMessage);
};

onMounted(() => {
    listenForNewMessage();
});




</script>
 
<template>
<LayoutNurse class="bg-gradient-to-b  from-blue-100 ">


<!-- content -->
<div class="container mx-auto">



    <div>
        <input type="text" v-model="message">
        <button @click="store">Send</button>
        <ul>
            <li v-for="conversation in conversations" :key="conversation.id">
                {{ conversation.message }}
            </li>
        </ul>
    </div>











  </div>
  

  
               
    </LayoutNurse>
</template>
 
<style>

</style>