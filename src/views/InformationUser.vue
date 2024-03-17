<script setup>
import { useRouter } from "vue-router";
import { ref, onBeforeMount, computed, onMounted, onUnmounted } from "vue";
import Layout from '../layouts/Layout.vue';
import moment from "moment";
import Swal from "sweetalert2";

const appRouter = useRouter();

const name = localStorage.getItem("name") + " " + localStorage.getItem("lname");
const fname = localStorage.getItem("name");
const lname = localStorage.getItem("lname");
const idcard = localStorage.getItem("idcard");
const dob = ref('-');
const age = ref('-');
const phone = ref('-');
const address = ref('123/2 ต.บ้านโป่ง อ.บ้านโป่ง จ.ราชบุรี 70110');

console.log(localStorage);

// ให้ปุ่มเปลี่ยนสี
const isButtonClicked = ref(false);

const handleButtonClick = () => {
   // Toggle the state when the button is clicked
   isButtonClicked.value = !isButtonClicked.value;
};


</script>

<template>
   <div class="bg-gradient-to-b from-blue-100">
      <Layout>
         <!-- content -->
         <div class="container mx-auto my-auto ">
            <div
               class="box-content p-3  ml-5 mr-5 mt-10 bg-gradient-to-b from-blue-900 to-blue-800  shadow-lg shadow-slate-500/50  rounded-lg">
               <h2 class="font-semibold text-xl text-center text-slate-200 ">ข้อมูลส่วนบุคคล</h2>
            </div>



            <!-- component -->
            <section
               class="bg-white dark:bg-gray-900 box-conten shadow-lg shadow-gray-300/50 mt-10 ml-5 mr-5 pt-6 pb-6 pl-6 pr-6  mb-10  rounded-lg ">
               <div class="flex justify-center min-h-screen">
                  <div class="hidden bg-cover lg:block lg:w-2/5 mt-10">
                     <img src="/user2.png" class="max-w-60 mx-auto">
                  </div>

                  <div class="flex items-center w-full max-w-3xl p-8 mx-auto lg:px-12 lg:w-3/5">
                     <div class="w-full">
                        <h1 class="text-2xl font-semibold tracking-wider text-gray-800 capitalize dark:text-white">
                           <div class>{{ name }}</div>
                        </h1>

                        <!-- <p class="mt-4 text-gray-500 dark:text-gray-400">
                           Let’s get you all set up so you can verify your personal account and begin setting up your
                           profile.
                        </p> -->

                        <div class="mt-6">
                           <h1 class="text-gray-500 dark:text-gray-300">เลือกเพื่อดูข้อมูล</h1>

                           <div class="mt-3 md:flex md:items-center md:-mx-2">
                              <button
                                 class="flex justify-center w-full px-6 py-3 text-white bg-blue-500 rounded-md md:w-auto md:mx-2 focus:outline-none">
                                 <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                       d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                 </svg>

                                 <span class="mx-2">
                                    ข้อมูลส่วนบุคคล
                                 </span>
                              </button>

                              <router-link :to="{ name: 'healthUser' }">
                              <button 
                                 @click="handleButtonClick" 
                                 :class="{ 'bg-blue-500 text-white': isButtonClicked }"
                                 class="flex justify-center w-full px-6 py-3 mt-4 text-blue-500 border border-blue-500 rounded-md md:mt-0 md:w-auto md:mx-2 dark:border-blue-400 dark:text-blue-400 focus:outline-none">
                                 <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                       d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                 </svg>

                                 <span class="mx-2">
                                    ข้อมูลสุขภาพ
                                 </span>
                              </button>
                           </router-link>
                           </div>
                        </div>

                        <form class="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2">
                           <div>
                              <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">ชื่อจริง</label>
                              <div type="text"
                                 class="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40">
                                 {{ fname }}
                              </div>

                           </div>

                           <div>
                              <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">นามสกุล</label>
                              <div type="text"
                                 class="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40">
                                 {{ lname }}
                              </div>

                           </div>

                           <div>
                              <label
                                 class="block mb-2 text-sm text-gray-600 dark:text-gray-200">เลขบัตรประจำตัวประชาชน</label>
                              <div type="text"
                                 class="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40">
                                 {{ idcard }}
                              </div>
                           </div>

                           <div>
                              <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">วันเกิด</label>
                              <div type="text"
                                 class="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40">
                                 {{ dob }}
                              </div>
                           </div>
                           <div>
                              <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">อายุ</label>
                              <div type="text"
                                 class="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40">
                                 {{ age }}
                              </div>
                           </div>
                           <div>
                              <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">เบอร์โทร</label>
                              <div type="text"
                                 class="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40">
                                 {{ phone }}
                              </div>
                           </div>
                           <div>
                              <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">ที่อยู่</label>
                              <div type="text"
                                 class="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40">
                                 {{ address }}
                              </div>
                           </div>





                        </form>
                        <button
                           class="flex items-center justify-between w-full mt-10 px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                           <span>แก้ไขข้อมูลส่วนบุคคล</span>

                           <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 rtl:-scale-x-100" viewBox="0 0 20 20"
                              fill="currentColor">
                              <path fill-rule="evenodd"
                                 d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                 clip-rule="evenodd" />
                           </svg>
                        </button>
                     </div>
                  </div>
               </div>
            </section>




         </div>


      </Layout>
   </div>
</template>

<style></style>