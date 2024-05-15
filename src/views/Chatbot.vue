<script setup>
import Layout from "../layouts/Layout.vue";
import { useRouter } from "vue-router";
import moment from "moment";
import Swal from "sweetalert2";
import Pusher from "pusher-js";
import { ref, onMounted, computed } from "vue";

const formatTime = (time) => {
  return moment(time).format('YYYY-MM-DD');
};
const userId = localStorage.getItem('iduser');
const conversations = ref([]);
const message = ref('');
const messageFromAdmin = ref([]);

// Fetch initial messages from the backend
const fetchMessages = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}api/messages/${userId}`);
    if (!response.ok) throw new Error(await response.text() || 'Failed to fetch messages');
    const data = await response.json();
    conversations.value = data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Failed to load messages",
    });
  }
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
          admin_id: 'all'
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Failed to send message');
      }

      const responseData = await response.json();
      conversations.value.push(responseData);
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

// Pusher setup
const channelName = 'Conversation';
const pusherUser = new Pusher('c38b6cfa9a4f7e26bf76', {
  cluster: 'ap1',
  encrypted: true,
});
const channel = pusherUser.subscribe(channelName);

channel.bind('message', (data) => {
  messageFromAdmin.value.push({
    message: data.message,
    timestamp: formatTime(data.timestamp),
    admin_id: data.admin_id,
    user_id: data.user_id,
    admin_name: data.admin_name,
  });

  // Update local storage
  localStorage.setItem("messageFromAdmin", JSON.stringify(messageFromAdmin.value));
});

onMounted(() => {
  fetchMessages();

  if (localStorage.getItem("messageFromAdmin")) {
    messageFromAdmin.value = JSON.parse(localStorage.getItem("messageFromAdmin"));
  }
});

// Computed property for filtering user-specific conversations
const filteredConversations = computed(() => {
  return conversations.value.filter(conversation => conversation.user_id === userId);
});




/* เลือก teb */
const activeTab = ref(1);
</script>
<template>
 <Layout class="bg-gradient-to-b from-blue-100">
    <div class="container mx-auto">
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

      <div v-if="activeTab === 1">
        <div class="box-content bg-white shadow-lg shadow-gray-300/50 mt-10 ml-20 mr-20 mb-10 pt-5 pb-5 pl-5 pr-10 rounded-lg h-fit">
          <div>
            <textarea v-model="message" placeholder="กรุณากรอกข้อความ"></textarea>
            <button @click="sendMessageAll">ส่งข้อความ</button>

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

          <div v-if="messageFromAdmin.length > 0">
            <ul>
              <li v-for="(message, index) in messageFromAdmin" :key="index">
                <p>{{ message.message }}</p>
                <p>{{ message.timestamp }}</p>
                <p>{{ message.admin_name }}</p>
              </li>
            </ul>
          </div>
          <div v-else>
            <p>ไม่มีข้อความ</p>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 2">
        <div class="box-content bg-white shadow-lg shadow-gray-300/50 mt-10 ml-5 mr-5 pt-1 pb-6 pl-20 pr-20 mb-5 rounded-lg">
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

      <div class="mb-8 ml-2 mr-4">
        <p class="text">**ขออภัย กำลังอยู่ในช่วงพัฒนา**</p>
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
