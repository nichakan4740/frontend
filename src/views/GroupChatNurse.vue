<script setup>
import { ref, onMounted } from "vue";
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

/* การตอบกลับข้อความ------------------------------------------------------------------ */

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
        type: 'user',
        name: data.fname,

      },
      createdAt: new Date(),
      text: data.text,
      iduser: data.id,
      idadmin: data.admin_ids[0],
    };
    mergedMessages.value.push(message);
    localStorage.setItem("chatMessagesfromuser", JSON.stringify(mergedMessages.value));
    localStorage.setItem("idadmin", data.admin_ids[0]);
  }
});

const channelSendofAdmin = pusher.subscribe("replyUser");
channelSendofAdmin.bind("message", (data) => {
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
    mergedMessages.value.push(message);
    localStorage.setItem("chatMessagesfromuser", JSON.stringify(mergedMessages.value));
    localStorage.setItem("idadmin", data.admin_ids[0]);
  }
});


onMounted(() => {
  const storedMessagesUser = localStorage.getItem("chatMessagesfromuser"); 
  if (storedMessagesUser) {
    mergedMessages.value = JSON.parse(storedMessagesUser); 
  }
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

        // เพิ่มบันทึกค่า replyData ลงใน localStorage เมื่อได้รับข้อมูลตอบกลับใหม่
        localStorage.setItem("replyData", JSON.stringify(replyData.value));
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
    <div class="container mx-auto ">
      <div class="box-content-small p-3 ml-5 mr-5 mt-10 bg-gradient-to-b from-blue-900 to-blue-800 shadow-lg shadow-slate-500/50 rounded-lg" >
        <h2 class="font-semibold text-xl text-center text-slate-200">
          คุยกับผู้ป่วย
        </h2>
      </div>

      <!-- กล่องแชท -->
      <div class="box-content bg-white shadow-lg shadow-gray-300/50 mt-10 ml-5 mr-5 pt-1 pb-6 pl-20 pr-20 mb-5 rounded-lg">
   














   
        <div >
         

        

<!-- ----- กล่องข้อความ ------------------------------------------------------------- -->


          <!-- เพิ่มส่วนนี้เพื่อแสดงผลข้อความที่ส่งไป -->
          <div v-if="replyData">
            <p>ตอบกลับ: {{ replyData.message }}</p>
          </div>
          <!-- -------------------------------------------- -->

    <!-- UI chat  -->
    <!-- component -->
                <div class="flex">

                    <!-- Left -->
                    <div class="w-1/3 border-r-2">

                        <!-- Search -->
                        <div class="py-2 px-2 bg-grey-lightest">
                            <input type="text" class="w-full px-2 py-2 text-sm" placeholder="Search or start new chat"/>
                        </div>

                            <!-- ขอความที่ทักเข้ามาตอนแรก --> 
                           <div v-for="message in messages" :key="message.id" class="ml-4 border-b border-grey-lighter py-4">
                            <div>
                                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                                   <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clip-rule="evenodd" />
                                   </svg>
                            </div>

                            <div>{{ message.user.fname }} {{ formatTime(message.createdAt) }}</div>         
                            <div>{{ message.iduser }}</div>       
                             <div>{{ message.message }}</div>
                          </div>  
                      </div>                                   
<!-- ------------------------------------------------------------------------------------------------------------------------------------ -->         
                 

<!-- ------------------------------------------------------------------------------------------------------------------------------------------------------------------ -->
                    <!-- Right -->
                    <div class="w-2/3">

                        <!-- Header -->
                        <div class="py-2 px-3 bg-grey-lighter flex flex-row justify-between items-center">
                           <div class="flex items-center">
                                <div>
                                    <img class="w-10 h-10 rounded-full" src="https://darrenjameseeley.files.wordpress.com/2014/09/expendables3.jpeg"/>
                                </div>
                                <div class="ml-4">

                                    <p class="text-grey-darkest"> New Movie! Expendables 4 </p>
                                   
                                </div>
                            </div>
                   <!-- ----------------------------------------------- -->
                            <div class="flex">    
                             <!-- รายละเอียด --> 
                            </div>


                        </div>



                        <!-- Messages -->
                        <div class="flex-1 overflow-y-auto max-h-96">
                            <div class="py-2 px-3">                                              
  <div class="chat-container p-4  rounded-md border-gray-300 ">
  <template v-for="(message, index) in mergedMessages" :key="index">
    <div v-if="message.user.type === 'admin'" class="message flex items-center justify-end mb-4">
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
    <div v-else class="message flex items-center justify-start mb-4">
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
  </template>
</div>

                            </div>
                        </div>


                        <!-- Input  ตอบกลับ-->
                        <div class="bg-grey-lighter px-4 py-4 flex items-center">
                           
                            <div class="flex-1 mx-4">
                                <input class="w-full border rounded px-2 py-2" type="text"/>
                            </div>
                        </div>
                    </div>
<!-- --------------------------------------------------------------------------------------------------------- -->
               </div>
       
 

















        </div>
      </div>
      <!-- --------------------------------------------- -->
















      <div class="mb-8 ml-2 mr-4">
        <input
          type="text"
          v-model="messagereply"
          placeholder="พิมพ์ข้อความตอบกลับ"
        />
        <button @click="replyUser">ส่ง</button>
      </div>

      <!-- -------------------------------------------- -->
      <div class="mb-8 ml-2 mr-4">
        <p class="text">**ขออภัย กำลังอยู่ในช่วงพัฒนา**</p>
      </div>
    </div>




  </LayoutNurse>
</template>

<style></style>
