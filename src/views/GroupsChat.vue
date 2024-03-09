<script setup>
import Echo from 'laravel-echo';
import { useRouter } from "vue-router";
import { ref, onBeforeMount, computed,onMounted, onUnmounted } from "vue";
import Layout from '../layouts/Layout.vue';
import moment from "moment";
import Swal from "sweetalert2";

const conversations = ref([]);
const message = ref('');
const group_id = ref(null);

const store = () => {
    fetch(`${import.meta.env.VITE_BASE_URL}api/conversations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + 'YOUR_API_TOKEN' // แทนค่า YOUR_API_TOKEN ด้วย token ของคุณ
        },
        body: JSON.stringify({ message: message.value, group_id: group_id.value })
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
        key: 'c38b6cfa9a4f7e26bf76', // Set your Pusher app key here
        cluster: 'ap1', // Set your Pusher cluster here
        encrypted: true,
        authEndpoint: '/broadcasting/auth',
        auth: {
            headers: {
                Authorization: 'Bearer ' + 'YOUR_API_TOKEN'
            }
        }
    });

  /*   echo.private('groups.' + group_id.value)
        .listen('NewMessage', (e) => {
            conversations.value.push(e);
        }); */


    // Listen to a private channel for a specific user
echo.private(`users.${userId}`)
    .listen('.user-event', (data) => {
        console.log(data);
    });

// Listen to a private channel for a specific group
echo.private(`groups.${groupId}`)
    .listen('.group-event', (data) => {
        console.log(data);
    });

};


    

onMounted(() => {
    listenForNewMessage();
});



</script>
 
<template>
<Layout>
    <div>
        <input type="text" v-model="message">
        <button @click="store">Send</button>
        <ul>
            <li v-for="conversation in conversations" :key="conversation.id">
                {{ conversation.message }}
            </li>
        </ul>
    </div>

</Layout>

</template>
 
<style>

</style>