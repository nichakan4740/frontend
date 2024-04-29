
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

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
/* แสดงข้อความทั้งหมดเมื่อคลิกเข้าไป */
const filteredMessagesAll = computed(() => {
  return messages.value.filter(message => message.admin_id === parseInt(adminId));
});



const showModal = ref(false);

const openModal = (message) => {
  // Call the function to store the clicked data
  storeClickedMessage(message);
  showModal.value = true; // Show the Modal
};


// Function to store the clicked message data
const storeClickedMessage = (message) => {
  // Do something with the received data, such as saving it to a database or server
  console.log("Clicked message:", message);
  // Add your logic here to store the message data as needed
};



/* ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */


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


<!-- ------------------------------------------------- -->

 <button v-for="(message, index) in filteredMessages" :key="index" @click="openModal(message)">
  <div class="max-w-md rounded-lg p-2">
    <div class="inline-block">
      <div class="p-3 rounded-lg shadow-md inline-block bg-red-50">
        <p class="text-sm text-gray-800">{{ message.message }}</p>
        <p class="text-sm text-gray-600">admin_id: {{ message.admin_id }}</p>
        <p class="text-sm text-gray-600">user_id: {{ message.user_id }}</p>
        <p class="text-sm text-gray-600">CreatedAt: {{ message.createdAt }}</p>     
      </div>
    </div>
  </div>
</button>

<!-- ---------------------------------------------------------------------------------------------- -->


<!--  แสดงข้อความทั้งหมด  -->
<div>
  <Modal v-if="showModal" @closeModal="showModal = false">
    <div class="bg-white rounded-lg p-8 shadow-md relative">
      <button @click="showModal = false" class="absolute top-0 right-0 m-4 text-gray-500 hover:text-gray-700">ปิด</button>
    
    
<!--      <div v-for="(message, index) in filteredMessagesAll" :key="index">
    <div class="max-w-md rounded-lg p-2">
      <div class="inline-block">
        <div class="p-3 rounded-lg shadow-md inline-block bg-white">
          <p class="text-sm text-gray-800">{{ message.message }}</p>
          <p class="text-sm text-gray-600">admin_id: {{ message.admin_id }}</p>
          <p class="text-sm text-gray-600">user_id: {{ message.user_id }}</p>
          <p class="text-sm text-gray-600">CreatedAt: {{ message.createdAt }}</p>     
        </div>
      </div>
    </div>
  </div> -->
    </div>
  </Modal>
</div>



    

      <!-- --------------------------------------------- -->
      <div class="mb-8 ml-2 mr-4 mt-10">
        <p class="text">**ขออภัย กำลังอยู่ในช่วงพัฒนา**</p>
      </div>
    </div>
  </LayoutNurse>
</template>

<style></style>