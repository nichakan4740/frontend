<script setup>
import { useRouter } from "vue-router";
import { ref, onBeforeMount, computed, onMounted, onUnmounted } from "vue";
import LayoutNurse from '../layouts/LayoutNurse.vue';
import moment from "moment";
import Swal from "sweetalert2";
const router = useRouter();
const appRouter = useRouter();


/* โหลดข้อมูล------------------------------------------------------------------------------------------------------ */
const MysugarLoad = async () => {  
    try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}api/mysugar`);
        if (response.ok) {
            const data = await response.json();
            result.value = data;
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
const searchInput = ref('');

// ตรวจสอบว่า user_id เหมือนกันหรือไม่
const isSameUserId = (userId1, userId2) => {
    return userId1 === userId2;
};


// Separate data by user_id
const groupedResults = computed(() => {
  const grouped = {};
  for (const sugarRecord of result.value) {
    if (!grouped[sugarRecord.user_id]) {
      grouped[sugarRecord.user_id] = [];
    }
    grouped[sugarRecord.user_id].push(sugarRecord);
  }
  return Object.values(grouped);
});

// Filter results based on search input
const filteredResults = computed(() => {
  if (!searchInput.value.trim()) {
    return groupedResults.value;
  } else {
    return groupedResults.value.map(userRecords => {
      return userRecords.filter(record => {
        return record.user.fname.toLowerCase().includes(searchInput.value.trim().toLowerCase());
      });
    });
  }
});

// Reset search input
const resetSearch = () => {
  searchInput.value = '';
};

/* ค้นหา---------------------------------------------------------------------------------------------------- */

</script>
 
<template>
<LayoutNurse class="bg-gradient-to-b  from-blue-100 ">
 <div class="container mx-auto">
       <div  class="box-content p-3  ml-5 mr-5 mt-10 bg-gradient-to-b from-blue-900 to-blue-800  shadow-lg shadow-slate-500/50  rounded-lg">
            <h2 class="font-semibold text-xl text-center text-slate-200 ">สถิติรายบุคคล</h2>
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
<!-- boxcontent แสดงรายละเอียด -->
      <div
        v-for="(userData, index) in filteredResults"
        :key="index"
        >
        <div v-if="userData.length > 0"
        class="box-content p-8 bg-white shadow-lg shadow-gray-300/50 mt-4 ml-5 mr-5 mb-10 rounded-lg"
          >
        <h2 class="text-left text-2xl font-bold mb-5">ข้อมูลรายบุคคลทั้งหมด</h2>

        <div class="overflow-x-auto">
          <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div class="overflow-hidden">
              <table class="w-full text-sm text-left rtl:text-right text-gray-500 ">
                <thead class=" text-gray-400 uppercase bg-gray-50 ">
                  <tr>
                    <th scope="col" class="px-6 py-4 text-sm">รายชื่อ</th>
                    <th scope="col" class="px-6 py-4 text-center text-sm">สถานะการรับบริการ</th>
                    <th scope="col" class="px-6 py-4 text-center text-sm"> เวลาที่ตรวจ </th>
                    <th scope="col" class="px-6 py-4 text-center text-sm">(mg/dl)</th>
                    <th scope="col" class="px-6 py-4 text-center text-sm">อาการผิดปกติ</th>
                    <th scope="col" class="px-6 py-4 text-center text-sm">อื่นๆ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    class="bg-white border-b"
                    v-for="sugarRecord in userData"
                    :key="sugarRecord.id"
                  >
                    <td class="px-6 py-4 text-black font-medium">
                      {{ sugarRecord.user.fname }} {{ sugarRecord.user.lname }}</td>
                    <td class="px-6 py-4 flex items-center justify-center">
                      <img src="/correct.png" class="w-6 h-6 " />
                    </td>
                    <td class="px-6 py-4 text-center text-blue-800">
                      <p v-html="sugarRecord.sugarValue !== null 
                      ? moment(sugarRecord.updated_at).format('DD MMMM YYYY') + '<br>' + moment(sugarRecord.updated_at).format('HH:mm')
                      :  '-'"
                      ></p>
            
                    </td>
                    <td class="px-6 py-4 text-center font-semibold" 
                    :style="{ 'max-width': sugarRecord.sugarValue + '%' }" :class="{
              'text-red-600': sugarRecord.sugarValue > 125,
              'text-green-500': sugarRecord.sugarValue >= 70 && sugarRecord.sugarValue <= 125,
              'text-yellow-400': sugarRecord.sugarValue < 70
            }">{{ sugarRecord.sugarValue !== null ? sugarRecord.sugarValue : "-" }}</td>
                      <td class="px-6 py- text-black font-medium text-center">
                      {{ sugarRecord.symptom }}</td>
                      <td class="px-6 py-4 text-black font-medium text-center">
                      {{ sugarRecord.note }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  </LayoutNurse>
</template>
 
<style>

</style>
