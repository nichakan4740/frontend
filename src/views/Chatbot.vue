<script setup>
import Layout from "../layouts/Layout.vue";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import moment from "moment";
import Swal from "sweetalert2";
import Pusher from "pusher-js";

const formatTime = (time) => moment(time).format("YYYY-MM-DD");

/* Constants and References */
const userId = localStorage.getItem("iduser");
const conversations = ref([]);
const message = ref("");
const messageFromAdmin = ref([]);
const fnameUser = localStorage.getItem("fname");
const name = ref(fnameUser); // Define name
/* Fetching User Messages */
const messages = ref([]);
const fetchUserMessages = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}api/user/${userId}/messages`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    messages.value = data;
  } catch (error) {
    console.error('Error fetching user messages:', error);
  }
};
onMounted(() => {
  fetchUserMessages();
});

/* Send Message to All Admins */
const sendMessageAll = async () => {
  if (message.value.trim() === "") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "ข้อความต้องไม่ว่างเปล่า",
    });
    return;
  }
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}api/sendmessage/all`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          message: message.value,
          user_id: userId,
          admin_id: "all",
        }),
      }
    );

    if (!response.ok)
      throw new Error((await response.text()) || "Failed to send message");

    const responseData = await response.json();
    console.log("Message sent successfully:", responseData);
    
    // เพิ่มข้อความที่ส่งไปใน messages array
    messages.value.push(responseData);
    
    // บันทึกข้อมูลลงใน Local Storage (ตามความเหมาะสม)
    localStorage.setItem("messages", JSON.stringify(messages.value));
  } catch (error) {
    console.error("Error sending message:", error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Failed to send message",
    });
  }
};

/* ข้อความจาก Admin */
const pusher = new Pusher("c38b6cfa9a4f7e26bf76", {
  cluster: "ap1",
  encrypted: true,
});

const channelmessagefromAdmin = "Touserid" + userId;
const channel = pusher.subscribe(channelmessagefromAdmin);
channel.bind("message", (data) => {
  console.log(data); // Check the structure of data
  messageFromAdmin.value.push({
    message: data.message,
    timestamp: formatTime(data.timestamp),
    admin_id: data.admin_id,
    user_id: data.user_id,
    admin_name: data.admin_name,
  });
  // เพิ่มข้อความที่ได้รับใน messages array
  messages.value.push(data);
  // อัปเดตค่า admin_id ใน Local Storage
  localStorage.setItem("adminidForsendToUser", data.admin_id);
});

/* ---------------------------------------------------- */
const messagetoadmin = ref("");
const sendMessageToAdmin = async (chatRoomId) => {
  try {
   /*  const adminId =
      messageFromAdmin.value.length > 0
        ? messageFromAdmin.value[messageFromAdmin.value.length - 1].admin_id
        : null;
    console.log("Parsed Admin ID:", adminId); */
    const adminId= localStorage.getItem("adminidForsendToUser");

    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}api/sendmessage/ToAdmin/${adminId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          message: messagetoadmin.value,
          user_id: userId,
          chat_room_id: chatRoomId,
          user_name: name.value,
          reply_type: 'user',
        }),
      }
    );

    if (!response.ok) {
      throw new Error((await response.text()) || "Failed to send message");
    }

    const responseData = await response.json();
    console.log("Message sent successfully:", responseData);
    
    // เพิ่มข้อความที่ส่งไปใน messages array และเพิ่ม user_name และ reply_type
    const newMessage = {
      ...responseData,
      user_name: name.value,
      reply_type: 'user',
    };
    messages.value.push(newMessage);

    messagetoadmin.value = "";

    Swal.fire({
      icon: "success",
      title: "ส่งข้อความสำเร็จ",
    });
  } catch (error) {
    console.error("Error sending message:", error);
  }
};




/* -------------------------------------------------------------------------------------- */
// สร้าง reactive property เพื่อตรวจสอบว่า collapse ไหนเปิดอยู่
const activeCollapse = ref(0);

// function เพื่อเปิด/ปิด collapse
const toggleCollapse = (index) => {
  activeCollapse.value = (activeCollapse.value === index) ? 0 : index;
};

const activeTab = ref(1);

const nameUser = localStorage.getItem("lname");

</script>

<template>
  <Layout class="bg-gradient-to-b from-blue-100">
    <div class="container mx-auto">
      <!-- Tabs -->
      <div class="box-content p-3 ml-5 mr-5 mt-10 bg-gradient-to-b from-blue-900 to-blue-800 shadow-lg shadow-slate-500/50 rounded-lg">
        <div class="flex justify-center items-center">
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

      <div v-if="activeTab === 1">
        <div class="lg:flex lg:h-screen text-gray-800 box-content bg-white shadow-lg shadow-gray-300/50 mt-10 mb-10 pt-5 pb-5 pl-5 pr-10 rounded-lg">
          <div class="flex h-screen antialiased text-gray-800 container">
            <!-- Left Sidebar -->
            <div class="flex flex-row h-full w-full overflow-x-hidden">
              <div class="flex flex-col py-8 pl-6 pr-2 lg:w-64 bg-white flex-shrink-0">
                <!-- Sidebar Content -->
                <!-- User Profile -->
                <div class="flex flex-col items-center bg-indigo-100 border border-gray-200 w-full py-6 px-4 rounded-lg">
                  <!-- User Avatar -->
                  <div class="h-20 w-20 rounded-full border overflow-hidden">
                    <img
                      src="https://cdn.icon-icons.com/icons2/2266/PNG/512/patient_icon_140481.png"
                      alt="Avatar"
                      class="h-full w-full"
                    />
                  </div>
                  <div class="text-sm font-semibold mt-5">{{ nameUser }}</div>
                </div>
                <!-- Active Conversations -->
                <div class="flex flex-col mt-8">
                  <!-- Accordion for New Chat -->
                  <div id="accordion-collapse" data-accordion="collapse">
                    <h2 id="accordion-collapse-heading-1">
                      <button @click="toggleCollapse(1)" :aria-expanded="activeCollapse === 1 ? 'true' : 'false'"
                        class="flex items-center justify-between w-full p-5 font-medium text-gray-500 border border-b border-gray-200 rounded-t-xl w-56">
                        <span>เปิดแชทใหม่ที่นี้</span>
                        <svg :class="{ 'rotate-180': activeCollapse === 1 }" class="w-3 h-3 shrink-0" aria-hidden="true"
                          fill="none" viewBox="0 0 10 6">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5" />
                        </svg>
                      </button>
                    </h2>
                    <div v-show="activeCollapse === 1" id="accordion-collapse-body-1"
                      class="p-5 border-t-0 border rounded-b-lg border-gray-200 w-56">
                      <!-- Input and Send Message -->
                      <div class="mt-4">
                        <textarea v-model="message" placeholder="กรุณากรอกข้อความเพื่อเปิดแชท"
                          class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                          rows="4"></textarea>
                        <div class="mt-2">
                          <button @click="sendMessageAll"
                            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
                            ส่งข้อความ
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- End of Accordion for New Chat -->
                </div>
              </div>

              <!-- Main Chat Area -->
              <div class="flex flex-col flex-auto h-full p-6">
                <!-- Chat Content -->
                <div class="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
                  
                  
       <!-- Chat Messages -->
          <div class="flex flex-col h-full overflow-x-auto mb-4">
              <div v-for="message in messages" :key="message.id" > 
                <!-- Admin -->
                <div v-if="message.reply_type !== 'user'" class="col-start-1 col-end-8 p-3 rounded-lg">
                  <div class="flex flex-row items-center">
                    <div class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0  mr-3">
                      <img
                        src="https://cdn.icon-icons.com/icons2/582/PNG/512/asistante_icon-icons.com_55049.png"
                        class="h-full w-full"
                     />
                    </div>
                    <div  class="bg-gray-300 text-black py-2 px-4 rounded-xl max-w-xs">
                        <p class="text-sm font-semibold text-gray-900">
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

                  <!-- user -->
                  <div v-else class="col-start-6 col-end-13 p-3 rounded-lg">
                  <div class="flex items-center justify-start flex-row-reverse">
                    <div  class="h-10 w-10 bg-indigo-200 rounded-full overflow-hidden flex items-center justify-center">
                       <img
                        src="https://cdn.icon-icons.com/icons2/2266/PNG/512/patient_icon_140481.png"
                        alt="User Icon"
                        class="h-8 w-8 object-cover"
                      />
                    </div>
                    <div  class="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                        <p  class="text-sm font-semibold text-gray-900">
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
             </div>
           </div> 
                  <!-- --------------------------------------------------------------------------- -->
                  <!-- Message Input -->
                  <div class="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
                    <!-- Message Input Field -->
                    <div class="flex-grow ml-4">
                      <div class="relative w-full">
                        <input
                          type="text"
                          v-model="messagetoadmin"
                          class="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                        />
                      </div>
                    </div>
                    <!-- Send Message Button -->
                    <div class="ml-4">
                      <button
                        @click="sendMessageToAdmin(chatRoomId)"
                        class="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
                      >
                        <span>ส่งข้อความ</span>
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
                    <!-- -------------------------------------------------------- -->
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
          <p class="text">
            หากมีคำถามเพิ่มเติมหรือต้องการความช่วยเหลือเพิ่มเติมใด ๆ ก็อย่าลังเลที่จะสอบถามมานะคะ ฉันยินดีที่ได้ช่วยเสมอค่ะ!
          </p>
          <p class="text">
            **ขออภัยในเรื่องของขอมูลในการตอบคำถาม กำลังอยู่ในช่วงพัฒนา**
          </p>
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
