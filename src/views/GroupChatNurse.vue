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
      message: data.text,
      iduser: data.id
    };
    
    messages.value = [...messages.value, message];
    
    // บันทึกข้อมูลลงใน local storage
    localStorage.setItem('chatMessages', JSON.stringify(messages.value));
  } else {
    console.error('ข้อมูลที่ได้รับมาไม่มี key "text":', data);
  }
});


onMounted(() => {
  isLoading.value = false;

  // ตรวจสอบว่ามีข้อมูลใน local storage หรือไม่
  const storedMessages = localStorage.getItem('chatMessages');
  if (storedMessages) {
    messages.value = JSON.parse(storedMessages);
  }
});
const formatTime = (time) => {
  return moment(time).format('YYYY-MM-DD HH:mm:ss');
};






/*------------- ส่งข้อความตอบกลับไปหา user ---------------------------------------------- */
const conversationreply = ref([]);
const messagereply = ref('');
const adminId = localStorage.getItem('idadmin'); // อ่าน adminID จาก local storage


const pusherreply = new Pusher('c38b6cfa9a4f7e26bf76', {
    cluster: 'ap1',
    encrypted: true
});

const replyData = ref(null); // เพิ่มตัวแปร replyData เพื่อเก็บข้อมูลที่ได้รับจากการส่งข้อความตอบกลับ

const replyUser = () => {
    sendReply(adminId, messagereply.value);
     messagereply.value = '';
};

const listenForNewMessagereply = () => {
    const channel = pusherreply.subscribe('reply');
    channel.bind('message', data => {
        if (data.id === adminId) {
            conversationreply.value.push(data);
        }
    });
};

const sendReply = (adminId, messagereply) => {
    fetch(`${import.meta.env.VITE_BASE_URL}api/conversation/reply`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ 
            message: messagereply, 
            admin_id: adminId ,
            user_id: messages.value[0].iduser // ใช้ค่า iduser จากข้อมูลแรกใน messages.value
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Response from sendReply:', data); // แสดงข้อมูลที่ได้รับจากการส่งข้อความตอบกลับ
        replyData.value = data; // อัพเดตค่าของตัวแปร replyData เพื่อแสดงผลในอินเตอร์เฟซ
        if (data.admin_id === adminId) {
          conversationreply.value.push(data);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
};

onMounted(() => {
    listenForNewMessagereply();
    const savedConversations = localStorage.getItem('conversationreply');
    if (savedConversations) {
        conversationreply.value = JSON.parse(savedConversations);
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
      <!-- กล่องแชท -->
      <div class="box-content bg-white shadow-lg shadow-gray-300/50 mt-10 ml-5 mr-5 pt-1 pb-6 pl-20 pr-20 mb-5 rounded-lg">
        <iframe width="100%" style="height: 100%; min-height: 500px" frameborder="0"></iframe>
        <div v-if="isLoading">กำลังโหลดข้อมูล...</div>
        <div v-else>
          <div v-for="message in messages" :key="message.id">
            <p>{{ message.user.fname }} {{ formatTime(message.createdAt) }}</p>
            {{ message.message }}
            {{message.iduser}}
          </div>
  
          <!-- เพิ่มส่วนนี้เพื่อแสดงผลข้อความที่ส่งไป -->
    <div v-if="replyData">
      <p>ตอบกลับ: {{ replyData.message }}</p>
    </div>
    <!-- -------------------------------------------- -->
        </div>
      </div>
<!-- --------------------------------------------- -->
  <div class="mb-8 ml-2 mr-4">
 <input type="text" v-model="messagereply" placeholder="พิมพ์ข้อความตอบกลับ">
 <button @click="replyUser">ส่ง</button>
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
