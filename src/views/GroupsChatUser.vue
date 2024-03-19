<script setup>
import { useRouter } from "vue-router";
import LayoutNurse from '../layouts/LayoutNurse.vue';
import moment from "moment";
import Swal from "sweetalert2";
import Pusher from 'pusher-js';
import { ref, onMounted } from "vue";

/* ส่งข้อความไปให้ทุกคน--------------------------------------------------------------- */
const conversations = ref([]);
const message = ref('');
const userId = localStorage.getItem('iduser'); // อ่าน userId จาก local storage

const pusher = new Pusher('c38b6cfa9a4f7e26bf76', {
    cluster: 'ap1',
    encrypted: true
});

// เก็บข้อความลงใน Local Storage เมื่อส่งข้อความ
const store = () => {
    // ส่งข้อความไปยังทุก admin ที่อยู่ในระบบ
    fetch(`${import.meta.env.VITE_BASE_URL}api/conversations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ 
            message: message.value, 
            user_id: userId,
            admin_id: 'all' // ส่งไปยังทุก admin พร้อมกัน
        })
    })
    .then(response => response.json())
    .then(data => {
         
        console.log(data); // เพิ่มบรรทัดนี้เพื่อดูข้อมูลที่ได้จากการเรียก API
        message.value = '';
        conversations.value.push(data);
        
        // บันทึกข้อมูลลงใน Local Storage
        localStorage.setItem('conversations', JSON.stringify(conversations.value));
    })
    .catch(error => {
        console.error('Error:', error);
    });
};

const listenForNewMessage = () => {
    const channel = pusher.subscribe('conversations');
    channel.bind('NewMessage', data => {
         console.log(data); // เพิ่มบรรทัดนี้เพื่อแสดงค่าที่มาจากอีเวนต์ในคอนโซล
        conversations.value.push(data);
    });
};

onMounted(() => {
    listenForNewMessage();
      const savedConversations = localStorage.getItem('conversations');
    if (savedConversations) {
        conversations.value = JSON.parse(savedConversations);
       
    }
});
/* ------------------------------------------------------------------------------ */


</script>

 
<template>
<LayoutNurse class="bg-gradient-to-b from-blue-100">

<!-- content -->
<div class="container mx-auto">

  <div class="box-content-small p-3 ml-5 mr-5 mt-10 bg-gradient-to-b from-blue-900 to-blue-800 shadow-lg shadow-slate-500/50 rounded-lg">
    <h2 class="font-semibold text-xl text-center text-slate-200">
      คุยกับเรา
    </h2>
  </div>

  <!-- -------------------------------------------------------------- -->

  <!-- กล่องแชท -->
  <div class="box-content bg-white shadow-lg shadow-gray-300/50 mt-10 ml-5 mr-5 pt-1 pb-6 pl-20 pr-20 mb-5 rounded-lg">
    <iframe width="100%" style="height: 100%; min-height: 500px" frameborder="0"></iframe>
 
 <!-- user info -->
  <div class="flex items-center ml-5 mr-5">
    <img class="rounded-full w-10 h-10"
      src="https://media.istockphoto.com/id/1253022688/th/%E0%B9%80%E0%B8%A7%E0%B8%84%E0%B9%80%E0%B8%95%E0%B8%AD%E0%B8%A3%E0%B9%8C/%E0%B9%84%E0%B8%AD%E0%B8%84%E0%B8%AD%E0%B8%99%E0%B9%81%E0%B8%9E%E0%B8%97%E0%B8%A2%E0%B9%8C%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%9E%E0%B8%A2%E0%B8%B2%E0%B8%9A%E0%B8%B2%E0%B8%A5%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B8%95%E0%B8%B9%E0%B8%99.jpg?s=612x612&w=0&k=20&c=n1nvQUuq3wjco_oY59OgzrpthJfEkXwfxeJzrPsnCOs="/>
    <div class="pl-2">
      <div class="font-semibold">
        <a class="hover:underline" href="#">พยาบาล</a>
      </div>
      <div class="text-xs text-gray-600">Online</div>
    </div>
  </div>


    <!-- send ข้อความ -->
    <div>

      <div style="display: flex; align-items: center;">
        <input type="text" id="small-input" class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500"
          v-model="message">
        <button @click="store">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
            <path
              d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
          </svg>
        </button>
      </div>

      <!-- แสดงข้อความ -->
    <ul>
        <li v-for="conversation in conversations" :key="conversation.id">
              {{ conversation.messages}}
        </li>
    </ul>
    </div>
    <!-- ------------------------------------------------------------------------------ -->

  </div>

  <!-- --------------------------------------------------------------------------------------------------------- -->
</div>

<div class="mb-8 ml-2 mr-4">
  <p class="text">
    **ขออภัย กำลังอยู่ในช่วงพัฒนา**
  </p>
</div>

</LayoutNurse>

</template>
 
<style>

</style>