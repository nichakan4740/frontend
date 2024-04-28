
<script setup>
import { ref, onMounted, computed } from "vue";
import LayoutNurse from "../layouts/LayoutNurse.vue";
import moment from "moment";
import Pusher from "pusher-js";

/* เวลา */
const formatTime = (time) => {
  return moment(time).format("YYYY-MM-DD HH:mm:ss");
};


const adminId = localStorage.getItem('idadmin');
const messages = ref([]);

const pusher = new Pusher('c38b6cfa9a4f7e26bf76', {
  cluster: 'ap1'
});

const channel = pusher.subscribe('messageUser');
// Store messages in localStorage when a new message is received
channel.bind('message', (data) => {
  messages.value.push({
    message: data.message,
    createdAt: formatTime(data.createdAt), // เปลี่ยนจาก new Date() เป็น data.createdAt
    admin_id: data.admin_id,
    user_id: data.user_id,
  });
  localStorage.setItem('messagesAllUser', JSON.stringify(messages.value));
});

// Read messages from localStorage and assign them to the messages variable
if (localStorage.getItem('messagesAllUser')) {
  messages.value = JSON.parse(localStorage.getItem('messagesAllUser'));
}

/* const filteredMessages = computed(() => {
  return messages.value.filter(message => message.admin_id === parseInt(adminId));
}); */
const filteredMessages = computed(() => {
  // กรองข้อความที่มี admin_id ตรงกับ adminId ที่กำหนด
  const adminMessages = messages.value.filter(message => message.admin_id === parseInt(adminId));

  // สร้างออบเจ็กต์เพื่อเก็บข้อความล่าสุดของแต่ละ user_id
  const latestMessagesByUser = {};
  adminMessages.forEach(message => {
    // ถ้ายังไม่มีข้อความล่าสุดสำหรับ user_id นี้ หรือข้อความใหม่มากกว่าข้อความที่มีอยู่
    if (!latestMessagesByUser.hasOwnProperty(message.user_id) || new Date(message.createdAt) > new Date(latestMessagesByUser[message.user_id].createdAt)) {
      latestMessagesByUser[message.user_id] = message;
    }
  });

  // แปลงออบเจ็กต์เป็น array ของข้อความล่าสุดของแต่ละ user_id
  const latestMessages = Object.values(latestMessagesByUser);

  // เรียงลำดับข้อความตามเวลา createdAt ในลำดับจากมากไปน้อย
  return latestMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
});


onMounted(() => {
});

</script>











<template>
  <LayoutNurse class="bg-gradient-to-b from-blue-100">
   
    <!-- content -->
    <div class="container mx-auto">
      <div class="box-content-small p-3 ml-5 mr-5 mt-10 bg-gradient-to-b from-blue-900 to-blue-800 shadow-lg shadow-slate-500/50 rounded-lg" >
        <h2 class="font-semibold text-xl text-center text-slate-200">
          คุยกับผู้ป่วย
        </h2>
      </div>

      <!-- ----------------------------------------- -->

<div class="container mx-auto">
  <div class="flex flex-col space-y-2 items-start mt-10">
    <div v-for="(message, index) in filteredMessages" :key="index" :class="{ 'self-start': message.user_id === currentUser, 'self-end': message.admin_id === currentAdmin }" class="max-w-md rounded-lg p-2">
      <div :class="{ 'bg-blue-500 text-white': message.user_id === currentUser, 'bg-gray-300': message.admin_id === currentAdmin }" class="p-3 rounded-lg shadow-md inline-block">
        <p class="text-sm">{{ message.message }}</p>
        <p class="text-sm">admin_id :{{ message.admin_id }}</p>
        <p class="text-sm">user_id :{{ message.user_id}}</p>
        <p class="text-sm">CreatedAt: {{ message.createdAt }}</p>
      </div>
    </div>
  </div>
</div>


<!-- ------------------------------------------------- -->


    

      <!-- --------------------------------------------- -->
      <div class="mb-8 ml-2 mr-4 mt-10">
        <p class="text">**ขออภัย กำลังอยู่ในช่วงพัฒนา**</p>
      </div>
    </div>
  </LayoutNurse>
</template>

<style></style>