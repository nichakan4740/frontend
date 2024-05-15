<script setup>
import Layout from "../layouts/Layout.vue";
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import moment from "moment";
import Swal from "sweetalert2";
import Pusher from "pusher-js";

/* Helper Function */
const formatTime = (time) => moment(time).format('YYYY-MM-DD');

/* Constants and References */
const userId = localStorage.getItem('iduser');
const conversations = ref([]);
const message = ref('');
const messageFromAdmin = ref([]);


/* Send Message to All Admins */
const sendMessageAll = async () => {
  if (message.value.trim() === '') {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'ข้อความต้องไม่ว่างเปล่า',
    });
    return;
  }

  try {
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

    if (!response.ok) throw new Error(await response.text() || 'Failed to send message');

    const responseData = await response.json();
    console.log('Message sent successfully:', responseData);
    conversations.value.push(responseData);
    localStorage.setItem("conversations", JSON.stringify(conversations.value));

  } catch (error) {
    console.error('Error sending message:', error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Failed to send message",
    });
  }
};

/* --------------------------------------------------------------------------------------------- */

/* Fetch Conversations and Messages from LocalStorage */
onMounted(() => {
  const storedConversations = localStorage.getItem('conversations');
  if (storedConversations) conversations.value = JSON.parse(storedConversations);

  const storedMessages = localStorage.getItem("messagefromAdmin");
  if (storedMessages) messageFromAdmin.value = JSON.parse(storedMessages);
});

/* Pusher for Real-Time Messaging */
const pusher = new Pusher('c38b6cfa9a4f7e26bf76', {
  cluster: 'ap1',
  encrypted: true,
});


const channel = pusher.subscribe('Conversation');
channel.bind('message', (data) => {
  console.log(data); // Check the structure of data
  messageFromAdmin.value.push({
    message: data.message,
    timestamp: formatTime(data.timestamp),
    admin_id: data.admin_id,
    user_id: data.user_id,
    admin_name: data.admin_name,
  });

  localStorage.setItem("messagefromAdmin", JSON.stringify(messageFromAdmin.value));
});

/* --------------------------------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------- */

const messagetoadmin = ref('');
const responseMessages = ref([]);

// Function to send message to admin
const sendMessagetoadmin = async () => {
  try {
    // Your logic to get adminId
    const adminId = messageFromAdmin.value.length > 0 ? messageFromAdmin.value[messageFromAdmin.value.length - 1].admin_id : null;
    console.log("Parsed Admin ID:", adminId);
    
    // Fetch API to send message
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}api/sendmessage/ToAdmin/${adminId }`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        message: messagetoadmin.value,
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

/* ---------------------------------------------------------------------------- */
/* Computed Property for Filtering Conversations */
const filteredConversations = computed(() => {
  return conversations.value.filter(conversation => conversation.user_id === userId);
});

const filteredMessagesFromAdmin = computed(() => {
  return messageFromAdmin.value.filter(message => message.user_id === userId);
});

const filteredResponseMessages = computed(() => {
  return responseMessages.value.filter(message => message.user_id === userId);
});


const activeTab = ref(1);
const name = ref("");
onMounted(() => {
  // ดึงข้อมูล name จาก Local Storage เมื่อ component ถูก mount
  name.value = localStorage.getItem("name") || "";
});
const firstCharacter = computed(() => {
  return name.value.charAt(0);
});
</script>
<template>
  <Layout class="bg-gradient-to-b from-blue-100">
    <div class="container mx-auto">
      <!-- Tabs -->
      <div class="box-content p-3 ml-5 mr-5 mt-10 bg-gradient-to-b from-blue-900 to-blue-800 shadow-lg shadow-slate-500/50 rounded-lg">
      <div class="flex justify-center items-center">
        <button class="tab font-semibold text-xl text-center text-slate-800" :class="{ active: activeTab === 1 }" @click="activeTab = 1">
          คุยกับพยาบาล
        </button>
        <button class="tab font-semibold text-xl text-center text-slate-800" :class="{ active: activeTab === 2 }" @click="activeTab = 2">
          Chatbot สอบถามข้อสงสัยเบื้องต้น
        </button>
      </div>
    </div>

     <div v-if="activeTab === 1">


  <div class="lg:flex lg:h-screen antialiased text-gray-800 box-content bg-white shadow-lg shadow-gray-300/50 mt-10  mb-10 pt-5 pb-5 pl-5 pr-10 rounded-lg">
<div class="flex h-screen antialiased text-gray-800">
    <!-- Left Sidebar -->
    <div class="flex flex-row h-full w-full overflow-x-hidden">
      <div class="flex flex-col py-8 pl-6 pr-2 lg:w-64 bg-white flex-shrink-0">
        <!-- Sidebar Content -->
        <!-- User Profile -->
        <div class="flex flex-col items-center bg-indigo-100 border border-gray-200  w-full py-6 px-4 rounded-lg">
          <!-- User Avatar -->
          <div class="h-20 w-20 rounded-full border overflow-hidden">
            <img src="https://cdn.icon-icons.com/icons2/2266/PNG/512/patient_icon_140481.png" alt="Avatar" class="h-full w-full">
          </div>
          <!-- User Information -->
          <div class="text-sm font-semibold mt-2">{{name}}</div> 
        </div>


        <!-- Active Conversations -->
        <div class="flex flex-col mt-8">
          <!-- Active Conversations Header -->
          <div class="flex flex-row items-center justify-between text-xs">
            <span class="font-bold">เปิดแชทใหม่ที่นี้ !!</span>
          </div>


          <!-- Active Conversations List -->
          <div class="flex flex-col space-y-1 mt-4 -mx-2 h-48 overflow-y-auto">
            
          <!-- Input and Send Message -->
          <div>
            <textarea v-model="message" placeholder="กรุณากรอกข้อความ"></textarea>
           <br>
           <button @click="sendMessageAll">ส่งข้อความ</button>
          </div>
            
      
          </div>
    <!-- ---------------------------------------------------------------------------- -->
        </div>
      </div>


      
      <!-- Main Chat Area -->
      <div class="flex flex-col flex-auto h-full p-6">
        <!-- Chat Content -->
        <div class="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
          <!-- Chat Messages -->
          <div class="flex flex-col h-full overflow-x-auto mb-4">
            <!-- Example Chat Messages -->
             <div  v-for="(conversation, index) in filteredConversations" :key="index" class="grid grid-cols-12 gap-y-2">
              <div class="col-start-1 col-end-8 p-3 rounded-lg">
                <div class="flex flex-row items-center">

                  <div class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">{{firstCharacter}}</div>
                  <div class="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                    <div>{{ conversation.message }}</div>
                  </div>
                </div>
              </div>
            </div> 
      


<!-- ----ข้อความตอบกลับจาก admin ---------------------------------------------------------------------------------------- -->
         
            <!-- แสดงข้อความจาก admin -->
             <div  v-for="(message, index) in filteredMessagesFromAdmin" :key="index" class="grid grid-cols-12 gap-y-2">
              <div class="col-start-1 col-end-8 p-3 rounded-lg">
                <div class="flex flex-row items-center">

                  <div class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0"></div>
                  <div class="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                    <p>{{ message.message }}</p>
                    <p>{{ message.timestamp }}</p>
                    <p>{{ message.admin_name }}</p>

                  </div>
                </div>
              </div>
            </div> 
            <!-- ---------------------------------------------------------- -->
        


              <!-- ตอบกลับหา admin -->
              <div   v-for="(responseMessage, index) in filteredResponseMessages" :key="index" class="grid grid-cols-12 gap-y-2">
              <div class="col-start-1 col-end-8 p-3 rounded-lg">
                <div class="flex flex-row items-center">

                  <div class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">{{firstCharacter}}</div>
                  <div class="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                    <p>{{ responseMessage.message }}</p>
                    <p>{{ message.admin_name }}</p>

                  </div>
                </div>
              </div>
            </div> 







    </div>








          <!-- Message Input -->
          <div class="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
            <!-- Message Input Field -->
            <div class="flex-grow ml-4">
              <div class="relative w-full">
                <input type="text" v-model="messagetoadmin" class="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10">
              </div>
            </div>
            <!-- Send Message Button -->
            <div class="ml-4">
              <button @click="sendMessagetoadmin" class="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0">
                <span>Send</span>
                <span class="ml-2">
                    <svg
                        class="w-4 h-4 transform rotate-45 -mt-px"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        ></path>
                      </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>







     </div>
    </div>
     

      










      <!-- Tab Content 2: Chatbot -->
       <div v-if="activeTab === 2">
        <div class="box-content bg-white shadow-lg shadow-gray-300/50 mt-10 ml-5 mr-5 pt-1 pb-6 pl-20 pr-20 mb-5 rounded-lg">
          <iframe src="https://www.chatbase.co/chatbot-iframe/2ZD0Ya4vIQNlG8lowAn8m" width="100%" style="height: 100%; min-height: 500px" frameborder="0"></iframe>
        </div>
        <div class="mb-8 ml-2 mr-4">
          <p class="text">หากมีคำถามเพิ่มเติมหรือต้องการความช่วยเหลือเพิ่มเติมใด ๆ ก็อย่าลังเลที่จะสอบถามมานะคะ ฉันยินดีที่ได้ช่วยเสมอค่ะ!</p>
          <p class="text">**ขออภัยในเรื่องของขอมูลในการตอบคำถาม กำลังอยู่ในช่วงพัฒนา**</p>
        </div>
      </div>

    
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
