<script setup>
import { ref, onMounted,computed } from "vue";
import LayoutNurse from "../layouts/LayoutNurse.vue";
import moment from "moment";
import Swal from "sweetalert2";
import Pusher from "pusher-js";

/* ------------------------------------------------------------------------ */
/* เรียกแสดงข้อความที่ user ส่งมาครั้งแรก */
const isLoadingfromuser = ref(true);
const messages = ref([]);
const pusheruser = new Pusher("c38b6cfa9a4f7e26bf76", {
  cluster: "ap1",
  encrypted: true,
});

const channel = pusheruser.subscribe("live-chat");
channel.bind("message", (data) => {
  console.log("ข้อมูลที่ได้รับมา:", data);

  if ("text" in data) {
    const message = {
      user: {
        fname: data.fname,
      },
      createdAt: new Date(),
      message: data.text,
      iduser: data.id,
    };

    messages.value = [...messages.value, message];

    // บันทึกข้อมูลลงใน local storage
    localStorage.setItem("chatMessages", JSON.stringify(messages.value));

  } else {
    console.error('ข้อมูลที่ได้รับมาไม่มี key "text":', data);
  }
});
onMounted(() => {
  isLoadingfromuser.value = false;

  // ตรวจสอบว่ามีข้อมูลใน local storage หรือไม่
  const storedMessages = localStorage.getItem("chatMessages");
  if (storedMessages) {
    messages.value = JSON.parse(storedMessages);
  }
});
const formatTime = (time) => {
  return moment(time).format("YYYY-MM-DD HH:mm:ss");
};
/* -------------------------------------------------------------------------------------------------------------- */

/* ทำ pop up */
const isOpen = ref(false);

const closeChat = () => {
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
      // ลบข้อมูลใน localStorage โดยใช้ iduser ของ selectedMessage
      const selectedUserId = selectedMessage.value.iduser;
      const storedMessages = JSON.parse(localStorage.getItem('chatMessages'));
      const updatedMessages = storedMessages.filter(message => message.iduser !== selectedUserId);
      localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));

      reloadPage();
    }
  });
};



const reloadPage = () => {
  // โหลดหน้าเว็บใหม่
  window.location.reload();
};

/* เลือกข้อมูล */
const selectedMessage = ref(null); // เพิ่มตัวแปร selectedMessage

const selectMessage = (message) => {
  selectedMessage.value = message;
  isOpen.value = true;
};




/* แสดงการตอบกลับข้อความของ พยาบาลและผู้ป่วย ------------------------------------------------------------------ */

const messageFromUser = ref([]);
const mergedMessages = ref([]);

const pusher = new Pusher("c38b6cfa9a4f7e26bf76", {
  cluster: "ap1",
  encrypted: true,
});

const channelUser = pusher.subscribe("replyAdmin");
channelUser.bind("message", (data) => {
  if ("text" in data && "admin_ids" in data) {
    const message = {
      user: {
        type: "user",
        name: data.fname,
      },
      createdAt: new Date(),
      text: data.text,
      iduser: data.id,
      idadmin: data.admin_ids[0],
    };
    mergedMessages.value.push(message);
   /*  localStorage.setItem(
      "chatMessagesfromuser",
      JSON.stringify(mergedMessages.value)
    ); */
    localStorage.setItem("idadmin", data.admin_ids[0]);
  }
});

const channelSendofAdmin = pusher.subscribe("replyUser");
channelSendofAdmin.bind("message", (data) => {
  if ("text" in data && "admin_ids" in data) {
    const message = {
      user: {
        type: "admin",
        name: "พยาบาล",
        nameUser: data.fname,
      },
      createdAt: new Date(),
      text: data.text,
      iduser: data.id,
      idadmin: data.admin_ids[0],
    };
    mergedMessages.value.push(message);
  /*   localStorage.setItem(
      "chatMessagesfromuser",
      JSON.stringify(mergedMessages.value)
    ); */
    localStorage.setItem("idadmin", data.admin_ids[0]);
  }
});

// สร้าง computed property สำหรับกรองข้อความที่มี id user ตรงกับข้อมูลที่เก็บไว้ใน selectedMessage
const filteredMessages = computed(() => {
  if (!selectedMessage.value) return []; // ถ้าไม่มีข้อความที่ถูกเลือก ให้ return ข้อความว่าง
  return mergedMessages.value.filter(message => message.iduser === selectedMessage.value.iduser);
});


onMounted(() => {
 /*  const storedMessagesUser = localStorage.getItem("chatMessagesfromuser");
  if (storedMessagesUser) {
    mergedMessages.value = JSON.parse(storedMessagesUser);
  } */
});

/*------------- ส่งข้อความตอบกลับไปหา user ---------------------------------------------- */
const conversationreply = ref([]);
const messagereply = ref("");
const adminId = localStorage.getItem("idadmin"); // อ่าน adminID จาก local storage

const pusherreply = new Pusher("c38b6cfa9a4f7e26bf76", {
  cluster: "ap1",
  encrypted: true,
});

const replyData = ref(null); // เพิ่มตัวแปร replyData เพื่อเก็บข้อมูลที่ได้รับจากการส่งข้อความตอบกลับ

const replyUser = () => {
  sendReply(adminId, messagereply.value);
  messagereply.value = "";
};

const listenForNewMessagereply = () => {
  const channel = pusherreply.subscribe("replyUser");
  channel.bind("message", (data) => {
    if (data.id === adminId) {
      conversationreply.value.push(data);
    }
  });
};

const sendReply = (adminId, messagereply) => {
  fetch(`${import.meta.env.VITE_BASE_URL}api/reply/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      message: messagereply,
      admin_id: adminId,
      user_id: messages.value[0].iduser, // ใช้ค่า iduser จากข้อมูลแรกใน messages.value
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Response from sendReply:", data);
      replyData.value = data;
      if (data.admin_id === adminId) {
        conversationreply.value.push(data);
        localStorage.setItem(
          "conversationreply",
          JSON.stringify(conversationreply.value)
        );

   /*      // เพิ่มบันทึกค่า replyData ลงใน localStorage เมื่อได้รับข้อมูลตอบกลับใหม่
        localStorage.setItem("replyData", JSON.stringify(replyData.value)); */
      }
    })

    .catch((error) => {
      console.error("Error:", error);
    });
};
onMounted(() => {
  listenForNewMessagereply();
  const savedConversations = localStorage.getItem("conversationreply");
  if (savedConversations) {
    conversationreply.value = JSON.parse(savedConversations);
  }

  // ตรวจสอบว่ามี replyData ใน local storage หรือไม่ และกำหนดค่าให้กับ replyData ในกรณีที่มี
  const savedReplyData = localStorage.getItem("replyData");
  if (savedReplyData) {
    replyData.value = JSON.parse(savedReplyData);
  }
});

/* -------------------------------------------------------------------------------------------------------------------------- */






</script>

<template>
  <LayoutNurse class="bg-gradient-to-b from-blue-100">
    <!-- content -->
    <div class="container mx-auto">
      <div
        class="box-content-small p-3 ml-5 mr-5 mt-10 bg-gradient-to-b from-blue-900 to-blue-800 shadow-lg shadow-slate-500/50 rounded-lg"
      >
        <h2 class="font-semibold text-xl text-center text-slate-200">
          คุยกับผู้ป่วย
        </h2>
      </div>

      <!-- กล่องแชท -->
      <div
        class="box-content bg-white shadow-lg shadow-gray-300/50 mt-10 ml-5 mr-5 pt-5 pb-5 pl-10 pr-10 rounded-lg"
      >
        <div class="flex">
          <!-- Left -->
          <div class="w-1/3 border-r">
            <!-- Search -->
            <div class="bg-grey-lightest mr-6 mb-4   ">
              <input
                type="text"
                class="w-full px-2 py-2 text-sm   rounded-lg"
                placeholder="Search "
              />
            </div>



<!-- ตอบกลับข้อความ ฝั่งซ้าย -->
    <div>
    <div v-for="message in messages" :key="message.id" class="message-box box-content bg-white shadow-lg shadow-gray-300 mr-6 mb-4 p-4  rounded-lg" @click="selectMessage(message)">
      <div>
        <img class="rounded-full w-6 h-6" src="https://cdn-icons-png.flaticon.com/512/9131/9131529.png" />
      </div>

      <div>
           {{ message.user.fname }} {{ formatTime(message.createdAt) }}
      </div>
      <div>{{ message.iduser }}</div>
      <div>{{ message.message }}</div>
    </div>
  </div>
</div>


          <!-- ------------------------------------------------------------------------------------------------------------------------------------------------------------------ -->
          <!-- Right -->
          <div class="w-2/3">
          
 <!-- pop up แสดงข้อความตอบกลับกัน -->
  <div v-if="isOpen">
      <slot>
         
            <!-- Header -->
            <div class="py-2 px-3 bg-grey-lighter flex flex-row justify-between items-center">
               <div class="flex items-center">
                  <div>
                    <img class="rounded-full w-6 h-6" src="https://cdn-icons-png.flaticon.com/512/9131/9131529.png" />
                  </div>

                   <div class="ml-2 text-sm font-semibold ">{{ selectedMessage.user.fname }} {{selectedMessage.iduser}}</div>
               </div>
                 <button @click="closeChat" class="me-8 px-2 py-2 bg-blue-500 text-white rounded-md">ปิดแช็ต</button>
                
            </div>

          
              <!-- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- -->
            <!-- Messages -->
            <div class="flex-1 overflow-y-auto max-h-96 border-y">
              <div class="py-2 px-3">
                <div class="chat-container p-4 rounded-md border-gray-300">
                      <!-- เริ่มต้นแชท -->
                     <div class="text-xs text-gray-500">{{ formatTime(selectedMessage.createdAt ) }}</div>
  
                       <div class="flex items-center">
                         
                         <div class="bg-gray-100 rounded-lg p-2">
                            <span class="text-sm font-semibold"> {{selectedMessage.user.fname}} </span>
                          </div>

                          <div  class="ml-2 bg-blue-500 text-white rounded-lg p-2" >
                            <span class="text-sm">{{ selectedMessage.message }} {{selectedMessage.iduser}}</span>
                          </div>

                        </div>
                   
                    <!-- ------------------------------------------------------------------ -->
      

                  <template  v-for="(message, index) in  mergedMessages " :key="index" >
                    
                    <div v-if="message.user.type === 'admin'" class="message flex items-center justify-end mb-4" >
                      <div class="flex flex-col">
                        <div class="text-xs text-gray-500"> {{ formatTime(message.createdAt) }} </div>
                        
                        <div class="flex items-center justify-end">
                          <div class="mr-2 bg-blue-500 text-white rounded-lg p-2" >
                            <span class="text-sm">{{ message.text }}</span>
                          </div>

                          <div class="bg-gray-100 rounded-lg p-2">
                            <span class="text-sm font-semibold">{{ message.user.name}} {{message.idadmin}}</span>
                          </div>

                        </div>
                      </div>
                    </div>
                    
                     <div v-else class="message flex items-center justify-start mb-4" >
                      <div class="flex flex-col">
                        <div class="text-xs text-gray-500">  {{ formatTime(message.createdAt) }} </div>
                        
                        <div class="flex items-center">
                         
                         <div class="bg-gray-100 rounded-lg p-2">
                            <span class="text-sm font-semibold">{{ message.user.name}} {{message.iduser}}</span>
                          </div>

                          <div  class="ml-2 bg-blue-500 text-white rounded-lg p-2" >
                            <span class="text-sm">{{ message.text }}</span>
                          </div>
                        </div>       
                      </div>
                    </div>         
                  </template>
                  
                </div>
              </div>
            </div>

            <!-- Input  ตอบกลับ-->
             
          <div style="display: flex; align-items: center" class="mt-1 ml-2">
            <input
              type="text"
              v-model="messagereply"
              placeholder="พิมพ์ข้อความที่นี่..."
              class="block w-full p-2 text-gray-900 border-0 focus:ring-white focus:border-white"
            />

            <button @click="replyUser">
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
      </slot>
    
    </div>

 <!-- --------------------------------------------------------------------------------------------------------- -->

          </div>
        </div>
      </div>
      <!-- --------------------------------------------- -->
      <div class="mb-8 ml-2 mr-4 mt-10">
        <p class="text">**ขออภัย กำลังอยู่ในช่วงพัฒนา**</p>
      </div>
    </div>
  </LayoutNurse>
</template>

<style></style>
