<script setup>
import { useRouter } from "vue-router";
import { ref, onBeforeMount, computed, onMounted, watch, onUnmounted } from "vue";
import Layout from "../layouts/Layout.vue";
import moment from "moment";
import Swal from "sweetalert2";


/* date-time */
const selectedDate = ref("");
const resultdate = ref("");
const originalData = ref([]); // Store original data
const startDate = ref('');
const endDate = ref('');

const maxSugarValue = ref(null);
const minSugarValue = ref(null);


const maxSugarValueByDate = computed(() => {
  const filteredData = filterBySelectedDate(originalData.value, startDate.value, endDate.value);
  if (filteredData.length > 0) {
    return Math.max(...filteredData.map(record => record.sugarValue));
  } else {
    return 0; // ถ้าไม่มีข้อมูลให้คืนค่าเป็น 0
  }
});

const minSugarValueByDate = computed(() => {
  const filteredData = filterBySelectedDate(originalData.value, startDate.value, endDate.value);
  if (filteredData.length > 0) {
    return Math.min(...filteredData.map(record => record.sugarValue));
  } else {
    return 0; // ถ้าไม่มีข้อมูลให้คืนค่าเป็น 0
  }
});

watch([startDate, endDate], ([newStartDate, newEndDate], [oldStartDate, oldEndDate]) => {
  maxSugarValueByDate.value = Math.max(...filterBySelectedDate(originalData.value, newStartDate, newEndDate).map(record => record.sugarValue));
  minSugarValueByDate.value = Math.min(...filterBySelectedDate(originalData.value, newStartDate, newEndDate).map(record => record.sugarValue));
});

/* การใช้งาน API  */
const mysugar = ref({
  id: "",
  sugarValue: "",
  symptom: "",
  note: "",
});

/* --------------------------------------------------------------------------------------------------- */
const MysugarLoad = async () => {
  try {
    const userId = localStorage.getItem('iduser');
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}api/mysugar/${userId}`);
    if (response.ok) {
      const data = await response.json();
      originalData.value = data;
      // เรียงข้อมูลตามวันที่ล่าสุดไปยังเก่าสุด
      originalData.value.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
      // แสดงผลทีละ 10 อัน
      result.value = originalData.value.slice(0, 10);

      result.value = filterBySelectedDate(data);
    } else if (response.status === 404) {
      // Handle case when no data is found
      console.log('No data found');
      result.value = [];
    } else {
      throw new Error('Failed to fetch data');
    }
    // หาค่าน้ำตาลที่มากที่สุดและน้อยที่สุด
    findMaxMinSugarValue();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
onMounted(MysugarLoad);

// - หาค่าน้ำตาลมากสุด และ น้อยสุด -------------------------------------------------------------------------
const findMaxMinSugarValue = () => {
  if (result.value.length > 0) {
    // หาค่าน้ำตาลที่มากที่สุด
    var filterResult = result.value.filter((item) => item.sugarValue !== null)
    console.log(filterResult);
    maxSugarValue.value = Math.max(...filterResult.map(record => record.sugarValue));
    // หาค่าน้ำตาลที่น้อยที่สุด
    minSugarValue.value = Math.min(...filterResult.map(record => record.sugarValue));
  } else {
    // ถ้าไม่มีข้อมูลให้กำหนดค่าเป็น 0
    maxSugarValue.value = 0;
    minSugarValue.value = 0;
  }
};
// watch(result, findMaxMinSugarValue);


/* ------ filter------------------------------------------------------------------------------------------ */
const filterBySelectedDate = (data, startDate, endDate) => {
  if (startDate && endDate) {
    const filteredData = data.filter(record => {
      const recordDate = moment(record.updated_at).format('YYYY-MM-DD');
      return moment(recordDate).isBetween(startDate, endDate, 'days', '[]');
    });
    const filterNull = filteredData.filter((item) => item.sugarValue !== null)

    // หาค่าน้ำตาลที่มากที่สุด
    maxSugarValue.value = Math.max(...filterNull.map(record => record.sugarValue));
    // หาค่าน้ำตาลที่น้อยที่สุด
    minSugarValue.value = Math.min(...filterNull.map(record => record.sugarValue));

    // คำนวณค่าเฉลี่ยและคืนค่า
    averageLowSugar.value = calculateAverageSugar('low', filterNull);
    averageNormalSugar.value = calculateAverageSugar('normal', filterNull);
    averageHighSugar.value = calculateAverageSugar('high', filterNull);

    return filterNull;

  } else {
    maxSugarValue.value = null;
    minSugarValue.value = null;
    return data;
  }
};

watch([startDate, endDate], ([newStartDate, newEndDate], [oldStartDate, oldEndDate]) => {
  if (newStartDate && newEndDate) {
    result.value = filterBySelectedDate(originalData.value, newStartDate, newEndDate);
  } else {
    result.value = originalData.value;
  }
});

function handleDateSelection(data, selectedDate) {
  // ตั้งค่าวันเริ่มต้นและสิ้นสุดเป็น null
  startDate.value = null;
  endDate.value = null;
}

/* รายวัน------------------------------------------------------------------------------------------ */
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
watch(selectedDate, (newSelectedDate, oldSelectedDate) => {
  result.value = filterByDaily(originalData.value, newSelectedDate);
});
const filterDataByDate = () => {
  result.value = filterByDaily(originalData.value, selectedDate.value);
};




/* ------------------------------------------------------------------------------------------------ */
const save = async () => {
  if (mysugar.value.id === "") {
    await saveData();
  } else {
    await updateData();
  }
};

/* ------------------------------------------------------------------------------------------------ */
const saveData = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}api/mysugar`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mysugar.value),
      }
    );
    if (response.ok) {
      alert("Saved");
      await MysugarLoad();
      mysugar.value.id = "";
      mysugar.value.sugarValue = "";
      mysugar.value.symptom = "";
      mysugar.value.note = "";
    } else {
      throw new Error("Failed to save");
    }
  } catch (error) {
    console.error("Error saving data:", error);
  }
};

/* --------------------------------------------------------------------------------------------------- */
const edit = (record) => {
  mysugar.value = { ...record };
  openModal();
};

const updateData = async () => {
  try {
    const editrecords = `${import.meta.env.VITE_BASE_URL}api/mysugar/${mysugar.value.id
      }`;
    // Display confirmation dialog using Swal
    const confirmationResult = await Swal.fire({
      title: "ยืนยันการแก้ไข",
      text: "คุณต้องการที่จะแก้ไขการบันทึกค่าน้ำตาล",
      icon: "warning",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      showCancelButton: true,
      showCloseButton: true
    });

    if (confirmationResult.isConfirmed) {
      const response = await fetch(editrecords, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mysugar.value),
      });

      if (response.ok) {
        await MysugarLoad();
      } else {
        throw new Error("Failed to delete");
      }
    }
  } catch (error) {
    console.error("Error deleting data:", error);
  }
}

/* --------------------------------------------------------------------------------------------------- */
/* ลบ */
const remove = async (record) => {
  try {
    const url = `${import.meta.env.VITE_BASE_URL}api/mysugar/${record.id}`;

    // Display confirmation dialog using Swal
    const confirmationResult = await Swal.fire({
      title: "ยืนยันการแก้ไข",
      text: "คุณต้องการลบการบันทึกค่าน้ำตาล",
      icon: "warning",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      showCancelButton: true,
      showCloseButton: true
    });

    if (confirmationResult.isConfirmed) {
      const response = await fetch(url, { method: "DELETE" });
      if (response.ok) {
        await MysugarLoad();
      } else {
        throw new Error("Failed to delete");
      }
    }
  } catch (error) {
    console.error("Error deleting data:", error);
  }
};
const result = ref([]);




/* --------------------------------------------------------------------------------------------------- */
/* model popup */
const isModalOpen = ref(false);

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};
/* ---------------------------------------------------------------------- */

/* function ค่าเฉลี่ย-------------------------------------------------------- */
const calculateAverageSugar = (category, data) => {
  const filteredData = data.filter(record => {
    if (category === 'low') {
      return record.sugarValue < 70;
    } else if (category === 'normal') {
      return record.sugarValue >= 70 && record.sugarValue <= 125;
    } else if (category === 'high') {
      return record.sugarValue > 125;
    }
  });
  const sum = filteredData.reduce((total, record) => total + record.sugarValue, 0);
  const average = sum / filteredData.length;
  return isNaN(average) ? 0 : average;
};

const averageLowSugar = computed(() => calculateAverageSugar('low', result.value).toFixed(2));
const averageNormalSugar = computed(() => calculateAverageSugar('normal', result.value).toFixed(2));
const averageHighSugar = computed(() => calculateAverageSugar('high', result.value).toFixed(2));


/* นับจำนวน---------------------------------------------------------------------------------------------------- */
const countLowSugar = computed(() => result.value.filter(record => record.sugarValue !== null && record.sugarValue < 70).length);
const countNormalSugar = computed(() => result.value.filter(record => record.sugarValue >= 70 && record.sugarValue <= 125).length);
const countHighSugar = computed(() => result.value.filter(record => record.sugarValue > 125).length);


// กำหนด page ละ 10 ข้อมูล -----------------------------------------------------------------------------------------
const currentPage = ref(1);
const itemsPerPage = 10;
const numberOfRecords = computed(() => result.value.length);
const totalPages = computed(() => Math.ceil(result.value.length / itemsPerPage));

const paginatedResults = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return result.value.slice(startIndex, endIndex);
});

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage + 1);
const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage, result.value.length));

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};


// ----------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------
// เรียกใช้ API เพื่อตรวจสอบว่ามีข้อมูลหรือไม่
// แล้วแสดง pop-up หรือไม่โดยใช้เงื่อนไข
const showPopup = ref(false);
const closePopup = () => {
  showPopup.value = false;
};


onMounted(async () => {
 
  try {
    
    const userId = localStorage.getItem('iduser');
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}api/check-data/${userId}`);
    const dataDrug = await response.json();
    console.log('data drug',dataDrug.hasData);
    if (dataDrug.hasData === false) {
      showPopup.value = true;
    } 
  } catch (error) {
    console.error('Error:', error);
  }
});

const saveDrug = async (event) => { // รับ event เข้ามา
  const res = await fetch(
    `${import.meta.env.VITE_BASE_URL}api/savedrug`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        data : mydrug.value
      }),
    }
  );
  if (res.ok) {
    Swal.fire({
        icon: "success",
        title: "บันทึกสำเร็จ",
      }).then(function(){
      showPopup.value = false;
    });
    setTimeout(function () {
      close();
    }, 1500);
  } else {
    const responseData = await res.json(); // Parse response JSON
      const errorMessage = responseData.message;
      Swal.fire({
        icon: "error",
        title: errorMessage,
      });
  }


    // showPopup.value = false;
    // ทำสิ่งที่คุณต้องการหลังจากบันทึกข้อมูลลงในฐานข้อมูล
};

const mydrug = ref({
  id: "",
  allergic_drug: "",
  my_drug: "",
  user_id:localStorage.getItem('iduser'),
});



const MyDrugLoad = async () => {
  try {
    const userId = localStorage.getItem('iduser');
    console.log(userId);
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}api/drug/${userId}`);
    if (response.ok) {
      const mydrug = await response.json();
      const originalData = ref();
      originalData.value = mydrug.value;
      //result.value = originalData.value; 
      // result.value = filterBySelectedDate(mydrug); 
    } else if (response.status === 404) {
      console.log('No data found');
      //result.value = []; 
    } else {
      throw new Error('Failed to fetch data');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
onMounted(MyDrugLoad);


const getCurrentDate = () => {
   return moment().format('YYYY-MM-DD');
};

</script>

<template>

<div>
    <!-- Pop up กรอกข้อมูลยา -->
    <div v-if="showPopup" class="fixed inset-0 z-10 flex items-center justify-center">
      <div class="fixed inset-0 bg-black opacity-50"></div>
      <div class="bg-white p-8 rounded shadow-md z-20">
        <h2 class="text-xl font-bold mb-4 text-center">ข้อมูลยาของฉัน</h2>
        <div class="card-body">
          <form @submit.prevent="saveDrug">
            <div class="box-content pt-3 pb-3">
              <p>ยาที่แพ้ <span style="font-size: 13px; color: rgb(177, 109, 241)">( ถ้าไม่มีพิมพ์ว่า ' ไม่มี ' หรือ ' - ' )</span></p>
              <div class="box-content">
                <input type="text" v-model="mydrug.allergic_drug" class="block w-full rounded-md border-0 py-10 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400" placeholder="กรุณากรอกชื่อยาที่แพ้">
              </div>
            </div>
            <div class="box-content pt-3 pb-3">
              <p>ยาที่ใช้ประจำ <span style="font-size: 13px; color: rgb(177, 109, 241)">( ถ้าไม่มีพิมพ์ว่า ' ไม่มี ' หรือ ' - ' )</span></p>
              <input type="text" v-model="mydrug.my_drug" class="block w-full rounded-md border-0 py-10 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400" placeholder="กรุณากรอกยาที่ใช้ประจำ">
            </div>
            <p class="text-sm text-gray-500 mt-2">** เมื่อกด 'ข้าม' ฟอร์มนี้จะแสดงในครั้งถัดไปเมื่อมีการเข้ามาหน้านี้อีกครั้ง</p>
            <div class="flex justify-center mt-3">
              <button type="submit" class=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                บันทึกข้อมูล
              </button>
              <button @click="closePopup" class="focus:outline-none text-white bg-gray-400 hover:bg-gray-500 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-12 py-2.5  me-2 mb-2 dark:focus:ring-yellow-900">
                ข้าม
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!-- ส่วนของ pop-up เพื่อกรอกข้อมูลใหม่ -->
  </div>


  <!-- -------------------------------------------------------------------------------------------- -->
  <Layout class="bg-gradient-to-b from-blue-100">
    <!-- content -->

    <div class="container mx-auto">
      <div
        class="box-content p-3 ml-5 mr-5 mt-10 bg-gradient-to-b from-blue-900 to-blue-800 shadow-lg shadow-slate-500/50 rounded-lg">
        <h2 class="font-semibold text-xl text-center text-slate-200">สถิติระดับค่าน้ำตาล</h2>
      </div>

      <div class="grid grid-cols-2 gap-2 mt-5">
        <div class="flex flex-col box-content p-8 pb-4 bg-white shadow-lg shadow-gray-300/50 mt-8 ml-5 mr-2 rounded-lg">

          <div class="flex justify-start">
            <div>
              <p>เลือกช่วงเวลาที่ต้องการ</p>

              <!-- ---------------------------------------------------------- -->
              <!-- Input for selecting date -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div class="mx-5">
                  <label for="startDate" class="text-lg text-gray-800">เลือกวันที่เริ่มต้น: </label>
                  <input type="date" id="startDate" v-model="startDate" :max="getCurrentDate()" class="mt-2 px-4 py-2 border rounded-md w-full">
                </div>
                <div class="mx-5">
                  <label for="endDate" class="text-lg text-gray-800">เลือกวันที่สิ้นสุด: </label>
                  <input type="date" id="endDate" v-model="endDate" :max="getCurrentDate()" class="mt-2 px-4 py-2 border rounded-md w-full">
                </div>
              </div>


            </div>
          </div>
          <div>
          </div>
          <div class="flex justify-end pt-10">
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-hairline py-2 px-4 max-w-20 rounded"
              @click="handleDateSelection">
              ยกเลิก
            </button>
          </div>
        </div>

        <!-- ค่าเฉลี่ย -->

        <div class="box-content p-8 bg-white shadow-lg shadow-gray-300/50 mt-8 ml-5 mr-5 rounded-lg">
          <p>จำนวนครั้ง</p>
          <div class="mt-5 mx-5" v-if="startDate && endDate">
            <p>{{ moment(startDate).format('DD MMMM YYYY') }} - {{ moment(endDate).format('DD MMMM YYYY') }}</p>
          </div>
          <!-- <div class="mt-5 mx-5" v-if="selectedDate">
            <p>{{ moment(selectedDate).format('DD MMMM YYYY') }}</p>
          </div> -->


          <div class="overflow-x-auto flex-grow">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500">
              <tbody>
                <tr class="bg-white">
                  <td class="px-6 py-4 content-center">
                    <!-- <div
                      class="box-border h-20 w-20 p-4  bg-amber-200  text-lg pt-7 text-white text-center rounded-full">
                      {{ averageLowSugar }} </div> -->
                    <p class="text-center text-yellow-400 text-xl font-extrabold">น้ำตาลต่ำ</p>
                    <br>
                    <p class="text-center text-yellow-400 text-6xl font-extrabold">{{ countLowSugar }}</p>
                    <p class="text-center ">ครั้ง</p>
                  </td>
                  <td class="px-6 py-4 content-center ">
                    <!-- <div
                      class="box-border h-20 w-20 p-4 bg-green-500 pt-7  text-lg text-white text-center  rounded-full">
                      {{ averageNormalSugar }} </div> -->
                    <p class="text-center text-green-500 text-xl font-extrabold">น้ำตาลปกติ</p>

                    <br>
                    <p class="text-center text-green-500 text-6xl font-extrabold"> {{ countNormalSugar }}</p>
                    <p class="text-center "> ครั้ง</p>
                  </td>
                  <td class="px-6 py-4 content-center">
                    <!-- <div class="box-border h-20 w-20 p-4 bg-red-500 pt-7 text-lg  text-white text-center rounded-full">
                      {{ averageHighSugar }} </div> -->
                    <p class="text-center text-red-500 text-xl font-extrabold">น้ำตาลสูง</p>
                    <br>
                    <p class="text-center text-red-500 text-6xl font-extrabold">{{ countHighSugar }}</p>
                    <p class="text-center ">ครั้ง </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>



          <!-- --------------------------------------------------------------- -->
        </div>
      </div>
      <div>


        <div class="box-content p-8 bg-white shadow-lg shadow-gray-300/50 mt-8 ml-5 mr-5 mb-10 rounded-lg">
          <h2 class="text-center text-2xl font-bold mb-5">รายละเอียดค่าน้ำตาล</h2>
          <div v-if="maxSugarValue !== null || minSugarValue !== null">
            <p v-if="maxSugarValue !== null || minSugarValue !== null" class="text-center text-medium">
              <span v-if="minSugarValue !== null" class="text-gray-500">ค่าน้ำตาลที่ต่ำที่สุด: {{ minSugarValueByDate }}
                mg/dL</span>
              <span v-if="maxSugarValue !== null && minSugarValue !== null" class="mx-2">|</span>
              <span v-if="maxSugarValue !== null" class="text-gray-500">ค่าน้ำตาลที่สูงที่สุด: {{ maxSugarValueByDate }}
                mg/dL</span>
            </p>
          </div>

          <!-- ---------------------------------------------------------------------------------------------------------------------- -->

          <div class="flex flex-col">
            <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                <div class="overflow-hidden">
                  <table class="min-w-full text-left text-sm font-light">
                    <thead class="border-b font-medium dark:border-neutral-500">
                      <tr>
                        <th scope="col" class="px-6 py-4">วันที่เปลี่ยนแปลงการบันทึก</th>
                        <th scope="col" class="px-6 py-4 "> ระดับน้ำตาลในเลือด</th>
                        <th scope="col" class="px-6 py-4"> อาการผิดปกติ </th>
                        <th scope="col" class="px-6 py-4">หมายเหตุ</th>
                        <th scope="col" class="px-6 py-4"></th>
                        <th scope="col" class="px-6 py-4"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <!-- <tr class="border-b dark:border-neutral-500" v-for="sugarRecord in result" :key="sugarRecord.id"> -->
                      <tr class="border-b dark:border-neutral-500" v-for="(sugarRecord) in paginatedResults"
                        :key="sugarRecord.id">
                        <td v-if="sugarRecord.sugarValue !== null" class="whitespace-nowrap px-6 py-4"> {{ moment(sugarRecord.updated_at).format("DD MMM YYYY") }}
                          <!--แสดงข้อความตามเงื่อนไขของค่าน้ำตาล / แสดงข้อความตามเงื่อนไขของค่าน้ำตาล -->
                          <br>
                          <span :class="{
                            'text-yellow-500': sugarRecord.sugarValue < 70,
                            'text-green-500': sugarRecord.sugarValue >= 70 && sugarRecord.sugarValue <= 125,
                            'text-red-500': sugarRecord.sugarValue > 125
                          }">
                            <span v-if="sugarRecord.sugarValue < 70"><router-link
                                to="/low">น้ำตาลต่ำ</router-link></span>

                            <span v-else-if="sugarRecord.sugarValue >= 70 && sugarRecord.sugarValue <= 125"><router-link
                                to="/normal">น้ำตาลปกติ</router-link></span>
                            <span v-else><router-link to="/high">น้ำตาลสูง</router-link></span>
                          </span>
                        </td>


                        <td v-if="sugarRecord.sugarValue !== null" class="whitespace-nowrap px-6 py-4">{{ sugarRecord.sugarValue !== null ? sugarRecord.sugarValue : "-" }} mg/dl
                          <div class="w-full rounded-full h-2.5 mb-4 dark:bg-gray-300 ">
                            <div class="bg-gray-600 h-2.5 rounded-full "
                              :style="{ 'max-width': sugarRecord.sugarValue + '%' }" :class="{
                              'bg-red-500': sugarRecord.sugarValue > 125,
                              'bg-green-500': sugarRecord.sugarValue >= 70 && sugarRecord.sugarValue <= 125,
                              'bg-yellow-500': sugarRecord.sugarValue < 70
                            }"></div>
                          </div>


                        </td>
                        <td v-if="sugarRecord.sugarValue !== null" class="whitespace-nowrap px-6 py-4">{{ sugarRecord.symptom }}</td>
                        <td v-if="sugarRecord.sugarValue !== null" class="whitespace-nowrap px-6 py-4">{{ sugarRecord.note }}</td>

                        <!-- ปุ่มแก้ไข/ปุ่มลบ -->
                        <td v-if="sugarRecord.sugarValue !== null" class="whitespace-nowrap px-6 py-4">
                          <button type="button"
                            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                            @click="edit(sugarRecord)">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                              class="w-5 h-4">
                              <path
                                d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                            </svg>
                          </button>

                          <button type="button"
                            class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 me-2 ml-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                            @click="remove(sugarRecord)">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                              class="w-5 h-4">
                              <path fill-rule="evenodd"
                                d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                                clip-rule="evenodd" />
                            </svg>
                          </button>
                        </td>
                        <!-- ----------------------------------------------------------------- -->
                      </tr>
                    </tbody>
                  </table>
                  <div  v-if="result.length == 0 || result.length == 1 " class="text-center text-gray-500 ">
                    <br>
                    ไม่มีประวัติการบันทึกผลการวัดค่าน้ำตาล
                  </div>
                  <!-- --------------------------------------------------------------- -->
                </div>
              </div>

              <!--button pagination-------------------------------------------------------------------------------- -->
              <div class="flex flex-col items-center my-4">
                <!-- Help text -->
                <span class="text-sm text-gray-700 dark:text-gray-400">
                  ลำดับที่ <span class="font-semibold text-gray-900 dark:text-white">{{ startIndex }}</span> - <span
                    class="font-semibold text-gray-900 dark:text-white"> {{ endIndex }}</span> จากทั้งหมด <span
                    class="font-semibold text-gray-900 dark:text-white">{{ numberOfRecords }}</span> รายการ
                </span>
                <div class="inline-flex mt-2 xs:mt-0">
                  <!-- Buttons -->
                  <button @click="previousPage" :disabled="currentPage === 1"
                    class="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-blue-800 rounded-s hover:bg-blue-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                    <svg class="w-3.5 h-3.5 me-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                      fill="none" viewBox="0 0 14 10">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 5H1m0 0 4 4M1 5l4-4" />
                    </svg>
                    ก่อนหน้า
                  </button>
                  <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-blue-800 border-0 border-s border-gray-700 rounded-e hover:bg-blue-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                    ถัดไป
                    <svg class="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                      fill="none" viewBox="0 0 14 10">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M1 5h12m0 0L9 1m4 4L9 9" />
                    </svg>
                  </button>
                </div>
              </div>

            </div>
          </div>

          <!-- -------------------------------------------------------------------------------------------- -->
          <!-- modal popup -->
          <div>
            <!-- Modal -->
            <div v-if="isModalOpen" class="fixed inset-0 z-10 flex items-center justify-center">
              <div class="fixed inset-0 bg-black opacity-50"></div>
              <div class="bg-white p-8 rounded shadow-md z-20">
                <h2 class="text-xl font-bold mb-4 text-center">แก้ไขค่าระดับน้ำตาล</h2>


                <div class="card-body">
                  <form @submit.prevent="save">

                    <div class="box-content  pt-3 pb-3  ">
                      <p>น้ำตาลในเลือด (mg/dL) *</p>
                      <div class="box-content ">
                        <input type="text" v-model="mysugar.sugarValue"
                          class="block w-full rounded-md border-0 py-10 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400"
                          placeholder="กรอกเฉพาะตัวเลข เช่น 260 ">
                      </div>
                    </div>


                    <div class="box-content pt-3 pb-3">
                      <p>อาการผิดปกติ (ถ้ามี)</p>
                      <input type="text" v-model="mysugar.symptom"
                        class="block w-full rounded-md border-0 py-10 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400"
                        placeholder="กรุณากรอกข้อมูลเมื่อพบอาการผิดปกติ">
                    </div>



                    <div class="box-content pt-3 pb-3 ">
                      <p>อื่นๆ</p>
                      <div class="box-content">
                        <input type="text" v-model="mysugar.note"
                          class="block w-full rounded-md border-0 py-10 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400"
                          placeholder="กรุณากรอกข้อมูลอื่นๆที่อยากบอกเรา เช่น เมื่อคืนรับประทานอะไรไปบ้าง ">
                      </div>
                    </div>

                    <button type="submit"
                      class="ml-9 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                      บันทึกการแก้ไข
                    </button>
                    <button @click="closeModal"
                      class="focus:outline-none text-white bg-yellow-300 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900">
                      เสร็จสิ้น
                    </button>
                  </form>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Prompt:ital,wght@0,200;0,300;0,700;1,300;1,400;1,500;1,600&display=swap");
</style>