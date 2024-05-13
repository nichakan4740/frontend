<script setup>
import Layout from "../layouts/Layout.vue";
import { useRouter } from "vue-router";
import moment from "moment";
import Swal from "sweetalert2";
import Pusher from "pusher-js";
import { ref, onMounted, computed, watch } from "vue";

const formatTime = (time) => {
  return moment(time).format('YYYY-MM-DD HH:mm:ss');
};
const userId = localStorage.getItem('iduser');
const conversations = ref([]);
const message = ref('');
const sendMessageAll = async () => {
  try {
    if (message.value.trim() !== '') {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}api/sendmessage/all`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          message: message.value,
          user_id: userId,
          admin_id: 'all'
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Failed to send message');
      }
      // หลังจากส่งข้อความเสร็จสมบูรณ์
      const responseData = await response.json();
      console.log('Message sent successfully:', responseData);
      conversations.value.push(responseData);
      
      // อัพเดทข้อมูลใน localStorage
      localStorage.setItem("conversations", JSON.stringify(conversations.value));
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'ข้อความต้องไม่ว่างเปล่า',
      });
    }
  } catch (error) {
    console.error('Error sending message:', error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Failed to send message",
    });
  }
};
onMounted(() => {
  const storedConversations = localStorage.getItem('conversations');
  if (storedConversations) {
    conversations.value = JSON.parse(storedConversations);
  }
});

// สร้าง computed property สำหรับกรอง conversations ที่ตรงกับ userId
const filteredConversations = computed(() => {
  return conversations.value.filter(conversation => conversation.user_id === userId);
});


/* ------------------------------------------------------------------------------------------------ */

/* เลือก Teb -------------------------------------------------------- */
const activeTab = ref(1);

</script>

<template>
  <Layout class="bg-gradient-to-b from-blue-100">
    <div class="container mx-auto">


      <!-- Tabs ------------------------------------------------------------------------------------------------->
    
      <div class="box-content p-3 ml-5 mr-5 mt-10 bg-gradient-to-b from-blue-900 to-blue-800 shadow-lg shadow-slate-500/50 rounded-lg">
        <div class="flex justify-center items-center ">
        <button
          class="tab font-semibold text-xl text-center text-slate-800"
          :class="{ active: activeTab === 1 }"
          @click="activeTab = 1"
        >
           คุยกับพยาบาล   
        </button>
        <button
          class="tab font-semibold text-xl text-center text-slate-800"
          :class="{ active: activeTab === 2 }"
          @click="activeTab = 2"
        >
         Chatbot สอบถามข้อสงสัยเบื้องต้น   
        </button>
      </div>
      
      
      </div>
      
      <!-- ----------------------------------------------------------------------------------------------------------------------------------- -->

      <!-- Tab content ที่ 1 -->
      <div v-if="activeTab === 1">  

 <div class="box-content bg-white shadow-lg shadow-gray-300/50 mt-10 ml-20 mr-20 mb-10 pt-5 pb-5 pl-5 pr-10 rounded-lg h-fit">
 <div>
    <!-- ส่วนสำหรับกรอกข้อความ -->
    <textarea v-model="message" placeholder="กรุณากรอกข้อความ"></textarea>
    <!-- ปุ่มสำหรับส่งข้อความ -->
    <button @click="sendMessageAll">ส่งข้อความ</button>

    <!-- แสดง conversation ที่กรองตาม userId -->
    <div v-if="filteredConversations.length > 0">
      <ul>
        <li v-for="(conversation, index) in filteredConversations" :key="index">
          <p>{{ conversation.message }}</p>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>ไม่มีข้อความ</p>
    </div>
  </div>
  <!-- -------------------------------- -->
 
 </div>
   
   






























   <!-- ----------------------------------------------------- -->
    </div>
    </div>
















    <!-- ----------------------------------------------------------------------------------------------------------------------------------------------------------- -->
  
  <!-- Tab content ที่ 2 -->
<div v-if="activeTab === 2">
<div class="box-content bg-white shadow-lg shadow-gray-300/50 mt-10 ml-5 mr-5 pt-1 pb-6 pl-20 pr-20 mb-5 rounded-lg" >
          <iframe
            src="https://www.chatbase.co/chatbot-iframe/2ZD0Ya4vIQNlG8lowAn8m"
            width="100%"
            style="height: 100%; min-height: 500px"
            frameborder="0"
          ></iframe>
        </div>

        <div class="mb-8 ml-2 mr-4">
          <p class="text">
            หากมีคำถามเพิ่มเติมหรือต้องการความช่วยเหลือเพิ่มเติมใด ๆ
            ก็อย่าลังเลที่จะสอบถามมานะคะ ฉันยินดีที่ได้ช่วยเสมอค่ะ!
          </p>
          <p class="text">
            **ขออภัยในเรื่องของขอมูลในการตอบคำถาม กำลังอยู่ในช่วงพัฒนา**
          </p>
        </div>
 
</div>    

 
    

<!-- --------------------------------------------------------------------------------------------------------- -->

  <!-- -------------------------------------------------------------- -->
    <div class="mb-8 ml-2 mr-4">
      <p class="text">**ขออภัย กำลังอยู่ในช่วงพัฒนา**</p>
    </div>
  </Layout>
</template>

<style>
#bodybox {
  margin: auto;
  max-width: 600px;
  font: 15px arial, "Prompt", sans-serif;
  background-color: white;
  border-style: solid;
  border-width: 1px;
  padding-top: 20px;
  padding-bottom: 15px;
  padding-right: 20px;
  padding-left: 20px;
  box-shadow: 5px 5px 5px grey;
  border-radius: 15px;
}

#chatborder {
  border-style: solid;
  background-color: #f6f9f6;
  border-width: 3px;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 1px;
  margin-right: 1px;
  padding-top: 10px;
  padding-bottom: 15px;
  padding-right: 10px;
  padding-left: 15px;
  border-radius: 15px;
  max-height: 300px;
  font: 17px arial, "Prompt", sans-serif;
}

.chatlog {
  font: 15px arial, "Prompt", sans-serif;
}

#chatbox {
  font: 17px arial, "Prompt", sans-serif;
  height: 22px;
  width: 100%;
  border-style: solid;
  border-width: 1.5px;
  border-radius: 5px;
  background-color: #f6f9f6;
}

h1 {
  margin: auto;
  font: 17px arial, "Prompt", sans-serif;
}

pre {
  background-color: #f0f0f0;
  margin-left: 20px;
  font: 17px arial, "Prompt", sans-serif;
}

.text {
  font: 16px arial, "Prompt", sans-serif;
  color: #0047ab;
  text-align: center;
  margin-bottom: 8px;
}

.tab {
  @apply cursor-pointer px-4 py-2 mr-2 border border-transparent rounded-lg bg-blue-300;
}

.tab.active {
  @apply bg-blue-500;
}
</style>