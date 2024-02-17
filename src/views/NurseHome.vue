<script setup>
import { useRouter } from "vue-router";
import { ref, onBeforeMount, computed,onMounted, onUnmounted } from "vue";
import LayoutNurse from '../layouts/LayoutNurse.vue';
import moment from "moment";
import Swal from "sweetalert2";


// Function to format current time
const currentTime = computed(() => moment().format('YYYY-MM-DD HH:mm:ss'));

// Function to logout nurse
const router = useRouter();
const appRouter = useRouter();
const logout = () => {
  localStorage.removeItem('professional_id');
  localStorage.removeItem('accesstoken');
  localStorage.removeItem('idadmin');
  localStorage.removeItem('name');
  backloginnurse();
};
const backloginnurse = () => appRouter.push({ name: "homerole" });

/* -------------------------------------------------------------------------------- */
// แสดงข้อมูลผู้ป่วย
const getPatient = async () => {
  try {
    const accessToken = localStorage.getItem('accesstoken');
    if (!accessToken) {
      throw new Error('Access token not found');
    }
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}api/patient/getProfile`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch patient profile');
    }
    const patientData = await response.json();
    return patientData;
  } catch (error) {
    console.error('Error fetching patient profile:', error.message);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to fetch patient profile. Please try again later.',
    });
    return null;
  }
};
// Fetch patient profile when component is mounted
const patientProfile = ref(null);
onMounted(async () => {
  patientProfile.value = await getPatient();
});
onUnmounted(() => {
});
/* -------------------------------------------------------------------------------------------------------- */
const MysugarLoad = async () => {
  try {
    // Accessing patientProfile.value to get the user object
    const userId = 1; 

    const response = await fetch(`${import.meta.env.VITE_BASE_URL}api/mysugar/${userId}`);
    if (response.ok) {
      const data = await response.json();
      originalData.value = data;
      result.value = originalData.value; 
    } else if (response.status === 404) {
      // Handle case when no data is found
      console.log('No data found');
      result.value = []; 
    } else {
      throw new Error('Failed to fetch data');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

onMounted(MysugarLoad);
const originalData = ref([]);
const result = ref([]);
/* ------------------------------------------------------------------------------------------------------------ */



/* ------------------------------------------------------------------------------------------------------- */
// พยาบาลเพิ่มข้อมูลผู้ป่วย
const fname = ref("");
const lname = ref("");
const allergic_drug = ref("");
const my_drug = ref("");
const idcard = ref("");
const password = ref("telenursing");
const adduser = async () => {
  const res = await fetch(
    `${import.meta.env.VITE_BASE_URL}api/patient/register`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        fname: fname.value,
        lname: lname.value,
        allergic_drug: allergic_drug.value,
        my_drug: my_drug.value,
        idcard: idcard.value,
        password: password.value,
      }),
    }
  );
  if (res.status === 200) {
    Swal.fire("คุณสร้างบัญชีสำเร็จ!");
    setTimeout(function () {
      close();
    }, 1500);
    console.log("You add user success");
    // เพิ่มบัญชีผู้ใช้งานสำเร็จแล้ว ทำการดึงข้อมูลผู้ป่วยอีกครั้งโดยไม่ต้องรีโหลดหน้าเว็บ
    patientProfile.value = await getPatient();
  } else {
    console.log("error,cannot add");
    Swal.fire({
      icon: "error",
      title: "ขอโทษ !!!",
      text: "ไม่สามารถสร้างบัญชีได้ โปรดตรวจสอบความถูกต้อง!",
    });
  }
};


/* model- popup --------------------------------------------------------------------------------------------- */
const isModalOpen = ref(false);
const openModal = () => {
  isModalOpen.value = true;
};
const closeModal = () => {
  isModalOpen.value = false;
};

</script>
<template>
 <LayoutNurse class="bg-gradient-to-b from-blue-100">
    <!-- content -->

    <div class="container mx-auto">
       <div  class="box-content p-3  ml-5 mr-5 mt-10 bg-gradient-to-b from-blue-900 to-blue-800  shadow-lg shadow-slate-500/50  rounded-lg">
            <h2 class="font-semibold text-xl text-center text-slate-200 ">หน้าหลัก</h2>
       </div>
    
 
    <!-- boxcontent -->
    <div class="grid grid-cols-2 gap-2  mt-5  ">
     <div class="box-content"></div>
 
 
     <div class="box-content p-8 bg-white shadow-lg shadow-gray-300/50 mt-8 ml-5 mr-5  rounded-lg  ">
     <p>เวลาปัจจุบัน: {{ currentTime }}</p>
     </div>
     </div>
        <!-- ----------------------------------------------------------------------------------------------------------------------------- -->


        <!-- boxcontent แสดงรายละเอียด --------------------------------------------------------------------- -->
         <div class="box-content p-8 bg-white shadow-lg shadow-gray-300/50 mt-8 ml-5 mr-5 mb-10 rounded-lg">
        <h2 class="text-center text-2xl font-bold mb-5">รายละเอียดค่าน้ำตาลช่วง</h2>
        
    <!-- --------------------------------------------------------------------------------------------------------------------------- -->  
   <table class="min-w-full text-left text-sm font-light">
          <thead class="border-b font-medium dark:border-neutral-500">
            <tr >
              <th scope="col" class="px-6 py-4">รายชื่อ</th>
              <th scope="col" class="px-6 py-4 ">สถานะ</th>
              <th scope="col" class="px-6 py-4"> ตรวจล่าสุด </th>
              <th scope="col" class="px-6 py-4">(mg/dl)</th>
               <th scope="col" class="px-6 py-4">พูดคุย</th>
              <th scope="col" class="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody>
              <tr class="border-b dark:border-neutral-500" v-for="user in patientProfile" :key="user.id" >
              <td class="whitespace-nowrap px-6 py-4">{{ user.fname }} {{ user.lname }}</td>
              <td class="whitespace-nowrap px-6 py-4">{{ user.id }}</td>
              <td class="whitespace-nowrap px-6 py-4"></td>
              <!-- ------------------------------------------------------------------------------------------ -->
            </tr>
          </tbody>
        </table>

<br>
 <!-- เมื่อคลิกที่ปุ่มนี้โมดัลจะปรากฎ-------------------------------------------------------------------------------------- -->
  <button @click="openModal" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
    เพิ่มรายชื่อผู้ป่วย
  </button>

  <!-- โมดัล -->
  <div v-if="isModalOpen" class="fixed z-10 inset-0 overflow-y-auto">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- ส่วนทับเงื่อนไข -->
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>
      <!-- เฉพาะส่วนแสดงตามเงื่อนไข -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      
      <!-- ส่วนหลักของโมดัล -->
      <div v-if="isModalOpen" class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
         
          <!-- เนื้อหาของโมดัล --------------------------------------------------------------- -->
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
      <div class="w-full rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 bg-white">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1  class="text-xl font-bold text-center leading-tight tracking-tight text-gray-900 md:text-2xl">
                เพิ่มรายชื่อผู้ป่วย
              </h1>
              <form class="space-y-4 md:space-y-6" >

 <!-- --------------------------------------------------------------------------- -->
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-900">ชื่อ &nbsp;
                <span style="font-size: 10px; color: rgb(177, 109, 241)">
                  ( ตัวอักษรต้องไม่เกิน 100 ตัวอักษร )
                </span>
              </label>
              <input
                type="text"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="xxxxxxxxxx"
                v-model.trim="fname"
                maxlength="100"
              />
              <p v-if="fname.length" class="input-count"> {{ fname.length }}/100</p>
              <p v-show="fname.length < 1">* Please input your name <span></span></p>
              <p v-show="fname.length > 100">* Characters must not exceed 100</p>
            </div>
  <!-- --------------------------------------------------------------------------- -->
              <div>
              <label class="block mb-2 text-sm font-medium text-gray-900">นามสกุล &nbsp;
                <span style="font-size: 10px; color: rgb(177, 109, 241)">
                  ( ตัวอักษรต้องไม่เกิน 100 ตัวอักษร )
                </span>
              </label>
              <input
                type="text"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="xxxxxxxxxx"
                v-model.trim="lname"
                maxlength="100"
              />
              <p v-if="lname.length" class="input-count"> {{ lname.length }}/100 </p>
              <p v-show="lname.length < 1"> * Please input your name <span></span></p>
              <p v-show="lname.length > 100">* Characters must not exceed 100</p>
            </div>
  <!-- --------------------------------------------------------------------------- -->

            <div>
              <label class="block mb-2 text-sm font-medium text-gray-900">ยาที่แพ้ &nbsp;
                <span style="font-size: 10px; color: rgb(177, 109, 241)">
                  ( ตัวอักษรต้องไม่เกิน 100 ตัวอักษร )
                </span>
              </label>
              <input
                type="text"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="xxxxxxxxxx"
                v-model.trim="allergic_drug"
                maxlength="100"
              />
              <p v-if="allergic_drug.length" class="input-count">{{ allergic_drug.length }}/100</p>
              <p v-show="allergic_drug.length < 1"> * Please input your name <span></span></p>
              <p v-show="allergic_drug.length > 100">* Characters must not exceed 100</p>
            </div>
  <!-- --------------------------------------------------------------------------- -->



             <div>
              <label class="block mb-2 text-sm font-medium text-gray-900">ยาประจำตัวที่ใช้ &nbsp;
                <span style="font-size: 10px; color: rgb(177, 109, 241)">
                  ( ตัวอักษรต้องไม่เกิน 100 ตัวอักษร )
                </span>
              </label>
              <input
                type="text"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="xxxxxxxxxx"
                v-model.trim=" my_drug"
                maxlength="100"
              />
              <p v-if=" my_drug.length" class="input-count">{{ my_drug.length }}/100 </p>
              <p v-show="my_drug.length < 1"> * Please input your name <span></span> </p>
              <p v-show="my_drug.length > 100">* Characters must not exceed 100</p>
            </div>
  <!-- --------------------------------------------------------------------------- -->



            <div>
              <label class="block mb-2 text-sm font-medium text-gray-900">เลขบัตรประจำตัวประชาชน</label>
              <input
                type="text"
                v-model.trim="idcard"
                placeholder="xxxxxxxx"
                maxlength="13"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              <p v-if="idcard .length" class="input-count"> {{ idcard .length }}/13</p>
              <p v-show="idcard .length < 1">  * Please input your id_card <span></span></p>
              <p v-show="idcard .length > 13"> * Characters must not exceed 13</p>
            </div>
  <!-- --------------------------------------------------------------------------- -->



            <div>
              <label class="block mb-2 text-sm font-medium text-gray-900" >รหัสผ่าน</label>
              <input
                placeholder="xxxxxxxx"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="password"
                name="password"
                v-model.trim="password"
                maxlength="14"
                minlength="8"
              />
              <p v-if="password" class="input-count" id="count"> {{ password.length }}/14 </p>
              <p v-show="password.length < 8" id="checkname"> * Password must not be less than 8 characters</p>
              <p v-show="password.length > 14" id="checkname">* Password must not be more than 14 characters</p>
            </div>


          
                  <button
                   class="block w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 px-4 mb-4 border rounded"
                    @click.prevent="adduser"  
                   >   
                 สร้างบัญชี
                  </button>
              </form>
          </div>
      </div>
  </div>
          </div>

          <!-- ---------------------------------------------------------------------------------------------------- -->



           <!-- ปุ่มปิดโมดัล -->
          <div class="sm:flex sm:items-start">
            <button @click="closeModal" type="button" class="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-red-600 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm">
              ปิด
            </button>
          </div>
          <!-- ------------------------------------------------------------------------------------------------------------------------------- -->

        </div>
      </div>
    </div>
  </div>
</div>

       <!-- ------------------------------------------------------------------------------------ -->

    
        <table class="min-w-full text-left text-sm font-light">
          <thead class="border-b font-medium dark:border-neutral-500">
            <tr >
              <th scope="col" class="px-6 py-4">วันที่เปลี่ยนแปลงการบันทึก</th>
              <th scope="col" class="px-6 py-4 ">  ระดับน้ำตาลในเลือด  </th>
              <th scope="col" class="px-6 py-4"> อาการผิดปกติ </th>
              <th scope="col" class="px-6 py-4">อื่นๆ</th>
              <th scope="col" class="px-6 py-4"></th>
               <th scope="col" class="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody>
            <!-- <tr class="border-b dark:border-neutral-500" v-for="sugarRecord in result" :key="sugarRecord.id"> -->
            <tr  class="border-b dark:border-neutral-500" v-for="sugarRecord in result" :key="sugarRecord.id" >
              <td class="whitespace-nowrap px-6 py-4"> {{moment(sugarRecord.updated_at).format("DD MMM YYYY: HH:mm" )}}
              </td>
                </tr>
          </tbody>
        </table>












    </div>   

  </LayoutNurse>
</template>
 
<style>

</style>