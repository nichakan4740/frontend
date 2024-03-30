<script setup>
import Layout from "../layouts/Layout.vue";
import { useRouter } from "vue-router";
import moment from "moment";
import Swal from "sweetalert2";
import Pusher from "pusher-js";
import { ref, onMounted, computed } from "vue";


/* ส่งหา admin id ทุกคน */
const conversations = ref([]);
const message = ref("");
const userId = localStorage.getItem("iduser");

const pusher = new Pusher("c38b6cfa9a4f7e26bf76", {
  cluster: "ap1",
  encrypted: true,
});

const store = () => {
  sendMessage(userId, message.value);
};

const formatTime = (time) => {
  return moment(time).format("YYYY-MM-DD HH:mm:ss");
};

const listenForNewMessage = () => {
  const channel = pusher.subscribe("live-chat");
  channel.bind("message", (data) => {
    if (data.iduser === userId) {
      conversations.value.push(data);
    }
  });
};

const sendMessage = (userId, message) => {
  fetch(`${import.meta.env.VITE_BASE_URL}api/conversations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      message: message,
      user_id: userId,
      admin_id: "all",
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.iduser === userId) {
        conversations.value.push(data);
        localStorage.setItem(
          "conversations",
          JSON.stringify(conversations.value)
        );
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

onMounted(() => {
  listenForNewMessage();
  const savedConversations = localStorage.getItem("conversations");
  if (savedConversations) {
    conversations.value = JSON.parse(savedConversations);
  }
});

const conversationsFiltered = computed(() => {
  return conversations.value.filter(
    (conversation) => conversation.iduser === userId
  );
});


/* --------------------------------------------------------------------------------------------------------------------  */

/* การตอบกลับข้อความ------------------------------------------------------------------ */

const messageFromAdmin = ref([]);
const mergedMessagesAdminUser = ref([]);
const pusherAdmin = new Pusher("c38b6cfa9a4f7e26bf76", {
  cluster: "ap1",
  encrypted: true,
});

 const channelAdmin = pusherAdmin.subscribe("replyAdmin");
channelAdmin.bind("message", (data) => {

  if ("text" in data && "admin_ids" in data) {
    const message = {
      user: {
        type: 'user',
        name: data.fname,
      },
      createdAt: new Date(),
      text: data.text,
      iduser: data.id,
      idadmin: data.admin_ids[0],
    };
    mergedMessagesAdminUser.value.push(message);
    localStorage.setItem("chatMessagesfromadmin", JSON.stringify(mergedMessagesAdminUser.value));
    localStorage.setItem("idadmin", data.admin_ids[0]);
  }
}); 
const channelSendofUser = pusher.subscribe("replyUser");
channelSendofUser.bind("message", (data) => {

  if ("text" in data && "admin_ids" in data) {
    const message = {
      user: {
        type: 'admin',
        name: "พยาบาล",
        nameUser: data.fname,
      },
      createdAt: new Date(),
      text: data.text,
      iduser: data.id,
      idadmin: data.admin_ids[0],
    };
    mergedMessagesAdminUser.value.push(message);
    localStorage.setItem("chatMessagesfromadmin", JSON.stringify(mergedMessagesAdminUser.value));
    localStorage.setItem("idadmin", data.admin_ids[0]);
  
  }
});

const filterMessagesByUserId = (messages, userId) => {
  return messages.filter(message => message.iduser === userId);
};

// ใช้ filterMessagesByUserId เพื่อกรองข้อมูลก่อนนำไปแสดงผลในตัวแปร mergedMessagesAdminUser.value
onMounted(() => {
  const storedMessagesAdmin = localStorage.getItem("chatMessagesfromadmin");
  const userId = parseInt(localStorage.getItem("iduser")); // แปลงเป็นตัวเลข

  if (storedMessagesAdmin && !isNaN(userId)) {
    const parsedMessages = JSON.parse(storedMessagesAdmin);
    mergedMessagesAdminUser.value = filterMessagesByUserId(parsedMessages, userId);
  }
});


/* ------------------------------------------------------------------------------------------------------------- */
/* ตอบกลับแบบเจาะจง id admin   */
const conversationreplyadmin = ref([]);
const replyadmin = ref("");

const pusherreplyadmin = new Pusher("c38b6cfa9a4f7e26bf76", {
  cluster: "ap1",
  encrypted: true,
});

const replyDataAdmin = ref(null); // เพิ่มตัวแปร replyData เพื่อเก็บข้อมูลที่ได้รับจากการส่งข้อความตอบกลับ

const replyAdmin = () => {
  sendReplyAdmin(userId, replyadmin.value);
  replyadmin.value = "";
};

const listenForNewMessagereplyadmin = () => {
  const channel = pusherreplyadmin.subscribe("reply");
  channel.bind("message", (data) => {
    if (data.id === userId) {
      conversationreplyadmin.value.push(data);
    }
  });
};

const sendReplyAdmin = (userId, replyadmin) => {
  // ดึงค่า idadmin จาก localStorage
  const idadmin = localStorage.getItem("idadmin");

  fetch(`${import.meta.env.VITE_BASE_URL}api/reply/admin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      message: replyadmin,
      admin_id: idadmin,
      user_id: userId,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Response from sendReply:", data);
      replyDataAdmin.value = data;
      if (data.user_id === userId) {
        conversationreplyadmin.value.push(data);
        localStorage.setItem(
          "conversationreplyadmin",
          JSON.stringify(conversationreplyadmin.value)
        );

        // เพิ่มบันทึกค่า replyDataAdmin ลงใน localStorage เมื่อได้รับข้อมูลตอบกลับใหม่
        localStorage.setItem(
          "replyDataAdmin",
          JSON.stringify(replyDataAdmin.value)
        );
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

onMounted(() => {
  listenForNewMessagereplyadmin();
});


/* เลือก Teb */
const activeTab = ref(1);

</script>

<template>
  <Layout class="bg-gradient-to-b from-blue-100">

    <div class="container mx-auto">
      <!-- Tabs -->
       <div class="flex justify-center items-center pt-10">
        <button class="tab font-semibold text-slate-800 " :class="{ 'active': activeTab === 1 }" @click="activeTab = 1"> คุยกับพยาบาล </button>
        <button class="tab font-semibold text-slate-800 " :class="{ 'active': activeTab === 2 }" @click="activeTab = 2"> Chatbot สอบถามข้อสงสัยเบื้องต้น</button>
      </div>
<!-- ----------------------------------------------------------------------------------------------------------------------------------- -->


      <!-- Tab content ที่ 1 -->
      <div v-if="activeTab === 1">
      <div class="container mx-auto">
  
      <div class="box-content bg-white shadow-lg shadow-gray-300/50 mt-10 ml-5 mr-5 pt-1 pb-6 pl-20 pr-20 mb-5 rounded-lg" >
        <div class="flex items-center ml-5 mr-5">
          <img
            class="rounded-full w-10 h-10"
            src="https://media.istockphoto.com/id/1253022688/th/%E0%B9%80%E0%B8%A7%E0%B8%84%E0%B9%80%E0%B8%95%E0%B8%AD%E0%B8%A3%E0%B9%8C/%E0%B9%84%E0%B8%AD%E0%B8%84%E0%B8%AD%E0%B8%99%E0%B9%81%E0%B8%9E%E0%B8%97%E0%B8%A2%E0%B9%8C%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%9E%E0%B8%A2%E0%B8%B2%E0%B8%9A%E0%B8%B2%E0%B8%A5%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B8%95%E0%B8%B9%E0%B8%99.jpg?s=612x612&w=0&k=20&c=n1nvQUuq3wjco_oY59OgzrpthJfEkXwfxeJzrPsnCOs="
          />
          <div class="pl-2">
            <div class="font-semibold">
              <a class="hover:underline" href="#">พยาบาล</a>
            </div>
            <div class="text-xs text-gray-600">Online</div>
          </div>
        </div>
        <div>
          <div style="display: flex; align-items: center">
            <input
              type="text"
              id="small-input"
              class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500"
              v-model="message"
            />
            <button @click="store">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-6 h-6"
              >
                <path
                  d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z"
                />
              </svg>
            </button>
          </div>


          <ul>
            <li
              class="text-red-800"
              v-for="conversation in conversationsFiltered"
              :key="conversation.id"
            >
              {{ conversation.messages }}
              {{ conversation.iduser }}
            </li>
          </ul>
        </div>

        <p>--------------------------------------------------</p>
        <!-- แสดงที่ admin user ตอบกลับไปมา -->
<div class="chat-container p-4 border rounded-md border-gray-300 max-h-96 overflow-y-auto">
  <template v-for="(message, index) in mergedMessagesAdminUser" :key="index">
    <div v-if="message.user.type === 'admin'" class="message flex items-start mb-4">
      <div class="flex flex-col">
        <div class="text-xs text-gray-500">{{ formatTime(message.createdAt) }}</div>
        <div class="flex items-center">
          <div class="bg-gray-100 rounded-lg p-2">
            <span class="text-sm font-semibold">{{ message.user.name }}</span>
          </div>
          <div class="ml-2 bg-blue-500 text-white rounded-lg p-2">
            <span class="text-sm">{{ message.text }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="message flex items-end justify-end mb-4">
      <div class="flex flex-col">
        <div class="text-xs text-gray-500">{{ formatTime(message.createdAt) }}</div>
        <div class="flex items-center justify-end">
          <div class="mr-2 bg-blue-500 text-white rounded-lg p-2">
            <span class="text-sm">{{ message.text }}</span>
          </div>
          <div class="bg-gray-100 rounded-lg p-2">
            <span class="text-sm font-semibold">{{ message.user.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </template>
</div>


<!--+++++++++++++++++++++++ -->

        <!-- --------------------------------------------- -->

        <!-- เพิ่มส่วนนี้เพื่อแสดงผลข้อความที่ส่งไป -->
        <div v-if="replyDataAdmin">
          <p>ตอบกลับ: {{ replyDataAdmin.message }}</p>
        </div>

        <!-- ------------------------------------------------------------------------------ -->
      </div>

      <!-- --------------------------------------------------------------------------------------------------------- -->
    </div>

    <!-- -------------------------------- -->
    <div class="mb-8 ml-2 mr-4">
      <input
        type="text"
        v-model="replyadmin"
        placeholder="พิมพ์ข้อความตอบกลับ"
      />
      <button @click="replyAdmin">ส่ง</button>
    </div>

    <!-- ----------------------------------------------------- -->
    <div class="mb-8 ml-2 mr-4">
      <p class="text">**ขออภัย กำลังอยู่ในช่วงพัฒนา**</p>
    </div>
      </div>










<!-- ----------------------------------------------------------------------------------------------------------------------------------------------------------- -->
<!-- Tab conten ที่ 2 -->
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
