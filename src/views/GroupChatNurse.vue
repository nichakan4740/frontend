<script setup>
import { ref, onMounted } from "vue";
import LayoutNurse from '../layouts/LayoutNurse.vue';
import moment from "moment";
import Swal from "sweetalert2";
import Pusher from 'pusher-js';

// สร้างตัวแปร ref เพื่อเก็บข้อมูล
const messages = ref([]);
const isLoading = ref(true);

// ฟังก์ชันสำหรับการจัดรูปแบบเวลา
const formatTime = (time) => {
  return moment(time).format('YYYY-MM-DD HH:mm:ss');
};

// เชื่อมต่อกับ Pusher
const pusher = new Pusher('c38b6cfa9a4f7e26bf76', {
  cluster: 'ap1',
  encrypted: true
});

// รับข้อมูลจากช่องการสื่อสาร 'conversation' ที่ส่งมาจากเซิร์ฟเวอร์
const channel = pusher.subscribe('conversation');

// จัดการข้อมูลที่ได้รับเมื่อมีการส่งข้อความใหม่
channel.bind('new-message', data => {
  // เพิ่มข้อมูลใหม่ลงใน messages
  messages.value.push(data);
});

// เมื่อ component ถูก mount
onMounted(async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}api/conversation/showMessageUser`);
    const data = await response.json();
    // นำข้อมูลที่ได้รับมาเก็บไว้ใน messages
    messages.value = data.messages;
    isLoading.value = false; // เมื่อโหลดข้อมูลเสร็จแล้ว
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
  }
});
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
 
   <div v-if="isLoading">กำลังโหลดข้อมูล...</div>
    <div v-else>
      <div v-for="message in messages" :key="message.id">
        <!-- แสดงข้อมูลข้อความ -->
        <p>{{ message.message }}</p>
        <!-- แสดงเวลา -->
        <p>{{ formatTime(message.createdAt) }}</p>
      </div>
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