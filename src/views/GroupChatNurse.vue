<script setup>
import { ref, onMounted, computed, reactive } from "vue";
import LayoutNurse from "../layouts/LayoutNurse.vue";
import moment from "moment";
import Pusher from "pusher-js";
import Swal from "sweetalert2";

const formatTime = (time) => {
  return moment(time).format("YYYY-MM-DD");
};


const deleteChatRooms = async () => {
  if (!selectedUserId.value) {
    console.error('ไม่พบ User ID ที่เลือก');
    return;
  }

  // Confirm Deletion
  const result = await Swal.fire({
    title: 'คุณต้องการลบแชทใช่หรือไม่',
    text: 'ถ้าคุณลบแชทแชทก่อนหน้านี้จะถูกลบและไม่สามารถกู้คืนแชทเหล่านี้ได้!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'ใช่ฉันต้องการลบแชท',
    cancelButtonText: 'ยกเลิก'
  });

  if (!result.isConfirmed) {
    return false; // Return false if deletion is not confirmed
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}api/chat-rooms/user/${selectedUserId.value}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('เกิดข้อผิดพลาดในการลบห้องแชท:', errorData);
      await Swal.fire('เกิดข้อผิดพลาด!', 'เกิดข้อผิดพลาดในการลบห้องแชท.', 'error');
      return;
    }

    const data = await response.json();
    console.log('ลบแชทเรียบร้อยแล้ว:', data);
    await Swal.fire('เรียบร้อย!', 'แชทของคุณถูกลบแล้ว.', 'success');
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการลบห้องแชท:', error);
    await Swal.fire('เกิดข้อผิดพลาด!', 'เกิดข้อผิดพลาดในการลบห้องแชท.', 'error');
  }

  // หลังจากลบสำเร็จ ให้ทำการ reload หน้าเว็บ
  window.location.reload();
};


const pusher = new Pusher("c38b6cfa9a4f7e26bf76", {
  cluster: "ap1",
  encrypted: true,
});

const adminId = localStorage.getItem("idadmin");
const nameadmin = localStorage.getItem("name");

const message = ref("");
// ส่งข้อความตอบกลับหา user
const sendMessageToUser = async (userId) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}api/sendmessage/ToUser/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message.value,
        admin_id: adminId,
        chat_room_id: selectedUserId.value,
      }),
    });


    if (response.ok) {
      const responseData = await response.json();
      Swal.fire({
        icon: 'success',
        title: 'ส่งข้อความสำเร็จ',
      });
 /*        // หลังจากลบสำเร็จ ให้ทำการ reload หน้าเว็บ
  window.location.reload();  */

      // Add the new message directly to selectedUserMessages and allMessages
      const newMessage = {
        message: message.value,
        timestamp: formatTime(responseData.timestamp), // Assuming the API returns the timestamp of the sent message
        admin_id: adminId,
        user_id: selectedUserId.value,
        admin_name: name.value, 
        reply_type: 'admin',
      };

      // Update allMessages
      if (!allMessages.value[selectedUserId.value]) {
        allMessages.value[selectedUserId.value] = [];
      }

      allMessages.value[selectedUserId.value].push(newMessage);

      // Clear the input field after sending the message
      message.value = ""; 
    } else {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถส่งข้อความได้',
      });
    }
  } catch (error) {
    console.error("Error sending message:", error);
    Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถส่งข้อความได้',
    });
  }
  
};


/* ------------------------------------------------------------------------------------------------- */


// get ค่าจาก database และเพิ่มค่าล่าสุดของ pusher ลงใน Array ของ data
const isModalOpen = ref(false);
const selectedUserMessages = ref([]);
const messages = ref({});
const allMessages = ref({});
const selectedUserId = ref(null); // Define selectedUserId
const name = ref(nameadmin); // Define name

// ดึงข้อมูลที่เข้ามาครั้งแรกจาก user
const fetchMessages = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}api/admin/${adminId}/messages`);
    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }
    const data = await response.json();

    // Clear messages and allMessages before updating
    messages.value = {};
    allMessages.value = {};

    // Group messages by user_id
    data.forEach(message => {
      if (!allMessages.value[message.user_id]) {
        allMessages.value[message.user_id] = [];
      }
      allMessages.value[message.user_id].push(message);

      // Keep only the latest message in the messages ref
      messages.value[message.user_id] = [message];
    });
  } catch (error) {
    console.error(error);
  }
};

/* --------------------------------------------------------------------------------------------------------- */
// เปิด modal
const openModal = (userId) => {
  const userMessages = allMessages.value[userId];
  console.log('Open modal for user:', userId);
  console.log('message', userMessages);
  selectedUserMessages.value = userMessages; // Update the selectedUserMessages
  isModalOpen.value = true;
  selectedUserId.value = userId; // Set the selectedUserId
};

const closeModal = () => {
  isModalOpen.value = false;
};

// รับข้อความครั้งแรกมาจาก user ที่ส่งมาแบบ All
const adminIdInt = parseInt(adminId);  
onMounted(() => {
  fetchMessages(); // Fetch messages when the component is mounted

  const channel = pusher.subscribe('messageUser');
  channel.bind("message", (data) => {
    // Log the data received from Pusher
    console.log('Data received from Pusher:', data);

    // Check if the message is from the admin
    if (data.admin_id === adminIdInt) {
      console.log('Message is from admin:', data);
      const newMessage = {
        message: data.message,
        timestamp: formatTime(data.timestamp),
        admin_id: data.admin_id,
        user_id: data.user_id,
        user_name: data.user_name,
      };

      // Update allMessages only if it's a new user or message
      if (!allMessages.value[data.user_id]) {
        allMessages.value[data.user_id] = [];
      }
      allMessages.value[data.user_id].push(newMessage);

   
      messages.value[data.user_id] = [newMessage];
    } 
  });

  
});

// แสดงข้อความตอบกลับจาก user
const channelmessagefromUser = "Toadminid" + adminId;
const messagefromUser = ref([]);
const userChannel = pusher.subscribe(channelmessagefromUser);
userChannel.bind('message', (data) => {
  console.log('Message from user received:', data); // Log received data
  const newMessage = {
    message: data.message,
    timestamp: formatTime(data.timestamp),
    admin_id: data.admin_id,
    user_id: data.user_id,
    user_name: data.user_name,
  };

  // Update allMessages and selectedUserMessages
  if (!allMessages.value[data.user_id]) {
    allMessages.value[data.user_id] = [];
  }
  allMessages.value[data.user_id].push(newMessage);
  if (selectedUserId.value === data.user_id) {
    selectedUserMessages.value.push(newMessage);
  }
});

const state = reactive({
  newMessage: "", // Add newMessage to the state
});


</script>

<template>
  <LayoutNurse class="bg-gradient-to-b from-blue-100">
    <!-- Content -->
    <div class="container mx-auto">
      <div class="box-content-small p-3 ml-5 mr-5 mt-10 bg-gradient-to-b from-blue-900 to-blue-800 shadow-lg shadow-slate-500/50 rounded-lg">
        <h2 class="font-semibold text-xl text-center text-slate-200">
          คุยกับผู้ป่วย
        </h2>
      </div>

      <div class="lg:flex lg:h-screen antialiased text-gray-800 box-content bg-white shadow-lg shadow-gray-300/50 mt-10 mb-10 ml-10 mr-10 rounded-lg">
        <div class="flex h-screen antialiased text-gray-800 container">
          <div class="flex flex-row h-full w-full overflow-x-hidden">
            <div class="flex flex-col py-8 pl-6 pr-2 w-64 bg-white flex-shrink-0 rounded-xl">
              <div class="flex flex-col items-center bg-indigo-100 border border-gray-200 mt-4 w-full py-6 px-4 rounded-lg">
                <div class="h-20 w-20 rounded-full border overflow-hidden">
                  <img
                    src="https://cdn.icon-icons.com/icons2/582/PNG/512/asistante_icon-icons.com_55049.png"
                    class="h-full w-full"
                  />
                </div>
                <div class="text-sm font-semibold mt-2">
                  {{ name }}
                </div>
              </div>

              <div class="flex flex-col mt-8">
                <div class="flex flex-row items-center justify-between text-xs">
                  <span class="font-bold">ข้อความจากผู้ป่วย</span>
                </div>

                <div class="flex flex-col space-y-1 mt-4 -mx-2 h-80 overflow-y-auto mr-2">
                  <button
                    @click="openModal(userId)"
                    v-for="(userMessages, userId) in messages"
                    :key="userId"
                    :class="[
                      'flex flex-row items-center hover:bg-gray-100 rounded-xl p-3',
                      { 'bg-blue-200': selectedUserId === userId } // Add highlight class here
                    ]"
                  >
                    <div class="h-10 w-10 bg-indigo-200 rounded-full overflow-hidden flex items-center justify-center">
                      <img
                        src="https://cdn.icon-icons.com/icons2/2266/PNG/512/patient_icon_140481.png"
                        alt="User Icon"
                        class="h-8 w-8 object-cover"
                      />
                    </div>
                    <div class="ml-2 flex flex-col items-start pl-2">
                      <p class="text-sm font-semibold text-gray-900">
                        {{ userMessages[0].user_name }}
                      </p>
                      <p class="text-xs text-gray-500">
                        {{ formatTime(userMessages[0].timestamp) }}
                      </p>
                      <p class="text-sm font-normal text-gray-900">
                        {{ userMessages[0].message }}
                      </p>

                      <p class="text-sm font-normal text-green-500 " v-if="userMessages[0].is_answered">
                           ตอบกลับแล้ว
                      </p>
                      <p class="text-sm font-normal text-red-600 " v-else>
                           ยังไม่ได้ตอบกลับ
                      </p>
                      
                       <button @click="deleteChatRooms" class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg">
                       ลบห้องแชท
                      </button>

                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div v-if="isModalOpen" class="flex flex-col flex-auto h-full p-6">
              <div class="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
                <div class="flex flex-col h-full overflow-x-auto mb-4">
                  <div class="flex flex-col h-full">

                      <!-- Chat Messages -->
                          <div class="flex flex-col h-full overflow-x-auto mb-4">
                              <div v-for="message in selectedUserMessages" :key="message.timestamp" > 
                                <!-- Admin -->
                                <div v-if="message.reply_type !== 'admin'" class="col-start-1 col-end-8 p-3 rounded-lg">
                                  <div class="flex flex-row items-center">
                                    <div  class="h-10 w-10 bg-indigo-200 rounded-full overflow-hidden flex items-center justify-center mr-3">
                                      <img
                                        src="https://cdn.icon-icons.com/icons2/2266/PNG/512/patient_icon_140481.png"
                                        alt="User Icon"
                                        class="h-8 w-8 object-cover"
                                      />
                                    </div>
                                    <div  class="bg-gray-300 text-black py-2 px-4 rounded-xl max-w-xs">
                                        <p class="text-sm font-semibold text-gray-900">
                                          {{message.user_name}}  
                                        </p> 
                                          

                                        <p class="text-xs text-gray-500">
                                        {{ formatTime(message.created_at) }}
                                        </p>

                                        
                                        <p class="text-sm font-normal text-gray-900">
                                          {{ message.message }}
                                        </p>
                                    
                                      </div>
                                  </div>
                                </div>

                                  <!-- user -->
                                  <div v-else class="col-start-6 col-end-13 p-3 rounded-lg">
                                  <div class="flex items-center justify-start flex-row-reverse">
                                    <div  class="h-10 w-10 bg-indigo-200 rounded-full overflow-hidden flex items-center justify-center">
                                    <img
                                        src="https://cdn.icon-icons.com/icons2/582/PNG/512/asistante_icon-icons.com_55049.png"
                                        class="h-full w-full"
                                    />
                                    </div>
                                    <div  class="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                                        <p  class="text-sm font-semibold text-gray-900">
                                          {{message.admin_name}}  
                                        </p>

                                        <p class="text-xs text-gray-500">
                                        {{ formatTime(message.created_at) }}
                                      </p>

                                        <p class="text-sm font-normal text-gray-900">
                                          {{ message.message }}  
                                        </p>
                                    </div>
                                  </div>
                                </div>
                            </div>
                          </div> 
     <!-- --------------------------------------------------------------------------------------- -->                                       
                      </div>
                      </div>

<!-- ------------------------------------------------------------------------------ -->

                <div class="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
                  <div class="flex-grow ml-4">
                    <div class="relative w-full">
                      <input
                        v-model="message"
                        type="text"
                        placeholder="ส่งข้อความที่นี้..."
                        class="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                      />
                    </div>
                  </div>
                  <div class="ml-4">
                    <button @click="sendMessageToUser(selectedUserId)" class="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0">
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
  </LayoutNurse>
</template>

<style>
</style>
