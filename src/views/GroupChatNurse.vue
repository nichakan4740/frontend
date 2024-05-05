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
  if (messageToUser.value.trim() !== '') { // ใช้ messageToUser แทน messageTouser
    sendMessageToUser(messageToUser.value); // ใช้ messageToUser แทน messageTouser
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Message must not be empty',
    });
  }
}; 
onMounted(() => {
});

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
/* ---------------------------------------------------------------------------------------------------- */
/* แสดงข้อความทั้งหมดเมื่อคลิกเข้าไป */


const filteredMessagesAll = ref([]);
const showModal = ref(false);

const openModal = (message) => {
  const userId = message.user_id; // ดึงค่า userId จากอ็อบเจกต์ message
  storeClickedMessage(message, userId); // เรียกใช้ฟังก์ชันเพื่อบันทึกข้อความใหม่และ userId
  lastMessage.value = message; // อัพเดทค่า lastMessage ใหม่
  showModal.value = true; // แสดง Modal

  // อัปเดต filteredMessagesAll ใหม่เพื่อแสดงข้อความทั้งหมดที่เกี่ยวข้องกับผู้ใช้งาน
  filteredMessagesAll.value = messages.value.filter(msg => {  
    return msg.admin_id === parseInt(adminId) && msg.user_id === message.user_id;
  });
};

const storeClickedMessage = (message, userId) => {
  // บันทึกข้อความล่าสุดไว้ใน localStorage
  localStorage.setItem('NewMessageAll', JSON.stringify(message));
  localStorage.setItem('userId', JSON.stringify(parseInt(message.user_id)));
};

// เรียกข้อความล่าสุดที่บันทึกไว้ใน localStorage
const lastMessage = ref(JSON.parse(localStorage.getItem('NewMessageAll')));

/* ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */


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


</script>

<template>
    <LayoutNurse class="bg-gradient-to-b from-blue-100">
    <!-- Content -->
    <div class="container mx-auto">
      <div class="box-content-small p-3 ml-5 mr-5 mt-10 bg-gradient-to-b from-blue-900 to-blue-800 shadow-lg shadow-slate-500/50 rounded-lg">
        <h2 class="font-semibold text-xl text-center text-slate-200">คุยกับผู้ป่วย</h2>
      </div>

      <!-- Display filtered messages -->
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

      <!-- Modal for displaying all messages -->
      <div v-if="showModal" @closeModal="showModal = false">
        <div class="bg-white rounded-lg p-8 shadow-md relative">
          <!-- Close button -->
          <button @click="showModal = false" class="absolute top-0 right-0 m-4 text-gray-500 hover:text-gray-700">ปิด</button>

          <!-- Display last clicked message -->
          <div class="max-w-md rounded-lg p-2">
            <div class="inline-block">
              <div class="p-3 rounded-lg shadow-md inline-block bg-white">
                <p class="text-sm text-gray-800">{{ lastMessage.message }}</p>
                <p class="text-sm text-gray-600">admin_id: {{ lastMessage.admin_id }}</p>
                <p class="text-sm text-gray-600">user_id: {{ lastMessage.user_id }}</p>
                <p class="text-sm text-gray-600">CreatedAt: {{ lastMessage.createdAt }}</p>     
              </div>
            </div>
          </div>

          <!-- Display all messages related to the clicked user -->
          <div v-for="(message, index) in filteredMessagesAll" :key="index">
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
          </div>
        </div>
      </div>

      <!-- Display messages from user -->
      <div>
        <div v-for="(message, index) in messagefromUser" :key="index">
          <p>{{ message.message }}</p>
          <p>Created At: {{ message.createdAt }}</p>
          <p>Admin ID: {{ message.admin_id }}</p>
          <p>User ID: {{ message.user_id }}</p>
        </div>
      </div>

      <!-- Display messages sent to user -->
      <div>
        <div v-for="(message, index) in messagesendToUser" :key="index">
          <p>{{ message.message }}</p>
          <p>Created At: {{ message.createdAt }}</p>
          <p>Admin ID: {{ message.admin_id }}</p>
          <p>User ID: {{ message.user_id }}</p>
        </div>
      </div>

      <!-- Input field for sending message to user -->
      <div>
        <input type="text" v-model="messageToUser" placeholder="Type your message...">
        <button @click="handleSendMessage">Send</button>
      </div>
    </div>
    <!-- -------------------------------------------------------------------------------------------- -->








<!-- component -->
<div class="flex h-screen antialiased text-gray-800">
    <div class="flex flex-row h-full w-full overflow-x-hidden">
      <div class="flex flex-col py-8 pl-6 pr-2 w-64 bg-white flex-shrink-0">
        <div class="flex flex-row items-center justify-center h-12 w-full">
          <div
            class="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-10 w-10"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              ></path>
            </svg>
          </div>
          <div class="ml-2 font-bold text-2xl">QuickChat</div>
        </div>
        <div
          class="flex flex-col items-center bg-indigo-100 border border-gray-200 mt-4 w-full py-6 px-4 rounded-lg"
        >
          <div class="h-20 w-20 rounded-full border overflow-hidden">
            <img
              src="https://avatars3.githubusercontent.com/u/2763884?s=128"
              alt="Avatar"
              class="h-full w-full"
            />
          </div>
          <div class="text-sm font-semibold mt-2">Aminos Co.</div>
          <div class="text-xs text-gray-500">Lead UI/UX Designer</div>
          <div class="flex flex-row items-center mt-3">
            <div
              class="flex flex-col justify-center h-4 w-8 bg-indigo-500 rounded-full"
            >
              <div class="h-3 w-3 bg-white rounded-full self-end mr-1"></div>
            </div>
            <div class="leading-none ml-1 text-xs">Active</div>
          </div>
        </div>
        <div class="flex flex-col mt-8">
          <div class="flex flex-row items-center justify-between text-xs">
            <span class="font-bold">ข้อความจากผู้ป่วย</span>
            <span
              class="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full"
              >4</span
            >
            <!-- ------------------------------------------------------------------------------------------------------------------------------------- -->
          </div>
          <div class="flex flex-col space-y-1 mt-4 -mx-2 h-48 overflow-y-auto">
            <button
              class="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2"
            >
              <div
                class="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full"
              >
                H
              </div>
              <div class="ml-2 text-sm font-semibold">Henry Boyd</div>
            </button>
            <button
              class="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2"
            >
              <div
                class="flex items-center justify-center h-8 w-8 bg-gray-200 rounded-full"
              >
                M
              </div>
              <div class="ml-2 text-sm font-semibold">Marta Curtis</div>
              <div
                class="flex items-center justify-center ml-auto text-xs text-white bg-red-500 h-4 w-4 rounded leading-none"
              >
                2
              </div>
            </button>
            <button
              class="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2"
            >
              <div
                class="flex items-center justify-center h-8 w-8 bg-orange-200 rounded-full"
              >
                P
              </div>
              <div class="ml-2 text-sm font-semibold">Philip Tucker</div>
            </button>
            <button
              class="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2"
            >
              <div
                class="flex items-center justify-center h-8 w-8 bg-pink-200 rounded-full"
              >
                C
              </div>
              <div class="ml-2 text-sm font-semibold">Christine Reid</div>
            </button>
            <button
              class="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2"
            >
              <div
                class="flex items-center justify-center h-8 w-8 bg-purple-200 rounded-full"
              >
                J
              </div>
              <div class="ml-2 text-sm font-semibold">Jerry Guzman</div>
            </button>
          </div>
          <div class="flex flex-row items-center justify-between text-xs mt-6">
            <span class="font-bold">Archivied</span>
            <span
              class="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full"
              >7</span
            >
          </div>
          <div class="flex flex-col space-y-1 mt-4 -mx-2">
            <button
              class="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2"
            >
              <div
                class="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full"
              >
                H
              </div>
              <div class="ml-2 text-sm font-semibold">Henry Boyd</div>
            </button>
          </div>
        </div>
      </div>
      <div class="flex flex-col flex-auto h-full p-6">
        <div
          class="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4"
        >
          <div class="flex flex-col h-full overflow-x-auto mb-4">
            <div class="flex flex-col h-full">
              <div class="grid grid-cols-12 gap-y-2">
                <div class="col-start-1 col-end-8 p-3 rounded-lg">
                  <div class="flex flex-row items-center">
                    <div
                      class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0"
                    >
                      A
                    </div>
                    <div
                      class="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl"
                    >
                      <div>Hey How are you today?</div>
                    </div>
                  </div>
                </div>
                <div class="col-start-1 col-end-8 p-3 rounded-lg">
                  <div class="flex flex-row items-center">
                    <div
                      class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0"
                    >
                      A
                    </div>
                    <div
                      class="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl"
                    >
                      <div>
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Vel ipsa commodi illum saepe numquam maxime
                        asperiores voluptate sit, minima perspiciatis.
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-start-6 col-end-13 p-3 rounded-lg">
                  <div class="flex items-center justify-start flex-row-reverse">
                    <div
                      class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0"
                    >
                      A
                    </div>
                    <div
                      class="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl"
                    >
                      <div>I'm ok what about you?</div>
                    </div>
                  </div>
                </div>
                <div class="col-start-6 col-end-13 p-3 rounded-lg">
                  <div class="flex items-center justify-start flex-row-reverse">
                    <div
                      class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0"
                    >
                      A
                    </div>
                    <div
                      class="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl"
                    >
                      <div>
                        Lorem ipsum dolor sit, amet consectetur adipisicing. ?
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-start-1 col-end-8 p-3 rounded-lg">
                  <div class="flex flex-row items-center">
                    <div
                      class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0"
                    >
                      A
                    </div>
                    <div
                      class="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl"
                    >
                      <div>Lorem ipsum dolor sit amet !</div>
                    </div>
                  </div>
                </div>
                <div class="col-start-6 col-end-13 p-3 rounded-lg">
                  <div class="flex items-center justify-start flex-row-reverse">
                    <div
                      class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0"
                    >
                      A
                    </div>
                    <div
                      class="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl"
                    >
                      <div>
                        Lorem ipsum dolor sit, amet consectetur adipisicing. ?
                      </div>
                      <div
                        class="absolute text-xs bottom-0 right-0 -mb-5 mr-2 text-gray-500"
                      >
                        Seen
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-start-1 col-end-8 p-3 rounded-lg">
                  <div class="flex flex-row items-center">
                    <div
                      class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0"
                    >
                      A
                    </div>
                    <div
                      class="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl"
                    >
                      <div>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Perspiciatis, in.
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-start-1 col-end-8 p-3 rounded-lg">
                  <div class="flex flex-row items-center">
                    <div
                      class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0"
                    >
                      A
                    </div>
                    <div
                      class="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl"
                    >
                      <div class="flex flex-row items-center">
                        <button
                          class="flex items-center justify-center bg-indigo-600 hover:bg-indigo-800 rounded-full h-8 w-10"
                        >
                          <svg
                            class="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="1.5"
                              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                            ></path>
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="1.5"
                              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                        </button>
                        <div class="flex flex-row items-center space-x-px ml-4">
                          <div class="h-2 w-1 bg-gray-500 rounded-lg"></div>
                          <div class="h-2 w-1 bg-gray-500 rounded-lg"></div>
                          <div class="h-4 w-1 bg-gray-500 rounded-lg"></div>
                          <div class="h-8 w-1 bg-gray-500 rounded-lg"></div>
                          <div class="h-8 w-1 bg-gray-500 rounded-lg"></div>
                          <div class="h-10 w-1 bg-gray-500 rounded-lg"></div>
                          <div class="h-10 w-1 bg-gray-500 rounded-lg"></div>
                          <div class="h-12 w-1 bg-gray-500 rounded-lg"></div>
                          <div class="h-10 w-1 bg-gray-500 rounded-lg"></div>
                          <div class="h-6 w-1 bg-gray-500 rounded-lg"></div>
                          <div class="h-5 w-1 bg-gray-500 rounded-lg"></div>
                          <div class="h-4 w-1 bg-gray-500 rounded-lg"></div>
                          <div class="h-3 w-1 bg-gray-500 rounded-lg"></div>
                          <div class="h-2 w-1 bg-gray-500 rounded-lg"></div>
                          <div class="h-2 w-1 bg-gray-500 rounded-lg"></div>
                          <div class="h-2 w-1 bg-gray-500 rounded-lg"></div>
                          <div class="h-10 w-1 bg-gray-500 rounded-lg"></div>
                          <div class="h-2 w-1 bg-gray-500 rounded-lg"></div>
                          <div class="h-10 w-1 bg-gray-500 rounded-lg"></div>
                          <div class="h-8 w-1 bg-gray-500 rounded-lg"></div>
                          <div class="h-8 w-1 bg-gray-500 rounded-lg"></div>
                          <div class="h-1 w-1 bg-gray-500 rounded-lg"></div>
                          <div class="h-1 w-1 bg-gray-500 rounded-lg"></div>
                          <div class="h-2 w-1 bg-gray-500 rounded-lg"></div>
                          <div class="h-8 w-1 bg-gray-500 rounded-lg"></div>
                          <div class="h-8 w-1 bg-gray-500 rounded-lg"></div>
                          <div class="h-2 w-1 bg-gray-500 rounded-lg"></div>
                          <div class="h-2 w-1 bg-gray-500 rounded-lg"></div>
                          <div class="h-2 w-1 bg-gray-500 rounded-lg"></div>
                          <div class="h-2 w-1 bg-gray-500 rounded-lg"></div>
                          <div class="h-4 w-1 bg-gray-500 rounded-lg"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4"
          >
            <div>
              <button
                class="flex items-center justify-center text-gray-400 hover:text-gray-600"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  ></path>
                </svg>
              </button>
            </div>
            <div class="flex-grow ml-4">
              <div class="relative w-full">
                <input
                  type="text"
                  class="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                />
                <button
                  class="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600"
                >
                  <svg
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
            <div class="ml-4">
              <button
                class="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
              >
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

  </LayoutNurse>
</template>

<style></style>