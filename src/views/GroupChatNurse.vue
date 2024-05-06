<script setup>
import { ref, onMounted, computed, watch,reactive  } from "vue";
import LayoutNurse from "../layouts/LayoutNurse.vue";
import moment from "moment";
import Pusher from "pusher-js";
import Swal from "sweetalert2";

/* เวลา */
const formatTime = (time) => {
  return moment(time).format("YYYY-MM-DD HH:mm:ss");
};


const adminId = localStorage.getItem('idadmin');
/* const channelNames = 'Toadminid.' + adminId ; */
const messages = ref([]);

const pusher = new Pusher('c38b6cfa9a4f7e26bf76', {
  cluster: 'ap1'
});

const channels = pusher.subscribe('messageUser');
// Store messages in localStorage when a new message is received
channels.bind('message', (data) => {
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
const filteredMessagesAll = ref([]);
const showModal = ref(false);
const lastMessage = ref(JSON.parse(localStorage.getItem('NewMessageAll')));

const openModal = (message) => {
  const userId = message.user_id; // ดึงค่า userId จากอ็อบเจกต์ message
  storeClickedMessage(message, userId); // เรียกใช้ฟังก์ชันเพื่อบันทึกข้อความใหม่และ userId
  lastMessage.value = message; // อัพเดทค่า lastMessage ใหม่
  showModal.value = true; // แสดง Modal

  // อัปเดต filteredMessagesAll ใหม่เพื่อแสดงข้อความทั้งหมดที่เกี่ยวข้องกับผู้ใช้งาน
  filteredMessagesAll.value = messages.value.filter(msg => {  
    return msg.admin_id === parseInt(adminId) && msg.user_id === message.user_id;
  });

  // เรียกใช้งานฟังก์ชัน sendMessageToUser ในที่นี้หลังจากกดเปิด Modal
  sendMessageToUser(messageToUser.value);
};

const storeClickedMessage = (message, userId) => {
  // บันทึกข้อความล่าสุดไว้ใน localStorage
  localStorage.setItem('NewMessageAll', JSON.stringify(message));
  localStorage.setItem('userId', JSON.stringify(parseInt(message.user_id)));
};


/* -------------------------------------------------------------------------------------------------------------------------- */
/* ส่งข้อความตอบกลับ */
const messageToUser = ref('');  
const sendMessageToUser = (message) => {
  const userId = localStorage.getItem('userId');
  fetch(`${import.meta.env.VITE_BASE_URL}api/sendmessage/ToUser/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      message: message,
      admin_id: adminId,
    }),
  })
  .then((response) => response.json())
  .then((data) => {
    console.log("Message sent successfully", data);
    // เพิ่มข้อมูลข้อความที่ส่งกลับไปยัง filteredMessagesAll
    const newMessage = {
      message: message,
      createdAt: formatTime(new Date()), // ใช้เวลาปัจจุบัน
      admin_id: adminId,
      user_id: userId,
    };
  })
  .catch((error) => {
    console.error("Error:", error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Failed to send message",
    });
  });
}; 
const handleSendMessage = () => {
  if (messageToUser.value.trim() !== '') {
    sendMessageToUser(messageToUser.value);
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Message must not be empty',
    });
  }
}; 
/* ------------------------------------------------------------------------------------------------- */


const messagesendToUser = ref([]);
const userIds = localStorage.getItem('userId');
const channelNamesendToUser = 'Touserid.' + userIds;
const pushersendToUser = new Pusher('c38b6cfa9a4f7e26bf76', {
  cluster: 'ap1',
  encrypted: true,
});
const channelsendToUser = pushersendToUser.subscribe(channelNamesendToUser);
// Store messages in localStorage when a new message is received
channelsendToUser.bind('message', (data) => {
  console.log(data); // Check the structure of data
   messagesendToUser.value.push({
    message: data.message,
    createdAt: formatTime(data.createdAt), // Ensure formatTime function is defined and working correctly
    admin_id: data.admin_id,
    user_id: data.user_id,
  });
});
onMounted(() => {

});


/* แสดงข้อความที่ตอบกลับมาจาก user */

const messagefromUser = ref([]);
const channelName = 'Toadminid.' + adminId ;
const pusherAdmin = new Pusher('c38b6cfa9a4f7e26bf76', {
  cluster: 'ap1',
  encrypted: true,
});

const channel = pusherAdmin.subscribe(channelName);
// Store messages in localStorage when a new message is received
channel.bind('message', (data) => {
  console.log(data); // Check the structure of data
  messagefromUser.value.push({
    message: data.message,
    createdAt: formatTime(data.createdAt), // Ensure formatTime function is defined and working correctly
    admin_id: data.admin_id,
    user_id: data.user_id,
  });
});
onMounted(() => {

});
/* ---------------------------------------------------------------------------------------------------------- */



// ดึงข้อมูล name จาก Local Storage
const name = ref('')
onMounted(() => {
  // ดึงข้อมูล name จาก Local Storage เมื่อ component ถูก mount
  name.value = localStorage.getItem('name') || ''
})
const firstCharacter = computed(() => {
  return name.value.charAt(0)
})

</script>

<template>
    <LayoutNurse class="bg-gradient-to-b from-blue-100">
    <!-- Content -->
    <div class="container mx-auto">
      <div class="box-content-small p-3 ml-5 mr-5 mt-10 bg-gradient-to-b from-blue-900 to-blue-800 shadow-lg shadow-slate-500/50 rounded-lg">
        <h2 class="font-semibold text-xl text-center text-slate-200">คุยกับผู้ป่วย</h2>
      </div>

  
   <!--  
      <div>
        <div v-for="(message, index) in messagefromUser" :key="index">
          <p>{{ message.message }}</p>
          <p>Created At: {{ message.createdAt }}</p>
          <p>Admin ID: {{ message.admin_id }}</p>
          <p>User ID: {{ message.user_id }}</p>
        </div>
      </div>

      <div>
        <div v-for="(message, index) in messagesendToUser" :key="index">
          <p>{{ message.message }}</p>
          <p>Created At: {{ message.createdAt }}</p>
          <p>Admin ID: {{ message.admin_id }}</p>
          <p>User ID: {{ message.user_id }}</p>
        </div>
      </div> -->

      <!-- Input field for sending message to user -->
  
    </div>
    <!-- -------------------------------------------------------------------------------------------- -->

<!-- component -->
<div class="flex h-screen antialiased text-gray-800 container mx-auto mt-6  ">
    <div class="flex flex-row h-full w-full overflow-x-hidden ">
      <div class="flex flex-col py-8 pl-6 pr-2 w-64 bg-white flex-shrink-0 rounded-xl">

        <div class="flex flex-col items-center bg-indigo-100 border border-gray-200 mt-4 w-full py-6 px-4 rounded-lg" >
          <div class="h-20 w-20 rounded-full border  overflow-hidden">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"  class="h-full w-full ">
            <path style="fill: #42424D;" fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="text-sm font-semibold mt-2">
           {{ name }} 
          </div>
        </div>


        <div class="flex flex-col mt-8">
          <div class="flex flex-row items-center justify-between text-xs">
            <span class="font-bold">ข้อความจากผู้ป่วย</span>
          </div>

            <!-- ------------------------------------------------------------------------------------------------------------------------------------- -->
          
     <!-- ข้อความด้านซ้ายที่เข้ามา  -->
            <div class="flex flex-col space-y-1 mt-4 -mx-2 h-48 overflow-y-auto">
            <button v-for="(message, index) in filteredMessages" :key="index" @click="openModal(message)" class="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2">

              <div class="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full">
               H
              </div>
              <div class="ml-2 text-sm font-semibold">{{ message.user_id }}</div>
              <!-- <p class="text-sm text-gray-600">CreatedAt: {{ message.createdAt }}</p>  -->    
              <p class="text-sm text-gray-800">{{ message.message }}</p>
              <p class="text-sm text-gray-600">admin_id: {{ message.admin_id }}</p>
            </button>
          </div>
         <!-- ---------------------------------------------------------------------------------------------------- -->
        </div>
      </div>   
     
     <!-- ข้อความด้านขวา -->
     
      <div class="flex flex-col flex-auto h-full p-6" v-if="showModal" @closeModal="showModal = false">
        <div class="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4" >
          <div class="flex flex-col h-full overflow-x-auto mb-4">
            <div class="flex flex-col h-full">
              <div class="grid grid-cols-12 gap-y-2">
               
<!-- ------------------------------------------------------------------------------------------------ -->
                <div class="col-start-1 col-end-8 p-3 rounded-lg" v-for="(message, index) in filteredMessagesAll" :key="index">
                  <div class="flex flex-row items-center">
                
                   <div class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                    {{ message.user_id }}
                    </div>

                    <div class="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl" >
                      <div>{{ message.message }}</div>
                      <p class="text-sm text-gray-600">CreatedAt: {{ message.createdAt }}</p>
                      <p class="text-sm text-gray-600">admin_id: {{ message.admin_id }}</p>
                    </div>
                  </div>
                </div>
<!-- ---------------------------------------------------------------------------------------------------- -->
              
                <div class="col-start-6 col-end-13 p-3 rounded-lg">
                  <div class="flex items-center justify-start flex-row-reverse">
                    <div class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                          {{ firstCharacter }} 
                    </div>
                    <div class="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                      <div>I'm ok what about you?</div>
                    </div>
                  </div>
                </div>
<!-- --------------------------------------------------------------------------------------------------------- -->
           
           </div>
            </div>
          </div>
          <div class="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4" >
    
            <div class="flex-grow ml-4">
              <div class="relative w-full">
                <input
                  type="text"
                  v-model="messageToUser"
                  placeholder="ส่งข้อความที่นี้..."
                  class="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10" />
              </div>
            </div>

            <!-- -------- -->
            <div class="ml-4">
              <button  @click="handleSendMessage" class="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0">
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
          <!-- ------------------------------------ -->
          </div>
        </div>
      </div>
    </div>
  </div>

  </LayoutNurse>
</template>

<style></style>