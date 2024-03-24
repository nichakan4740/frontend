<script setup>
import { ref, onMounted } from "vue";
import LayoutNurse from '../layouts/LayoutNurse.vue';
import moment from "moment";
import Swal from "sweetalert2";
import Pusher from 'pusher-js';

const isLoading = ref(true);

const messages = ref([]);

const pusher = new Pusher('c38b6cfa9a4f7e26bf76', {
  cluster: 'ap1',
  encrypted: true
});

const channel = pusher.subscribe('live-chat');

channel.bind('message', data => {
  console.log('ข้อมูลที่ได้รับมา:', data);
  
  if ('text' in data) {
    const message = {
      user: {
        fname: data.fname
      },
      createdAt: new Date(),
      message: data.text
    };
    
    messages.value = [...messages.value, message];
  } else {
    console.error('ข้อมูลที่ได้รับมาไม่มี key "text":', data);
  }
});



onMounted(() => {
  isLoading.value = false;
});

const formatTime = (time) => {
  return moment(time).format('YYYY-MM-DD HH:mm:ss');
};
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
      <!-- กล่องแชท -->
      <div class="box-content bg-white shadow-lg shadow-gray-300/50 mt-10 ml-5 mr-5 pt-1 pb-6 pl-20 pr-20 mb-5 rounded-lg">
        <iframe width="100%" style="height: 100%; min-height: 500px" frameborder="0"></iframe>
        <div v-if="isLoading">กำลังโหลดข้อมูล...</div>
        <div v-else>
          <div v-for="message in messages" :key="message.id">
            <p>{{ message.user.fname }} {{ formatTime(message.createdAt) }}</p>
            {{ message.message }}
          </div>
        </div>
      </div>
      <div class="mb-8 ml-2 mr-4">
        <p class="text">
          **ขออภัย กำลังอยู่ในช่วงพัฒนา**
        </p>
      </div>
    </div>
  </LayoutNurse>
</template>


 
<style>

</style>