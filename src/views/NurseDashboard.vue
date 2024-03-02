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
    <div class="grid grid-cols-2 gap-2  mt-5 ">
     <div class="box-content"></div>
     <div class="box-content p-8 bg-white shadow-lg shadow-gray-300/50 mt-8 ml-5 mr-5  rounded-lg  ">
      <!-- Search input -->
      <input type="text" v-model="searchInput" placeholder="ค้นหารายชื่อผู้ป่วย" class="bg-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
      <button @click="resetSearch" class="bg-gray-300 rounded-lg px-3 py-1 ml-2 focus:outline-none focus:ring-2 focus:ring-blue-400">คืนค่า</button>
  
     </div>
     </div>
<!-- boxcontent แสดงรายละเอียด -->
      <div
        v-for="(userData, index) in filteredResults"
        :key="index"
        class="box-content p-8 bg-white shadow-lg shadow-gray-300/50 mt-8 ml-5 mr-5 mb-10 rounded-lg"
      >
        <h2 class="text-left text-2xl font-bold mb-5">ข้อมูลรายบุคคลทั้งหมด</h2>

        <div class="overflow-x-auto">
          <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div class="overflow-hidden">
              <table class="w-full text-sm text-left rtl:text-right text-gray-500 ">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 ">
                  <tr>
                    <th scope="col" class="px-6 py-4">รายชื่อ</th>
                    <th scope="col" class="px-6 py-4">สถานะ</th>
                    <th scope="col" class="px-6 py-4">ตรวจล่าสุด</th>
                    <th scope="col" class="px-6 py-4">(mg/dl)</th>
                    <th scope="col" class="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    class="bg-white border-b"
                    v-for="sugarRecord in userData"
                    :key="sugarRecord.id"
                  >
                    <td class="px-6 py-4">{{ sugarRecord.user.fname }} {{ sugarRecord.user.lname }}</td>
                    <td class="px-6 py-4"></td>
                    <td class="px-6 py-4">
                      {{ moment(sugarRecord.updated_at).format("DD MMM YYYY") }}
                      <br />
                      {{ moment(sugarRecord.updated_at).format("HH:mm") }}
                    </td>
                    <td class="px-6 py-4">{{ sugarRecord.sugarValue }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </LayoutNurse>
</template>
 
<style>

</style>
