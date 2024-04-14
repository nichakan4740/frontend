<script setup>
import { useRouter } from "vue-router";
import { ref, onBeforeMount, computed, onMounted, onUnmounted } from "vue";
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
    const response = await fetch(`http://cp23ssa2.sit.kmutt.ac.th:8000/api/mysugar`);
    if (response.ok) {
      const data = await response.json();
      // Filter the data to keep only the latest sugar records for each user
      const filteredData = filterLatestSugarRecords(data);
      // Update the result ref with the filtered data
      result.value = filteredData;
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
    `http://cp23ssa2.sit.kmutt.ac.th:8000/api/patient/register`,
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
                    <th scope="col" class="px-6 py-4 text-center text-sm">สถานะ</th>
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
                        {{ sugarRecord.user.fname }} {{ sugarRecord.user.lname }}
                      <!-- </router-link> -->
                    </td>
                    <td class="px-6 py-4 flex items-center justify-center">
                      <img src="/correct.png" class="w-6 h-6 " />
                    </td>
                    <td class="px-6 py-4 text-center text-blue-800">
                      {{ moment(sugarRecord.updated_at).format("DD MMMM YYYY") }}
                      {{ moment(sugarRecord.updated_at).format("HH:mm") }}
                    </td>
                    <td class="px-6 py-4 text-center font-semibold"
                      :style="{ 'max-width': sugarRecord.sugarValue + '%' }" :class="{
              'text-red-600': sugarRecord.sugarValue > 125,
              'text-green-500': sugarRecord.sugarValue >= 70 && sugarRecord.sugarValue <= 125,
              'text-yellow-400': sugarRecord.sugarValue < 70
            }"> {{ sugarRecord.sugarValue }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <br>
        <!-- เมื่อคลิกที่ปุ่มนี้โมดัลจะปรากฎ-------------------------------------------------------------------------------------- -->
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
                            <input type="text"
                              class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder="xxxxxxxxxx" v-model.trim="lname" maxlength="100" />
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
                            <input type="text"
                              class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder="xxxxxxxxxx" v-model.trim="allergic_drug" maxlength="100" />
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
                            <input type="text"
                              class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder="xxxxxxxxxx" v-model.trim="my_drug" maxlength="100" />
                            <p v-if="my_drug.length" class="input-count">{{ my_drug.length }}/100 </p>
                            <p v-show="my_drug.length < 1"> * Please input your name <span></span> </p>
                            <p v-show="my_drug.length > 100">* Characters must not exceed 100</p>
                          </div>
                          <!-- --------------------------------------------------------------------------- -->



                          <div>
                            <label class="block mb-2 text-sm font-medium text-gray-900">เลขบัตรประจำตัวประชาชน</label>
                            <input type="text" v-model.trim="idcard" placeholder="xxxxxxxx" maxlength="13"
                              class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            <p v-if="idcard.length" class="input-count"> {{ idcard.length }}/13</p>
                            <p v-show="idcard.length < 1"> * Please input your id_card <span></span></p>
                            <p v-show="idcard.length > 13"> * Characters must not exceed 13</p>
                          </div>
                          <!-- --------------------------------------------------------------------------- -->



                          <div>
                            <label class="block mb-2 text-sm font-medium text-gray-900">รหัสผ่าน</label>
                            <input placeholder="xxxxxxxx"
                              class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              type="password" name="password" v-model.trim="password" maxlength="14" minlength="8" />
                            <p v-if="password" class="input-count" id="count"> {{ password.length }}/14 </p>
                            <p v-show="password.length < 8" id="checkname"> * Password must not be less than 8
                              characters</p>
                            <p v-show="password.length > 14" id="checkname">* Password must not be more than 14
                              characters</p>
                          </div>



                          <button
                            class="block w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 px-4 mb-4 border rounded"
                            @click.prevent="adduser">
                            สร้างบัญชี
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

    </div>

  </LayoutNurse>
</template>

<style></style>