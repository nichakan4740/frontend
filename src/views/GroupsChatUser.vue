<script setup>
import { useRouter } from "vue-router";
import Layout from "../layouts/Layout.vue";
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

const Loading = ref(true);
const messageFromAdmin = ref([]);

const pusherAdmin = new Pusher("c38b6cfa9a4f7e26bf76", {
  cluster: "ap1",
  encrypted: true,
});

const channelAdmin = pusherAdmin.subscribe("reply");
channelAdmin.bind("message", (data) => {
  console.log("ข้อมูลที่ได้รับมาadmin:", data);

  if ("text" in data && "admin_ids" in data) {
    const messageAdmin = {
      user: {
        name: "พยาบาล",
        nameUser: data.fname,
      },
      createdAt: new Date(),
      messageadmin: data.text,
      iduser: data.id,
      idadmin: data.admin_ids[0], // ดึงค่า idadmin จาก index แรกของ admin_ids array
    };

    messageFromAdmin.value.push(messageAdmin);
    // เก็บเฉพาะค่า idadmin ใน localStorage
    localStorage.setItem("idadmin", data.admin_ids[0]);
  } else {
    console.error('ข้อมูลที่ได้รับมาไม่มี key "text" หรือ "admin_ids":', data);
  }
});

onMounted(() => {
  Loading.value = false;
  const storedMessagesAdmin = localStorage.getItem("chatMessagesfromadmin");
  if (storedMessagesAdmin) {
    messageFromAdmin.value = JSON.parse(storedMessagesAdmin);
  }
});

const formatTime = (time) => {
  return moment(time).format("YYYY-MM-DD HH:mm:ss");
};

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

  fetch(`${import.meta.env.VITE_BASE_URL}api/conversation/reply`, {
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
  const savedConversationsadmin = localStorage.getItem(
    "conversationreplyadmin"
  );
  if (savedConversationsadmin) {
    conversationreplyadmin.value = JSON.parse(savedConversationsadmin);
  }

  // ตรวจสอบว่ามี replyData ใน local storage หรือไม่ และกำหนดค่าให้กับ replyData ในกรณีที่มี
  const savedReplyDataadmin = localStorage.getItem("replyDataAdmin");
  if (savedReplyDataadmin) {
    replyDataAdmin.value = JSON.parse(savedReplyDataadmin);
  }
});
</script>

<template>
  <Layout class="bg-gradient-to-b from-blue-100">
    <div class="container mx-auto">
      <div
        class="box-content-small p-3 ml-5 mr-5 mt-10 bg-gradient-to-b from-blue-900 to-blue-800 shadow-lg shadow-slate-500/50 rounded-lg"
      >
        <h2 class="font-semibold text-xl text-center text-slate-200">
          คุยกับเรา
        </h2>
      </div>
      <div
        class="box-content bg-white shadow-lg shadow-gray-300/50 mt-10 ml-5 mr-5 pt-1 pb-6 pl-20 pr-20 mb-5 rounded-lg"
      >
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
        <!-- แสดงที่ admin ตอบกลับมา -->
        <div class="chat-container p-4 border rounded-md border-gray-300 max-h-96 overflow-y-auto">
          <!-- เพิ่มเงื่อนไขเพื่อตรวจสอบว่ามีข้อความจากผู้ดูแลระบบหรือไม่ -->
          <div v-if="messageFromAdmin.length > 0" class="chat-box">
            <div
              v-for="message in messageFromAdmin"
              :key="message.id"
              class="message p-2 mb-2 bg-gray-100 rounded-lg"
            >
              <div class="flex justify-between mb-1">
                <!-- แสดงเวลา -->
                <span class="text-xs text-gray-500">{{
                  formatTime(message.createdAt)
                }}</span>
                <!-- แสดงชื่อผู้ส่ง -->
                <span class="text-sm font-semibold"
                  >{{ message.user.name }} {{ message.user.nameUser }}</span
                >
              </div>
              <!-- แสดงข้อความ -->
              <div class="text-sm">{{ message.messageadmin }}</div>
            </div>
          </div>
        </div>
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
  </Layout>
</template>

<style></style>
