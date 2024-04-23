<script setup>
import { ref, onMounted } from "vue";
import LayoutNurse from "../layouts/LayoutNurse.vue";
import moment from "moment";
import Swal from "sweetalert2";
import Pusher from "pusher-js";


/* แสดงข้อความที่ user ส่งมาให้ตอนต้น */
const messages = ref([]);
const adminId = localStorage.getItem('idadmin');
const channelName = `chat.admin${adminId}`;

onMounted(() => {
  const pusher = new Pusher('c38b6cfa9a4f7e26bf76', {
    cluster: 'ap1',
    encrypted: true
  });

  const channel = pusher.subscribe(channelName);

  // เพิ่มการโหลดข้อมูลเมื่อ component ถูกโหลด
  const storedMessages = localStorage.getItem('messages');
  if (storedMessages) {
    messages.value = JSON.parse(storedMessages);
  }

  channel.bind('message', (data) => {
    // รับข้อมูลที่ส่งมาจาก Pusher
    const receivedMessage = {
      message: data.message,
      admin_id: data.admin_id,
      user_id: data.user_id
    };
    // เพิ่มข้อมูลลงใน messages
    messages.value.push(receivedMessage);

    // บันทึก messages ลงใน Local Storage
    localStorage.setItem('messages', JSON.stringify(messages.value));
  });
});

/* ------------------------------------------------------------------------- */



</script>

<template>
  <LayoutNurse class="bg-gradient-to-b from-blue-100">
   

<!-- ----------------------------------------- -->
<div>
    <h2>Messages:</h2>
    <ul>
      <li v-for="(message, index) in messages" :key="index">
        {{ message.user_id }} // {{message.message}}
      </li>
    </ul>
  </div>
 
<!-- ------------------------------------------------- -->



















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
    <div  class="message-box box-content bg-white shadow-lg shadow-gray-300 mr-6 mb-4 p-4  rounded-lg">
      <div class="py-2 px-3 bg-grey-lighter flex flex-row items-center">
         <div>
        <img class="rounded-full w-6 h-6" src="https://cdn-icons-png.flaticon.com/512/9131/9131529.png" />
      </div>

      <div class="ml-4 text-sm font-semibold">  </div>

      </div>
      
      <div class="text-xs text-gray-500 ml-4">  </div>

      <div  class="ml-4 mt-2 bg-blue-500 text-white rounded-lg p-2 text-sm"></div>
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
            <div class="py-2 px-3 bg-grey-lighter flex flex-row items-center justify-between">
              <div class="flex items-center">
                <div>
                   <img class="rounded-full w-6 h-6" src="https://cdn-icons-png.flaticon.com/512/9131/9131529.png" />
                </div>
               <div class="ml-2 text-sm font-semibold"></div>
               </div>
                   <div>
                      <button  class="px-2 py-2 bg-blue-500 text-white rounded-md">ลบแช็ต</button>
                      <button  class="px-2 py-2 bg-blue-500 text-white rounded-md ml-2">ปิดแช็ต</button>
                    </div>
               </div>

          
              <!-- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- -->
            <!-- Messages -->
            <div class="flex-1 overflow-y-auto max-h-96 border-y">
              <div class="py-2 px-3">
                <div class="chat-container p-4 rounded-md border-gray-300">
                      <!-- เริ่มต้นแชท -->
                     <div class="text-xs text-gray-500"></div>
  
                       <div class="flex items-center">
                         
                         <div class="bg-gray-100 rounded-lg p-2">
                            <span class="text-sm font-semibold"> </span>
                          </div>

                          <div  class="ml-2 bg-blue-500 text-white rounded-lg p-2" >
                            <span class="text-sm"></span>
                          </div>

                        </div>
                   
                    <!-- ------------------------------------------------------------------ -->
      

                  <template >
                    
                    <div  class="message flex items-center justify-end mb-4" >
                      <div class="flex flex-col">
                        <div class="text-xs text-gray-500">  </div>
                        
                        <div class="flex items-center justify-end">
                          <div class="mr-2 bg-blue-500 text-white rounded-lg p-2" >
                            <span class="text-sm"></span>
                          </div>

                          <div class="bg-gray-100 rounded-lg p-2">
                            <span class="text-sm font-semibold"></span>
                          </div>

                        </div>
                      </div>
                    </div>
                    
                     <div class="message flex items-center justify-start mb-4" >
                      <div class="flex flex-col">
                        <div class="text-xs text-gray-500"> </div>
                        
                        <div class="flex items-center">
                         
                         <div class="bg-gray-100 rounded-lg p-2">
                            <span class="text-sm font-semibold"></span>
                          </div>

                          <div  class="ml-2 bg-blue-500 text-white rounded-lg p-2" >
                            <span class="text-sm"></span>
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