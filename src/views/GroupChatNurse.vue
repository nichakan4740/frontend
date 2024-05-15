<script setup>
import { ref, onMounted, computed, reactive } from "vue";
import LayoutNurse from "../layouts/LayoutNurse.vue";
import moment from "moment";
import Pusher from "pusher-js";
import Swal from "sweetalert2";

const formatTime = (time) => {
  return moment(time).format("YYYY-MM-DD HH:mm:ss");
};

const pusher = new Pusher("c38b6cfa9a4f7e26bf76", {
  cluster: "ap1",
  encrypted: true,
});

const adminId = localStorage.getItem("idadmin");
const state = reactive({
  message: [],
  filteredMessages: [],
  latestMessagesByUserId: {}, // Object to store the latest message of each user
  selectedUserMessages: null, // Store messages of the selected user for modal
  selectedUserId: null, // Store the selected userId
  newMessage: "", // Store the new message input
  messagefromUser: ref([]) // Store messages from users
});


onMounted(() => {
  const channel = pusher.subscribe('messageUser');
  channel.bind("message", (data) => {
    const newMessage = {
      message: data.message,
      timestamp: formatTime(data.timestamp),
      admin_id: data.admin_id,
      user_id: data.user_id,
      user_name: data.user_name,
    };

    state.message.push(newMessage);
    if (parseInt(data.admin_id) === parseInt(adminId)) {
      state.filteredMessages.push(newMessage);

      // Update the latest message for each user_id
      state.latestMessagesByUserId[data.user_id] = newMessage;

      // Save to local storage
      localStorage.setItem("filteredMessages", JSON.stringify(state.filteredMessages));
    }
    window.scrollTo(0, document.body.scrollHeight);
  });

  // Load filtered messages from local storage
  const filteredMessagesFromStorage = localStorage.getItem("filteredMessages");
  if (filteredMessagesFromStorage) {
    state.filteredMessages = JSON.parse(filteredMessagesFromStorage);

    // Initialize the latestMessagesByUserId from filtered messages
    state.filteredMessages.forEach((msg) => {
      state.latestMessagesByUserId[msg.user_id] = msg;
    });
  }
});
/* --------------------------------------------------------------------------------------------------- */
// Function to open the modal and show messages of the selected user
/* const openModal = (userId) => {
  // Find all messages from the selected user
  const userMessages = state.filteredMessages.filter(msg => msg.user_id === userId);
  if (userMessages.length > 0) {
    state.selectedUserMessages = userMessages;
    state.selectedUserId = userId;
  } else {
    Swal.fire({
      icon: 'info',
      title: 'ไม่พบข้อมูล',
      text: 'ไม่พบข้อมูลสำหรับผู้ใช้นี้',
    });
  }
}; */
const openModal = (userId) => {
  // Find all messages from the selected user
  const userMessages = state.filteredMessages.filter(msg => msg.user_id === userId);
  const userMessagesFromStorage = messagefromUser.value.filter(msg => msg.user_id === userId); // Filter messages from user stored in messagefromUser
  if (userMessages.length > 0) {
    // Concatenate userMessages and userMessagesFromStorage to include all messages
    const allUserMessages = [...userMessages, ...userMessagesFromStorage];
    state.selectedUserMessages = allUserMessages;
    state.selectedUserId = userId;
  } else {
    Swal.fire({
      icon: 'info',
      title: 'ไม่พบข้อมูล',
      text: 'ไม่พบข้อมูลสำหรับผู้ใช้นี้',
    });
  }
};

/* ---------------------------------------------------------------------------------------------------- */
// Function to send a message to the selected user
const sendMessageToUser = async () => {
  const message = state.newMessage;
  const userId = state.selectedUserId;

  if (message.trim() === "") {
    return;
  }

  const payload = {
    message: message,
    admin_id: adminId,
  };

  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}api/sendmessage/ToUser/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      // Update the state with the new message
      const newMessage = {
        message: message,
        timestamp: formatTime(new Date()), // Use current time for timestamp
        admin_id: adminId,
        user_id: userId,
        user_name: state.selectedUserMessages[0]?.user_name || "Unknown", // Assuming user_name is the same for the selected user's messages
      };

      state.selectedUserMessages.push(newMessage);
      state.filteredMessages.push(newMessage);
      state.latestMessagesByUserId[userId] = newMessage;

      // Save to local storage
      localStorage.setItem("filteredMessages", JSON.stringify(state.filteredMessages));

      // Clear the input field
      state.newMessage = "";

      // Optionally, show success message
      Swal.fire({
        icon: 'success',
        title: 'ส่งข้อความสำเร็จ',
      });
    } else {
      // Handle error
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
/* แสดงข้อความตอบกลับจาก user---------------------------------------------------------------------------------------------- */
onMounted(() => {
 
});
const messagefromUser = ref([]);
const channel = pusher.subscribe('Conversation');
channel.bind('message', (data) => {
  console.log(data); // Check the structure of data
messagefromUser.value.push({
  message: data.message,
  timestamp: formatTime(data.timestamp),
  admin_id: data.admin_id,
  user_id: data.user_id,
  user_name: data.user_name,
});

 localStorage.setItem("messagefromUser", JSON.stringify(messagefromUser.value));

});
 onMounted(() => {
  const storedMessages = JSON.parse(localStorage.getItem("messagefromUser")) || [];
  messagefromUser.value = storedMessages;
}); 





/* ---------------------------------------------------------------------------------------------- */

// ดึงข้อมูล name จาก Local Storage
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
  <LayoutNurse class="bg-gradient-to-b from-blue-100">
    <!-- Content -->
    <div class="container mx-auto">
     
     <div class="box-content-small p-3 ml-5 mr-5 mt-10 bg-gradient-to-b from-blue-900 to-blue-800 shadow-lg shadow-slate-500/50 rounded-lg">
        <h2 class="font-semibold text-xl text-center text-slate-200">
          คุยกับผู้ป่วย
        </h2>
      </div>
<!-- ---------------------------------- -->
 <div class="lg:flex lg:h-screen antialiased text-gray-800 box-content bg-white shadow-lg shadow-gray-300/50 mt-10  mb-10  ml-10  mr-10  rounded-lg">
      <!-- component -->
      <div class="flex h-screen antialiased text-gray-800 container">
        <div class="flex flex-row h-full w-full overflow-x-hidden ">
          <div
            class="flex flex-col py-8 pl-6 pr-2 w-64 bg-white flex-shrink-0 rounded-xl"
          >
            <div
              class="flex flex-col items-center bg-indigo-100 border border-gray-200 mt-4 w-full py-6 px-4 rounded-lg"
            >
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

              <!-- ข้อความด้านซ้ายที่เข้ามา  -->
              <div class="flex flex-col space-y-1 mt-4 -mx-2 h-80 overflow-y-auto mr-2">
                <button
                 v-for="(msg, userId) in state.latestMessagesByUserId" :key="userId"
                  @click="openModal(userId)"
                  class="flex flex-row items-center hover:bg-gray-100 rounded-xl p-3"
                >
                  <div class="flex items-center">
                    <div
                      class="h-10 w-10 bg-indigo-200 rounded-full overflow-hidden flex items-center justify-center"
                    >
                      <img
                        src="https://cdn.icon-icons.com/icons2/2266/PNG/512/patient_icon_140481.png"
                        alt="Coronavirus Patient Icon"
                        class="h-8 w-8 object-cover"
                      />
                    </div>
                    <div class="ml-2 flex flex-col items-start pl-2">
                      <p class="text-sm font-semibold text-gray-900">
                        {{ msg.user_name }} 
                      </p>
                      <p class="text-xs text-gray-500">
                        {{ msg.timestamp }}
                      </p>
                      <p class="text-sm font-normal text-gray-900">
                        {{msg.message  }}
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

<!-- ------------------------------------------------------------------------------------------------ -->
   <!-- ข้อความด้านขวา -->
          <div v-if="state.selectedUserMessages" class="flex flex-col flex-auto h-full p-6">
            <div
              class="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4"
            >
              <div class="flex flex-col h-full overflow-x-auto mb-4">
                <div class="flex flex-col h-full">
                  <div class="grid grid-cols-12 gap-y-2">
                    <div 
                      v-for="(msg, index) in state.selectedUserMessages" 
                      :key="index" 
                      :class="{
                        'col-start-1 col-end-8 p-3 rounded-lg': msg.admin_id !== adminId,
                        'col-start-6 col-end-13 p-3 rounded-lg justify-end flex': msg.admin_id === adminId
                      }"
                    >
                      <div 
                        :class="{
                          'flex flex-row items-center': msg.admin_id !== adminId,
                          'flex flex-row-reverse items-center': msg.admin_id === adminId
                        }"
                      >
                        <div 
                          :class="{
                            'flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0': msg.admin_id !== adminId,
                            'flex items-center justify-center h-10 w-10 rounded-full bg-green-500 flex-shrink-0': msg.admin_id === adminId
                          }"
                        >
                           {{ msg.admin_id !== adminId ? msg.user_name.charAt(0) : firstCharacter }}
                        </div>
                        <div class="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                          <div>{{ msg.message }}</div>
                          <p class="text-xs text-gray-600">
                            {{ msg.timestamp }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
<!-- ------------------------------------------------------------------------------------------------------ -->
<div class="grid grid-cols-12 gap-y-2">
  <div 
    v-for="(msg, index) in messagefromUser" 
    :key="index" 
    :class="{
      'col-start-1 col-end-8 p-3 rounded-lg': msg.admin_id !== adminId,
      'col-start-6 col-end-13 p-3 rounded-lg justify-end flex': msg.admin_id === adminId
    }"
  >
    <div 
      :class="{
        'flex flex-row items-center': msg.admin_id !== adminId,
        'flex flex-row-reverse items-center': msg.admin_id === adminId
      }"
    >
      <div 
        :class="{
          'flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0': msg.admin_id !== adminId,
          'flex items-center justify-center h-10 w-10 rounded-full bg-green-500 flex-shrink-0': msg.admin_id === adminId
        }"
      >
        {{ msg.user_name }} 
      </div>
      <div class="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
        <div>{{ msg.message }}</div>
        <p class="text-xs text-gray-600">
          {{ msg.timestamp }}
        </p>
      </div>
    </div>
  </div>
</div>
<!-- ------------------------- -->

              </div>
<!-- --------------------------------------------------------------------------------------------------------------------------------------------------- -->
              <!-- ข้อความที่ส่ง -->
              <div class="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
                <div class="flex-grow ml-4">
                  <div class="relative w-full">
                    <input
                      v-model="state.newMessage"
                      type="text"
                      placeholder="ส่งข้อความที่นี้..."
                      class="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                    />
                  </div>
                </div>
                <div class="ml-4">
                  <button @click="sendMessageToUser" class="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0">
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