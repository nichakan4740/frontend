<script setup>
import { useRouter } from "vue-router";
import LayoutNurse from '../layouts/LayoutNurse.vue';
import moment from "moment";
import Swal from "sweetalert2";
import Pusher from 'pusher-js';
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
            'Accept': 'application/json'
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
        // เมื่อส่งข้อความสำเร็จ ให้ส่งข้อความใหม่ผ่าน Pusher
        pusher.trigger(`conversations.${group_id}`, 'NewMessage', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
};





const pusher = new Pusher('c38b6cfa9a4f7e26bf76', {
    cluster: 'ap1',
    encrypted: true
});

const listenForNewMessage = () => {
    const channel = pusher.subscribe(`conversations.${group_id}`);
    channel.bind('NewMessage', data => {
        conversations.value.push(data);
    });
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