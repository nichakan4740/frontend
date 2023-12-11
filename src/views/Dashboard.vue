<script setup>
import { useRouter } from "vue-router";
import { ref, onBeforeMount, computed } from "vue";
import Layout from "../layouts/Layout.vue";
import moment from "moment";
import Swal from "sweetalert2";

/* date-time */
const selectedDate = ref("");
const resultdate = ref("");

const getDateDetails = () => {
  if (selectedDate.value !== "") {
    const date = new Date(selectedDate.value);

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const weekDayIndex = date.getDay();
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayOfWeek = daysOfWeek[weekDayIndex];

    const monthsOfYear = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const monthName = monthsOfYear[date.getMonth()];

    resultdate.value = `วันที่: ${day} เดือน: ${month} ปี: ${year} วัน: ${dayOfWeek}<br> เดือน: ${monthName}`;
  }
};

const result = ref([]);
const mysugar = ref({
  id: "",
  sugarValue: "",
  symptom: "",
  note: "",
});

const MysugarLoad = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}api/mysugar`);
    const data = await response.json();
    result.value = data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

/* --------------------------------------------------------------------------------------------------- */
const save = async () => {
  if (mysugar.value.id === "") {
    await saveData();
  } else {
    await updateData();
  }
};

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
    const editrecords = `${import.meta.env.VITE_BASE_URL}api/mysugar/${
      mysugar.value.id
    }`;
    // Display confirmation dialog using Swal
    const confirmationResult = await Swal.fire({
      title: "คุณแน่ใจหรือไหม",
      text: "คุณต้องการที่จะแก้ไขการบันทึกค่าน้ำตาล",
      icon: "warning",
      confirmButtonText: "ใช่ ,แก้ไขมัน",
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
};

/* --------------------------------------------------------------------------------------------------- */
/* ลบ */
const remove = async (record) => {
  try {
    const url = `${import.meta.env.VITE_BASE_URL}api/mysugar/${record.id}`;

    // Display confirmation dialog using Swal
    const confirmationResult = await Swal.fire({
      title: "คุณแน่ใจหรือไหม",
      text: "คุณต้องการลบการบันทึกค่าน้ำตาล",
      icon: "warning",
      confirmButtonText: "ใช่ ,ลบมัน",
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
// Assuming MysugarLoad function is defined somewhere in your code
MysugarLoad();

/* --------------------------------------------------------------------------------------------------- */
/* model popup */
const isModalOpen = ref(false);

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};
</script>

<template>
  <Layout class="bg-gradient-to-b from-blue-100">
    <!-- content -->

    <div class="container mx-auto">
      <div
        class="box-content p-3 ml-5 mr-5 mt-10 bg-gradient-to-b from-blue-900 to-blue-800 shadow-lg shadow-slate-500/50 rounded-lg"
      >
        <h2 class="font-semibold text-xl text-center text-slate-200">สถิติ</h2>
      </div>

      <div class="grid grid-cols-2 gap-2 mt-5">
        <div
          class="box-content p-8 bg-white shadow-lg shadow-gray-300/50 mt-8 ml-5 mr-5 rounded-lg"
        >
          <p>เลือกช่วงเวลาที่ต้องการ</p>
          <!-- <div>
            <form>
              <label for="dateInput">เลือกวันที่:</label>
              <input type="date" v-model="selectedDate" />
              <button type="button" @click="getDateDetails">
                แสดงรายละเอียด
              </button>
            </form>

            <p v-if="resultdate !== ''" v-html="resultdate"></p>
          </div> -->
        </div>

        <div
          class="box-content p-8 bg-white shadow-lg shadow-gray-300/50 mt-8 ml-5 mr-5 rounded-lg"
        ></div>
      </div>

      <div>
        <div class="box-content p-8 bg-white shadow-lg shadow-gray-300/50 mt-8 ml-5 mr-5 mb-10 rounded-lg" >
        <h2 class="text-center text-2xl font-bold mb-5">รายละเอียดค่าน้ำตาลช่วง</h2>
<!-- ---------------------------------------------------------------------------------------------------------------------- -->
<div class="flex flex-col">
  <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
      <div class="overflow-hidden">
        <table class="min-w-full text-left text-sm font-light">
          <thead class="border-b font-medium dark:border-neutral-500">
            <tr >
              <th scope="col" class="px-6 py-4">วันที่บันทึก</th>
              <th scope="col" class="px-6 py-4">วันที่เปลี่ยนแปลงการบันทึก</th>
              <th scope="col" class="px-6 py-4">  ระดับน้ำตาลในเลือด  </th>
              <th scope="col" class="px-6 py-4"> อาการผิดปกติ </th>
              <th scope="col" class="px-6 py-4">อื่นๆ</th>
              <th scope="col" class="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b dark:border-neutral-500" v-for="sugarRecord in result" :key="sugarRecord.id">
              <td class="whitespace-nowrap px-6 py-4 font-medium"> {{moment(sugarRecord.created_at).format( "DD MMM YYYY, HH:mm")}}</td>
              <td class="whitespace-nowrap px-6 py-4"> {{moment(sugarRecord.updated_at).format("DD MMM YYYY, HH:mm")}}</td>
              <td class="whitespace-nowrap px-6 py-4">{{ sugarRecord.sugarValue }}</td>
              <td class="whitespace-nowrap px-6 py-4">{{ sugarRecord.symptom }}</td>
              <td class="whitespace-nowrap px-6 py-4">{{ sugarRecord.note }}</td>
              <td class="whitespace-nowrap px-6 py-4">
                 <button type="button" 
                         class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                 @click="edit(sugarRecord)">
                       แก้ไขค่าระดับน้ำตาล
                 </button>
                 <button type="button" 
                 class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" 
                 @click="remove(sugarRecord)" >
                     ลบการบันทึก
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<!-- -------------------------------------------------------------------------------------------- -->
            <!-- modal popup -->
            <div>
              <!-- Modal -->
              <div
                v-if="isModalOpen"
                class="fixed inset-0 z-10 flex items-center justify-center"
              >
                <div class="fixed inset-0 bg-black opacity-50"></div>

                <div class="bg-white p-8 rounded shadow-md z-20">
                  <h2 class="text-xl font-bold mb-4 text-center">แก้ไขค่าระดับน้ำตาล</h2>
        

                  <div class="card-body">
                     <form @submit.prevent="save">

          <div class="box-content  pt-3 pb-3  " >
            <p>น้ำตาลในเลือด (mg/dL) *</p>
           <div class="box-content ">
              <input type="text" v-model="mysugar.sugarValue"  
              class="block w-full rounded-md border-0 py-10 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400"
              placeholder="กรอกเฉพาะตัวเลข เช่น 260 ">
            </div>
          </div>
           

           <div class="box-content pt-3 pb-3" >
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
          
                      <button
                       class="ml-9 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                      >
                        แก้ไขค่าระดับน้ำตาล
                      </button>
                      <button
                        @click="closeModal"
                      class="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
                      >
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
