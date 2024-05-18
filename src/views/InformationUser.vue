<script setup>
import { useRouter } from "vue-router";
import { ref, onBeforeMount, computed, onMounted, onUnmounted, watch } from "vue";
import Layout from '../layouts/Layout.vue';
import moment from "moment";
import Swal from "sweetalert2";

const appRouter = useRouter();

/* date-time */
const selectedDate = ref('');

const fullname = localStorage.getItem("fname") + " " + localStorage.getItem("lname");
const fname = localStorage.getItem("fname");
const lname = localStorage.getItem("lname");
const idcard = localStorage.getItem("idcard");
const dob = localStorage.getItem("dob");
const phone = localStorage.getItem("phone");
const address = localStorage.getItem("address");
const status = localStorage.getItem("status");


// เรียกข้อมูล
const originalData = ref([]);
const result = ref([]);

const myinfo = ref({
   fname: '',
   lname: '',
   idcard: '',
   dob: '',
   phone: '',
   address: ''

});



/* --------------------------------------------------------------------------------------------------- */
const MyInfo = async () => {
   try {
      const userId = localStorage.getItem('iduser');
      if (userId) {
         const response = await
            fetch(`${import.meta.env.VITE_BASE_URL}api/patient/getProfile/${userId}`);
         if (response.ok) {
            const data = await response.json();
            localStorage.setItem("fname", data.fname);
            localStorage.setItem("lname", data.lname);
            localStorage.setItem("idcard", data.idcard);
            localStorage.setItem("dob", data.dob);
            localStorage.setItem("phone", data.phone);
            localStorage.setItem("address", data.address);
            localStorage.setItem("status", data.status);
            result.value = data;
            // console.log(result.value.dob);
            // console.log(result.value.phone);
            // console.log(result.value.address);
            // console.log(result.value.status);
         } else if (response.status === 404) {
            // Handle case when no data is found
            console.log('No data found');
            result.value = [];
         } else {
            throw new Error('Failed to fetch data');
         }
      } else {
         console.log('No user ID found in LocalStorage');
      }
   } catch (error) {
      console.error('Error fetching data:', error);
   }
};

onMounted(MyInfo);
/* --------------------------------------------------------------------------------------------------- */

const updateinfouser = async () => {
   try {
      const userId = localStorage.getItem('iduser');
      const editinfo = `${import.meta.env.VITE_BASE_URL}api/patient/updateProfile/${userId}`;

      // Display confirmation dialog using Swal
      const confirmationResult = await Swal.fire({
         title: "ยืนยันการแก้ไข",
         text: "คุณต้องการที่จะแก้ไขข้อมูล",
         icon: "warning",
         confirmButtonText: "ยืนยัน",
         cancelButtonText: "ยกเลิก",
         showCancelButton: true,
         showCloseButton: true
      });

      if (confirmationResult.isConfirmed) {
         const response = await fetch(editinfo, {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(myinfo.value),
         });

         if (response.ok) {
            await MyInfo();
         } else {
            throw new Error("Failed to delete");
         }
      }
   } catch (error) {
      console.error("Error deleting data:", error);
   }
   window.location.reload(); // Reload the browser after successfully updating the information
   closeModal();
}


// ให้ปุ่มเปลี่ยนสี
const isButtonClicked = ref(false);

const handleButtonClick = () => {
   // Toggle the state when the button is clicked
   isButtonClicked.value = !isButtonClicked.value;
};

const filterByDaily = (data, selectedDate) => {
   if (selectedDate) {
      return data.filter(record => {
         const recordDate = moment(record.updated_at).format('YYYY-MM-DD');
         return moment(recordDate).isSame(selectedDate, 'day');
      });
   } else {
      return data;
   }
};

const filterDataByDate = () => {
   result.value = filterByDaily(originalData.value, selectedDate.value);
};

watch(selectedDate, (newSelectedDate) => {
   result.value = filterByDaily(originalData.value, newSelectedDate);
});

const getCurrentDate = () => {
   return moment().format('YYYY-MM-DD');
};

/* --------------------------------------------------------------------------------------------------- */
/* model popup */
const isModalOpen = ref(false);

const openModal = () => {
   isModalOpen.value = true;
};

const closeModal = () => {
   isModalOpen.value = false;
};

const editinfo = () => {
   myinfo.value.fname = fname;
   myinfo.value.lname = lname;
   myinfo.value.idcard = idcard;
   myinfo.value.dob = dob;
   myinfo.value.phone = phone;
   myinfo.value.address = address;
   openModal();
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
                  <div class="flex flex-col bg-cover lg:block lg:w-2/5 mt-10">
                     <div>
                        <img src="/user2.png" class="max-w-60 mx-auto">
                     </div>
                     <div class="max-w-60 mx-auto">
                        <div class="flex justify-center mt-10">
                           <p class="text-md text-center text-gray-600 dark:text-gray-200">สถานะการรับบริการ:</p>
                           <img src="/correct.png" v-if="status == 1" class="w-6 h-6 ml-2" />
                           <img src="/cross.png" v-else class="w-6 h-6 ml-2" />
                        </div>
                     </div>


                  </div>

                  <div class="flex items-center w-full max-w-3xl p-8 mx-auto lg:px-12 lg:w-3/5">
                     <div class="w-full">
                        <h1 class="text-2xl font-semibold tracking-wider text-gray-800 capitalize dark:text-white">
                           <div>{{ fullname }}
                           </div>
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
                                 <button @click="handleButtonClick"
                                    :class="{ 'bg-blue-500 text-white': isButtonClicked }"
                                    class="flex justify-center w-full px-6 py-3 mt-4 text-blue-500 border border-blue-500 rounded-md md:mt-0 md:w-auto md:mx-2 dark:border-blue-400 dark:text-blue-400 focus:outline-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none"
                                       viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
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
                              <div v-if="dob != null" type="text"
                                 class="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40">
                                 {{ dob }}
                              </div>
                              <div v-else> - </div>
                           </div>

                           <div>
                              <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">เบอร์โทร</label>
                              <div v-if="phone != null" type="text"
                                 class="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40">
                                 {{ phone }}
                              </div>
                              <div v-else> - </div>
                           </div>
                           <div>
                              <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">ที่อยู่</label>
                              <div v-if="address != null" type="text"
                                 class="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40">
                                 {{ address }}
                              </div>
                              <div v-else> - </div>
                           </div>





                        </form>
                        <button type="button"
                           class="flex items-center justify-between w-full mt-10 px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                           @click="editinfo">
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

            <!-- ------------------------------------------------------------------------------------------ -->
            <!-- modal popup -->
            <div>
               <!-- Modal -->
               <div v-if="isModalOpen" class="absolute inset-0 z-10 flex items-center justify-center lg:mt-60 mt-20">
                  <div class="fixed inset-0 bg-black opacity-50"></div>
                  <div class="bg-white p-8 rounded shadow-md z-20">
                     <h2 class="text-xl font-bold mb-4 text-center">แก้ไขข้อมูลส่วนตัว</h2>
                     <div class="card-body">
                        <form @submit.prevent="updateinfouser">


                           <div class="box-content  pt-3 pb-3  ">
                              <p>ชื่อจริง</p>
                              <div class="box-content ">
                                 <input type="text" v-model="myinfo.fname"
                                    class="block w-full rounded-md border-0 py-2 pl-6 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400">
                              </div>
                           </div>

                           <div class="box-content  pt-3 pb-3  ">
                              <p>นามสกุล</p>
                              <div class="box-content ">
                                 <input type="text" v-model="myinfo.lname"
                                    class="block w-full rounded-md border-0 py-2 pl-6 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400">
                              </div>
                           </div>


                           <div class="box-content  pt-3 pb-3  ">
                              <p>เลขบัตรประจำตัวประชาชน</p>
                              <div class="box-content ">
                                 <input type="text" v-model="myinfo.idcard" maxlength="13"
                                    class="block w-full rounded-md border-0 py-2 pl-6 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400">
                              </div>
                           </div>

                           <div class="box-content pt-3 pb-3">
                              <p>วันเกิด</p>
                              <div class="box-content">
                                 <label for="selectedDate" class="text-md text-gray-800">เลือกวันที่: </label>
                                 <input type="date" id="selectedDate" v-model="myinfo.dob" @change="filterDataByDate"
                                    :max="getCurrentDate()" class="mt-2 px-4 py-2 border rounded-md">
                              </div>
                           </div>

                           <div class="box-content pt-3 pb-3">
                              <p>เบอร์โทรศัพท์</p>
                              <input type="text" v-model="myinfo.phone" maxlength="10"
                                 class="block w-full rounded-md border-0 py-2 pl-6 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400"
                                 placeholder="เช่น 0800000000" />
                           </div>



                           <div class="box-content pt-3 pb-3 ">
                              <p>ที่อยู่</p>
                              <div class="box-content">
                                 <input type="text" v-model="myinfo.address" placeholder="กรอกที่อยู่ปัจจุบัน"
                                    class="block w-full rounded-md border-0 py-2 pl-6 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400">
                              </div>
                           </div>

                           <div class="flex items-center justify-center">
                              <button type="submit"
                                 class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mt-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                 บันทึกการแก้ไข
                              </button>
                              <button @click="closeModal"
                                 class="focus:outline-none text-white bg-yellow-300 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mt-2 dark:focus:ring-yellow-900">
                                 ยกเลิก
                              </button>
                           </div>
                        </form>
                     </div>

                  </div>
               </div>
            </div>


         </div>


      </Layout>
   </div>
</template>

<style>
.grid-container {

   height: 100vh;
   /* ทำให้ container มีความสูงเต็มหน้าจอ */
}
</style>