<script setup>
import { useRouter } from "vue-router";
import { ref, onBeforeMount, computed, onMounted, watch, onUnmounted } from "vue";
import LayoutNurse from '../layouts/LayoutNurse.vue';
import Spinner from "../Authentication/Spinner.vue";
import moment from "moment";
import Swal from "sweetalert2";


// Function to format current time
const currentTime = computed(() => moment().format('YYYY-MM-DD HH:mm:ss'));
const startDate = ref('');
const endDate = ref('');
const loading = ref(false);

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
/* -------------------------------------------------------------------------------------------------------- */
/* ดึงข้อมูลล่าสุด */
const filterLatestSugarRecords = (data) => {
  // Group sugar records by user id
  const groupedData = data.reduce((acc, record) => {
    if (!acc[record.user_id] || moment(acc[record.user_id].updated_at) < moment(record.updated_at)) {
      acc[record.user_id] = record;
    }
    return acc;
  }, {});

  // Convert grouped data object back to array
  const filteredData = Object.values(groupedData);
  return filteredData;
};
const MysugarLoad = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}api/mysugar`);
    if (response.ok) {
      const data = await response.json();
      console.log(data)
      // Filter the data to keep only the latest sugar records for each user
      if(data.message !== "ไม่มีข้อมูล"){
        // Update the result ref with the filtered data
        result.value = filterLatestSugarRecords(data);;
        console.log(result.value)
      }
      
      // await AllUserLoad()
    } else if (response.status === 404) {
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
// เพิ่มผู้ป่วย ----------------------------------------
const fname = ref("");
const lname = ref("");
const idcard = ref("");
const password = ref("");
const passwordcheck = ref("");
const dob = ref("");
const phone = ref("");
const address = ref("");
const status = ref(true);

const passwordInput = ref(null);
const passwordCheckInput = ref(null);

const registerpatient = async () => {
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
        idcard: idcard.value,
        password: password.value,
        dob: dob.value,
        phone: phone.value,
        address: address.value,
        status: status.value,

      }),
    }
  );
  if (res.status === 200) {
    Swal.fire("คุณสร้างบัญชีสำเร็จ!");
    setTimeout(function () {
      close();
    }, 1500);
    console.log("You add user success");

  } else {
    console.log("error,cannot add");
    Swal.fire({
      icon: "error",
      title: "เกิดข้อผิดพลาด !!!",
      text: "ไม่สามารถสร้างบัญชีได้ โปรดตรวจสอบความถูกต้อง!",
    });
  }
  closeModal()
};

const checkmatch = () => {
  const pass = password.value;
  const passcheck = passwordcheck.value;
  if (passwordInput.value && passwordCheckInput.value) {
    if (pass === passcheck) {
      passwordInput.value.style.backgroundColor = "#e9f7e3";
      passwordCheckInput.value.style.backgroundColor = "#e9f7e3";
    } else {
      passwordInput.value.style.backgroundColor = "#fae2e0";
      passwordCheckInput.value.style.backgroundColor = "#fae2e0";
    }
  }
};

const checkinputpassword = () => {
  const pass = password.value;
  const passcheck = passwordcheck.value;
  if (pass.length === 0) {
    password.value = null;
    passwordcheck.value = null;
    Swal.fire("โปรดใส่รหัสผ่าน");
  }
  if (pass.length < 8) {
    password.value = null;
    passwordcheck.value = null;
    Swal.fire("รหัสผ่านต้องมีความยาวมากกว่า 8 ตัวอักษร");
  }
  if (passcheck !== pass) {
    password.value = null;
    passwordcheck.value = null;
    Swal.fire("รหัสผ่านไม่ตรงกัน");
  }
};

const checkinputidcard = () => {
  const idc = idcard.value;
  const isNumeric = /^\d+$/.test(idc);
  if (idc) {
    if (idc.length === 0) {
      idcard.value = null;
      Swal.fire("โปรดใส่เลขบัตรประชาชน");
    }
    if (idc.length < 13) {
      idcard.value = null;
      Swal.fire("เลขบัตรประชาชนต้องมี 13 หลัก");
    } else if (!isNumeric) {
      idcard.value = null;
      Swal.fire("เลขบัตรประชาชนต้องเป็นตัวเลขเท่านั้น");
    }

  }

};





// นับจำนวน user
const totalUsers = computed(() => result.value.length);

/* model- popup --------------------------------------------------------------------------------------------- */
const isModalOpen = ref(false);
const openModal = () => {
  isModalOpen.value = true;
};
const closeModal = () => {
  isModalOpen.value = false;
};
/* ------------------------------------------------------------------------------------------------------------ */


// Search function
const searchInput = ref('');
const filteredResult = computed(() => {
  const query = searchInput.value.toLowerCase();
  return result.value.filter(record => {
    const thaiName = `${record.user.fname} ${record.user.lname}`;
    const englishName = `${record.user.fname_en} ${record.user.lname_en}`;
    return thaiName.toLowerCase().includes(query) || englishName.toLowerCase().includes(query);
  });
});

// Function to reset search input
const resetSearch = () => {
  searchInput.value = '';
};


// modal user

const patientHistory = ref([]);
const originalPatientHistory = ref([]);
/* ------ filter------------------------------------------------------------------------------------------ */
const filterBySelectedDate = (data, startDate, endDate) => {
  if (startDate && endDate) {
    const filteredData = data.filter(record => {
      const recordDate = moment(record.updated_at).format('YYYY-MM-DD');
      return moment(recordDate).isBetween(startDate, endDate, 'days', '[]');
    });
    return filteredData;
  } else {
    return data;
  }
};
watch(
  [startDate, endDate],
  ([newStartDate, newEndDate], [oldStartDate, oldEndDate]) => {
    if (newStartDate !== oldStartDate || newEndDate !== oldEndDate) {
      if (newStartDate && newEndDate) {
        patientHistory.value = filterBySelectedDate(
          originalPatientHistory.value,
          newStartDate,
          newEndDate
        );
      } else {
        patientHistory.value = originalPatientHistory.value;
      }
    }
  },
  { deep: true }
);

const isModalPatientOpen = ref(false);
const titleModalPatient = ref('');
const openModalPatient = async (patientId, fname, lname) => {
  patientHistory.value = [];
  titleModalPatient.value = '';
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}api/mysugar/${patientId}`);
  if (response.ok) {
    const data = await response.json();

    if (data.length != 0) {
      titleModalPatient.value = `${fname} ${lname}`
      patientHistory.value = data;
      console.log(patientHistory.value)
      originalPatientHistory.value = data.slice(); // ตั้งค่าค่าเริ่มต้นของ originalPatientHistory เป็นข้อมูล patientHistory
      isModalPatientOpen.value = true;
    } else {
      Swal.fire("ไม่พบข้อมูล");
    }
  } else if (response.status === 404) {
    // Handle case when no data is found
    result.value = [];
  } else {
    throw new Error('Failed to fetch data');
  }
};


// และในฟังก์ชัน closePatientModal หลังจากปิดโมดัล ให้กู้คืนข้อมูล patientHistory เป็นข้อมูลเริ่มต้น
const closePatientModal = () => {
  isModalPatientOpen.value = false;
  // Reset patientHistory to original data
  patientHistory.value = originalPatientHistory.value;
};

const getCurrentDate = () => {
  return moment().format('YYYY-MM-DD');
};

// -------------------------------
// -------------------------------

const myinfo = ref({
  fname: '',
  lname: '',
  idcard: '',
  dob: '',
  phone: '',
  address: '',
  status: null

});

const MyInfo = async (patientId) => {
  try {
    if (patientId) {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}api/patient/getProfile/${patientId}`);
      if (response.ok) {
        const data = await response.json();
        // result.value = data;
        myinfo.value.fname = data.fname
        myinfo.value.lname = data.lname
        myinfo.value.idcard = data.idcard
        myinfo.value.dob = data.dob
        myinfo.value.phone = data.phone
        myinfo.value.address = data.address
        myinfo.value.status = data.status
        console.log(data);
        console.log(myinfo.value);

      } else if (response.status === 404) {
        // Handle case when no data is found
        console.log('No data found');
        statusUser.value = [];
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



const updatestatususer = async (patientId, status) => {
  loading.value = true;
  try {
    await MyInfo(patientId)
    myinfo.value.status = status;
    if ( patientId === selectedUser.value) {
      selectedUser.value = null;
    } else {
      selectedUser.value = patientId;
    }
    const editinfo = `${import.meta.env.VITE_BASE_URL}api/patient/updateProfile/${patientId}`;
    console.log(myinfo.value)
    const response = await fetch(editinfo, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(myinfo.value),
    });

    if (response.ok) {
      await MyInfo(patientId);
    } else {
      throw new Error("Failed to delete");
    }

  } catch (error) {
    console.error("Error deleting data:", error);
  } finally {
    loading.value = false; // Set loading to false regardless of success or failure
  }
  window.location.reload();
}


const selectedUser = ref(null);
const showMenu = ref(false);
const toggleMenu = (selectedUserId) => {
  if (showMenu.value && selectedUserId === selectedUser.value) {
    showMenu.value = false;
    selectedUser.value = null;
  } else {
    showMenu.value = true;
    selectedUser.value = selectedUserId;
  }
};




</script>
<template>
  <LayoutNurse class="bg-gradient-to-b from-blue-100">
    <!-- content -->

    <div class="container mx-auto">
      <div
        class="box-content p-3  ml-5 mr-5 mt-10 bg-gradient-to-b from-blue-900 to-blue-800  shadow-lg shadow-slate-500/50  rounded-lg">
        <h2 class="font-semibold text-xl text-center text-slate-200 ">หน้าหลัก</h2>
      </div>


      <!-- boxcontent -->
      <div class="grid grid-cols-2 gap-2 mt-6">
        <div class="box-content "></div>

        <!-- Search input -->

        <form class="max-w-full mx-auto mr-3 md:mr-5 ">
          <label for="default-search"
            class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white ">Search</label>
          <div class="relative">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
            </div>
            <input type="search" id="default-search" v-model="searchInput" placeholder="ค้นหารายชื่อผู้ป่วย"
              class="block w-full md:w-96 p-4 ps-10 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
            <button type="submit" @click="resetSearch"
              class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              x </button>
          </div>
        </form>

      </div>
      <!-- ----------------------------------------------------------------------------------------------------------------------------- -->


      <!-- boxcontent แสดงรายละเอียด --------------------------------------------------------------------- -->
      <div class="box-content p-8 bg-white shadow-lg shadow-gray-300/50 mt-4 ml-5 mr-5 mb-10 rounded-lg">
        <h2 class="text-left text-2xl font-bold mb-5">รายชื่อคนไข้ทั้งหมด ({{ totalUsers }})</h2>

        <!-- --------------------------------------------------------------------------------------------------------------------------- -->


        <div class="overflow-x-auto">
          <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div class="overflow-hidden">
              <table class="w-full text-base text-left rtl:text-right text-gray-500 ">
                <thead class=" text-gray-400 uppercase bg-gray-50 ">
                  <tr>
                    <th scope="col" class="px-6 py-4 text-sm">รายชื่อ</th>
                    <th scope="col" class="px-6 py-4 text-center text-sm">สถานะการรับบริการ</th>
                    <th scope="col" class="px-6 py-4 text-center text-sm"> ตรวจล่าสุด </th>
                    <th scope="col" class="px-6 py-4 text-center text-sm">(mg/dl)</th>
                    <th scope="col" class="px-6 py-4 text-center text-sm">พูดคุย</th>
                    <th scope="col" class="px-6 py-4 text-center text-sm"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="bg-white border-b" v-for="sugarRecord in filteredResult" :key="sugarRecord.id">
                    <td class="px-6 py-4 text-black font-medium">
                      <!-- <router-link :to="'/informationUser/' + sugarRecord.id"> -->
                      <button
                        @click="openModalPatient(sugarRecord.user.id, sugarRecord.user.fname, sugarRecord.user.lname)">{{
              sugarRecord.user.fname }} {{
              sugarRecord.user.lname }}</button>
                      <!-- </router-link> -->
                    </td>
                    <td class="px-6 py-4 flex items-center justify-center">
                      <button @click="toggleMenu(sugarRecord.user.id)">
                        <img src="/correct.png" v-if="sugarRecord.user.status == 1" class="w-6 h-6" />
                        <img src="/cross.png" v-else class="w-6 h-6" />
                      </button>
                    </td>
                    <!-- Hamburger Menu -->
                    <div v-if="showMenu && selectedUser === sugarRecord.user.id" class="statusmenu">
                      <!-- เพิ่มเนื้อหาของเมนูที่นี่ -->
                      <button @click="updatestatususer(sugarRecord.user.id, 1)">
                        <img src="/correct.png" class="w-6 h-6" />
                        <p>กำลังรับการบริการ</p>
                      </button>
                      <hr class="pt-1 pb-1">
                      <button @click="updatestatususer(sugarRecord.user.id, 0)">
                        <img src="/cross.png" class="w-6 h-6" />
                        <p>ยกเลิกการรับบริการ</p>
                      </button>

                    </div>
                    <!-- ----------------- -->
                    <td class="px-6 py-4 text-center text-blue-800">
      <p v-html="sugarRecord.sugarValue !== null 
          ? (sugarRecord.updated_at !== undefined 
              ? moment(sugarRecord.updated_at).format('DD MMMM YYYY') + '<br>' + moment(sugarRecord.updated_at).format('HH:mm')
              : (sugarRecord.created_at ? moment(sugarRecord.created_at).format('DD MMMM YYYY') + '<br>' + moment(sugarRecord.created_at).format('HH:mm') : '-'))
          : '-'"
      ></p>
    </td>

                    <td class="px-6 py-4 text-center font-semibold text-gray-400"
                      :style="{ 'max-width': sugarRecord.sugarValue + '%' }" 
                      :class="{
                        'text-red-600': sugarRecord.sugarValue > 125,
                        'text-green-500': sugarRecord.sugarValue >= 70 && sugarRecord.sugarValue <= 125,
                        'text-yellow-400': sugarRecord.sugarValue >= 0 && sugarRecord.sugarValue < 70
                      }"> {{ sugarRecord.sugarValue !== null ? sugarRecord.sugarValue:"-" }}
                    </td>
                    <td class="px-6 py-4 flex items-center justify-center">
                      <router-link :to="{ name: 'chat' }">
                        <img src="/chat.png" class="w-6 h-6 " />
                      </router-link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <br>
        <!-- เมื่อคลิกที่ปุ่มนี้โมดัล add user จะปรากฎ-------------------------------------------------------------------------------------- -->
        <button @click="openModal"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 pl-4 pr-6 rounded-lg flex items-center ml-8">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="w-6 h-6 mr-2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <span>เพิ่มรายชื่อผู้ป่วย</span>
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
            <div v-if="isModalOpen"
              class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">

                <!-- เนื้อหาของโมดัล --------------------------------------------------------------- -->
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">

                  <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
                    <div class="w-full rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 bg-white">
                      <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1
                          class="text-xl font-bold text-center leading-tight tracking-tight text-gray-900 md:text-2xl">
                          เพิ่มรายชื่อผู้ป่วย
                        </h1>
                        <form class="space-y-4 md:space-y-6">

                          <!-- --------------------------------------------------------------------------- -->
                          <div>
                            <label class="block mb-2 text-sm font-medium text-gray-900">ชื่อ &nbsp;
                              <span style="font-size: 10px; color: rgb(177, 109, 241)">
                                ( ตัวอักษรต้องไม่เกิน 100 ตัวอักษร )
                              </span>
                            </label>
                            <input type="text"
                              class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder="xxxxxxxxxx" v-model.trim="fname" maxlength="100" />
                            <p v-if="fname.length" class="input-count"> {{ fname.length }}/100</p>
                            <p v-show="fname.length < 1">* โปรดใส่ชื่อจริง <span></span></p>
                            <p v-show="fname.length > 100">* ตัวอักษรต้องไม่เกิน 100 ตัวอักษร</p>
                          </div>
                          <!-- --------------------------------------------------------------------------- -->
                          <div>
                            <label class="block mb-2 text-sm font-medium text-gray-900">นามสกุล &nbsp;
                              <span style="font-size: 10px; color: rgb(177, 109, 241)">
                                ( ตัวอักษรต้องไม่เกิน 100 ตัวอักษร )
                              </span>
                            </label>
                            <input type="text"
                              class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder="xxxxxxxxxx" v-model.trim="lname" maxlength="100" />
                            <p v-if="lname.length" class="input-count"> {{ lname.length }}/100 </p>
                            <p v-show="lname.length < 1"> * โปรดใส่นามสกุล <span></span></p>
                            <p v-show="lname.length > 100">* ตัวอักษรต้องไม่เกิน 100 ตัวอักษร</p>
                          </div>
                          <!-- --------------------------------------------------------------------------- -->

                          <!-- บัตรประชาชน -->
                          <div>
                            <label class="block mb-2 text-sm font-medium text-gray-900">เลขบัตรประจำตัวประชาชน</label>
                            <input type="text" inputmode="numeric" v-model.trim="idcard" placeholder="xxxxxxxxxxxxx"
                              maxlength="13" @blur="checkinputidcard"
                              class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            <div v-if="idcard">
                              <p class="input-count"> {{ idcard.length }}/13</p>
                              <p v-show="idcard.length < 13"> * โปรดใส่เลขบัตรประชาชน 13 หลัก <span></span></p>
                              <p v-show="idcard.length > 13"> * ตัวเลขต้องเท่ากับ 13</p>
                            </div>
                          </div>
                          <!-- รหัส -->
                          <div>
                            <label class="block mb-2 text-sm font-medium text-gray-900">รหัสผ่าน</label>
                            <input placeholder="xxxxxxxx"
                              class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              type="password" name="password" v-model.trim="password" maxlength="14" minlength="8"
                              ref="passwordInput" />
                            <div v-if="password">
                              <p class="input-count" id="count"> {{ password.length }}/14 </p>
                              <p v-show="password.length < 8" id="checkname"> * รหัสผ่านต้องมีความยาวมากกว่า 8 ตัวอักษร</p>
                              <p v-show="password.length > 14" id="checkname">* รหัสผ่านต้องมีความยาวน้อยกว่า 14
                                ตัวอักษร</p>
                            </div>
                          </div>
                          <div v-show="password">
                            <label class="block mb-2 text-sm font-medium text-gray-900">ยืนยันรหัสผ่าน</label>
                            <input placeholder="xxxxxxxx"
                              class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              type="password" name="passwordcheck" v-model="passwordcheck" maxlength="14" minlength="8"
                              @keyup="checkmatch" @blur="checkinputpassword" ref="passwordCheckInput" />
                            <div v-if="passwordcheck">
                              <p class="input-count"> {{ passwordcheck.length }}/14 </p>
                              <p v-show="passwordcheck.length < 8" class="checkname">* รหัสผ่านต้องมีความยาวมากกว่า 8
                                ตัวอักษร</p>
                              <p v-show="passwordcheck.length > 14" class="checkname">* รหัสผ่านต้องมีความยาวน้อยกว่า 14
                                ตัวอักษร</p>
                            </div>

                          </div>


                          <button
                            class="block w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 px-4 mb-4 border rounded"
                            @click.prevent="registerpatient"
                            :disabled="!fname || !lname || !idcard || !password || !passwordcheck || idcard.length !== 13"
                            :class="{ 'bg-blue-900': !idcard || !password }"> สร้างบัญชี
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- ---------------------------------------------------------------------------------------------------- -->

                <!-- ปุ่มปิด Modal -->
                <div class="sm:flex sm:items-start">
                  <button @click="closeModal" type="button"
                    class="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-red-600 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm">
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


      <div v-if="isModalPatientOpen" class="fixed z-10 inset-0 overflow-y-auto">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <!-- ส่วนทับเงื่อนไข -->
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <!-- เฉพาะส่วนแสดงตามเงื่อนไข -->
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <!-- ส่วนหลักของโมดัล -->
          <div v-if="isModalPatientOpen"
            class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">

              <!-- เนื้อหาของโมดัล --------------------------------------------------------------- -->
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <div class="items-center justify-center px-1 py-8 lg:py-0">
                  <div class="w-full rounded-lg shadow dark:border  bg-white">
                    <!-- ปุ่มปิด -->
                    <button @click="closePatientModal" type="button" class="float-right">
                      <img src="/circle.png" class="w-10 h-10 " />
                    </button>
                    <!-- --------------- -->
                    <div class="p-1 space-y-4 md:space-y-6 sm:p-4">
                      <p class="text-md font-bold text-center leading-tight tracking-tight text-gray-900 md:text-2xl">
                        <span class="text-gray-700 text-md font-thin">ชื่อคนไข้ :</span>
                        {{ titleModalPatient }}
                      </p>

                      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div class="mx-5">
                          <label for="startDate" class="text-lg text-gray-800">เลือกวันที่เริ่มต้น: </label>
                          <input type="date" id="startDate" v-model="startDate" :max="getCurrentDate()"
                            class="mt-2 px-4 py-2 border rounded-md w-full">
                        </div>
                        <div class="mx-5">
                          <label for="endDate" class="text-lg text-gray-800">เลือกวันที่สิ้นสุด: </label>
                          <input type="date" id="endDate" v-model="endDate" :max="getCurrentDate()"
                            class="mt-2 px-4 py-2 border rounded-md w-full">
                        </div>
                      </div>

                      <table class="w-full text-base text-left rtl:text-right text-gray-500 font-semibold">
                        <thead class=" text-gray-400 uppercase bg-gray-50 ">
                          <tr>
                            <th scope="col" class="px-6 py-4 text-sm">วันที่</th>
                            <th scope="col" class="px-6 py-4 text-center text-sm">ค่าน้ำตาล</th>
                            <th scope="col" class="px-6 py-4 text-center text-sm"> อาการผิดปกติ </th>
                            <th scope="col" class="px-6 py-4 text-center text-sm">อื่นๆ</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="patientResult in patientHistory" :key="patientResult.id">
                            <td class="px-6 py-4 text-md">
                     
                        {{ patientResult.sugarValue !== null 
                          ? (patientResult.updated_at !== undefined 
                              ? moment(patientResult.updated_at).format("DD MMMM YYYY HH:mm") 
                              : (patientResult.created_at ? moment(patientResult.created_at).format("DD MMMM YYYY HH:mm") : '-'))
                          : '-'
                        }}
                            </td>
                            <td class="px-6 py-4 text-center text-md"
                              :style="{ 'max-width': patientResult.sugarValue + '%' }" :class="{
              'text-red-600': patientResult.sugarValue > 125,
              'text-green-500': patientResult.sugarValue >= 70 && patientResult.sugarValue <= 125,
              'text-yellow-400': patientResult.sugarValue < 70
            }">
                              {{ patientResult.sugarValue ? patientResult.sugarValue : '-' }}
                            </td>
                            <td class="px-6 py-4 text-center text-md">
                              {{ patientResult.symptom ? patientResult.symptom : '-' }}
                            </td>
                            <td class="px-6 py-4 text-center text-md">
                              {{ patientResult.note ? patientResult.note : '-' }}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <!-- ---------------------------------------------------------------------------------------------------- -->


            </div>
          </div>
        </div>
      </div>

    </div>
    <Spinner :loading="loading"></Spinner>
  </LayoutNurse>
</template>

<style>
.statusmenu {
  position: absolute;
  /* top: 50px;
  right: 90px; */
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 8%;
  box-shadow: 8px;
  width: auto;
  padding: 10px;
  z-index: 1000;
}
</style>