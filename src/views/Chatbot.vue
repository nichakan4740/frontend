<script setup>
import Layout from "../layouts/Layout.vue";
import { useRouter } from "vue-router";
import moment from "moment";
import Swal from "sweetalert2";
import Pusher from "pusher-js";
import { ref, onMounted, computed, watch } from "vue";

const conversations = ref([]);
const message = ref('');
const userId = localStorage.getItem('iduser');


const formatTime = (time) => {
  return moment(time).format('YYYY-MM-DD HH:mm:ss');
};

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

/* --------------------------------------------------------------------------------------------------------------------  */
/* แสดงข้อความที่ตอบกลับมา */



const messagefromAdmin = ref([]);
  const channelName = 'Touserid' + userId; 


  const pusherUser = new Pusher('c38b6cfa9a4f7e26bf76', {
    cluster: 'ap1',
    encrypted: true,
  });
  
  const channel = pusherUser.subscribe(channelName);
  // Store messages in localStorage when a new message is received
  channel.bind('message', (data) => {
    console.log(data); // Check the structure of data
    messagefromAdmin.value.push ({
      message: data.message,
      createdAt: formatTime(data.createdAt),
      admin_id: data.admin_id,
      user_id: data.user_id,
    });

    localStorage.setItem("messagefromAdmin", JSON.stringify(messagefromAdmin.value));
  });

onMounted(() => {
  
  if (localStorage.getItem("messagefromAdmin")) {
    messagefromAdmin.value = JSON.parse(
     localStorage.getItem("messagefromAdmin"));
  }
});

/* -------------------------------------------------------------------------- */


/* ตอบกลับ admin */
// Define reactive variables
const router = useRouter();
const messagetoadmin = ref('');
const responseMessages = ref([]);

// Function to send message to admin
const sendMessagetoadmin = async () => {
  try {
    // Your logic to get adminId
    const adminId = messagefromAdmin.value.length > 0 ? messagefromAdmin.value[messagefromAdmin.value.length - 1].admin_id : null;
    console.log("Parsed Admin ID:", adminId);
    
    // Fetch API to send message
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}api/sendmessage/ToAdmin/${adminId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        message: messagetoadmin.value,
        sender_type: 'user', // ระบุว่าเป็น user ที่ส่ง
      }),
    });

    // Handle response
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || 'Failed to send message');
    }

    // Push the sent message to responseMessages array
    responseMessages.value.push({
      user_id: userId,
      message: messagetoadmin.value,
    });

    // Save responseMessages array to localStorage
    localStorage.setItem("responseMessages", JSON.stringify(responseMessages.value));

    // Clear message input
    messagetoadmin.value = '';
  } catch (error) {
    console.error('Error sending message:', error);
    responseMessage.value = 'Failed to send message';
  }
};

// Load responseMessages array from localStorage on component mount
onMounted(() => {
  const storedResponseMessages = localStorage.getItem('responseMessages');
  if (storedResponseMessages) {
    responseMessages.value = JSON.parse(storedResponseMessages);
  }
});


/* ------------------------------------------------------------------------------------------------ */

/* เลือก Teb -------------------------------------------------------- */
const activeTab = ref(1);

/* ลบข้อมูล ------------------------------------------------------------------------------------------*/
const confirmClearLocalStorage = () => {
  Swal.fire({
    title: 'คุณต้องการปิดแช็ต',
    text: "ถ้าคุณปิดแช็ตบทสนทนาของคุณกับพยาบาลจะหายไป!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'ใช่',
    cancelButtonText: 'ยกเลิก' 
  }).then((result) => {
    if (result.isConfirmed) {
      clearLocalStorage();
    }
  });
};

const clearLocalStorage = () => {
  localStorage.removeItem("conversations");
  // รีเฟรชหน้าเพื่อให้แสดงการเปลี่ยนแปลงในข้อมูลที่ถูกลบออก
  location.reload();
};



/* ----------- */
const showChatInput = ref(false);


</script>

<template>
  <Layout class="bg-gradient-to-b from-blue-100">
    <div class="container mx-auto">


      <!-- Tabs ------------------------------------------------------------------------------------------------->
    
<!-- ---------------------- -->
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
      <div v-if="showChatInput">
        <p class="ml-4 mb-3 font-semibold">เปิดใหม่แช็ตเพื่อพูดคุยกับพยาบาล</p>
        <div class="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
          <div class="flex-grow">
            <div class="relative w-full">
              <input type="text" v-model="message" placeholder="ส่งข้อความที่นี้..." class="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10" />
            </div>
          </div>
          <div class="ml-4">
            <button @click="sendMessageAll" class="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0">
              <span>Send</span>
              <span class="ml-2">
                <svg class="w-4 h-4 transform rotate-45 -mt-px" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>

      <button v-else @click="showChatInput = true" class="mr-20 bg-blue-500 text-white rounded-lg p-2 mt-2 ml-2">
        เปิดใหม่แซ็ตเพื่อพูดคุยกับพยาบาล
      </button>
    </div>
  </div>



   
   <!-- ล่าง -->
    <div  class="box-content bg-white shadow-lg shadow-gray-300/50 mt-10 ml-20 mr-20  mb-10 pt-5 pb-5 pl-5 pr-10 rounded-lg h-screen">
          <div class="flex  mb-2 ml-2">
            <img class="rounded-full w-10 h-10" src="https://media.istockphoto.com/id/1253022688/th/%E0%B9%80%E0%B8%A7%E0%B8%84%E0%B9%80%E0%B8%95%E0%B8%AD%E0%B8%A3%E0%B9%8C/%E0%B9%84%E0%B8%AD%E0%B8%84%E0%B8%AD%E0%B8%99%E0%B9%81%E0%B8%9E%E0%B8%97%E0%B8%A2%E0%B9%8C%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%9E%E0%B8%A2%E0%B8%B2%E0%B8%9A%E0%B8%B2%E0%B8%A5%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B8%95%E0%B8%B9%E0%B8%99.jpg?s=612x612&w=0&k=20&c=n1nvQUuq3wjco_oY59OgzrpthJfEkXwfxeJzrPsnCOs="/>
            <div class="pl-2">
              <div class="font-semibold">
                <a class="hover:underline" href="#">พยาบาล</a>
              </div>
              <div class="text-xs text-gray-600">Online</div>
            </div>     
                  <button @click="confirmClearLocalStorage" class=" mx-10 px-2 py-2 bg-blue-500 text-white rounded-md">
                   ปิดแช็ต
                  </button>
          </div>
               
    <div>
        <!-- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- -->
        
<!-- แสดงที่ admin user ตอบกลับไปมา -->          
<div class="chat-container p-4 border-t border-b border-gray-200 border-gray-300  h-fit overflow-y-auto">
    <!-- แสดงข้อมูลจาก messagefromAdmin ด้านซ้าย -->
    <div v-for="(message, index) in messagefromAdmin" :key="index" class="message flex items-end justify-end mb-4">
        <div class="flex flex-col">
            <div class="text-xs text-gray-500">{{ message.createdAt }}</div>
            <div class="ml bg-blue-500 text-white rounded-lg p-2">
                <span class="text-sm">{{ message.message }}</span>
                <p>Admin ID: {{ message.admin_id }}</p>
                <p>User ID: {{ message.user_id }}</p>
            </div>
        </div>
    </div>

    <!-- แสดงข้อมูลจาก filteredConversations ด้านขวา -->
    <div v-for="conversation in filteredConversations" :key="conversation.id" class="message flex items-end justify-start mb-4">
        <div class="flex flex-col">
            <div class="text-xs text-gray-500">{{ formatTime(conversation.created_at) }}</div>
            <div class="mr bg-gray-500 text-white rounded-lg p-2">
                <span class="text-sm">{{ conversation.message }}</span>
            </div>
        </div>
    </div>
</div>
</div>

<!-- แสดงข้อความที่ส่งมาจากผู้ใช้ไปยังผู้ดูแลระบบ -->
   <div v-for="(response, index) in responseMessages" :key="index" class="response-message">
  <p>User ID: {{ response.user_id }}</p>
  <p>Message: {{ response.message }}</p>
</div>

<!-- ------------------------------------------------------------------------------------- -->        
          
          
       <!-- ปุ่มสำหรับส่งข้อความจากผู้ใช้ไปยังผู้ดูแลระบบ -->
<div style="display: flex; align-items: center" class="mt-1">
    <input
        type="text"
        placeholder="พิมพ์ข้อความที่นี่..."
        v-model="messagetoadmin"
        class="block w-full p-2 text-gray-900 border-0 focus:ring-white focus:border-white"
    />
    <button @click="sendMessagetoadmin" >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-6 h-6 text-gray-600"
        >
            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
        </svg>
    </button>
</div> 
</div>


        
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