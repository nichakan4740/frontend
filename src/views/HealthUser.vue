<script setup>
import { useRouter } from "vue-router";
import { ref, onBeforeMount, computed, onMounted, onUnmounted } from "vue";
import Layout from '../layouts/Layout.vue';
import moment from "moment";
import Swal from "sweetalert2";

const name = localStorage.getItem("name") + " " + localStorage.getItem("lname");
const userId = localStorage.getItem('iduser');

const originalData = ref([]); // Store original data
const result = ref([]);
/* --------------------------------------------------------------------------------------------------- */
const Mydrug = async () => {
  try {
    const userId = localStorage.getItem('iduser');
    const response = await fetch(`http://cp23ssa2.sit.kmutt.ac.th:8000/api/drug/${userId}`);
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
onMounted(Mydrug);
/* --------------------------------------------------------------------------------------------------- */

const appRouter = useRouter();

const allergic_drug = ref("");
const my_drug = ref("");

const add_drug = async () => {
  const res = await fetch(
    `http://cp23ssa2.sit.kmutt.ac.th:8000/api/drug`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        allergic_drug: allergic_drug.value,
        my_drug: my_drug.value,
      }),
    }
  );
}

// ให้ปุ่มเปลี่ยนสี
const isButtonClicked = ref(false);

const handleButtonClick = () => {
  // Toggle the state when the button is clicked
  isButtonClicked.value = !isButtonClicked.value;
};

// แล้วแสดง pop-up หรือไม่โดยใช้เงื่อนไข
const showPopup = ref(false);
const openModal = () => {
  showPopup.value = true;
};
const closeModal = () => {
  showPopup.value = false;
};


/* การใช้งาน API  */
const mydrug = ref({
  userId: localStorage.getItem('iduser'),
  id: "",
  my_drug: "",
  allergic_drug: "",
});


const updateDrug = async () => {
  try {
    const userId = localStorage.getItem('iduser');
    const editdrug = `http://cp23ssa2.sit.kmutt.ac.th:8000/api/drug/${userId}`;
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
      var response = await fetch(editdrug, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mydrug.value),
      });
      if (response.ok) {
        Mydrug()
         Swal.fire({
            icon: 'success',
            title: 'แก้ไขข้อมูลสำเร็จ',
            // text: 'Information updated successfully',
         });
      }
      console.log(mydrug.value.allergic_drug ,  mydrug.allergic_drug)
      closeModal();
      
    }
  } catch (error) {
    console.error("Error deleting data:", error);
  }

}

</script>

<template>
  <Layout class="bg-gradient-to-b from-blue-100">
    <!-- content -->

    <div class="container mx-auto">
      <div
        class="box-content p-3  ml-5 mr-5 mt-10 bg-gradient-to-b from-blue-900 to-blue-800  shadow-lg shadow-slate-500/50  rounded-lg">
        <h2 class="font-semibold text-xl text-center text-slate-200 ">ข้อมูลสุขภาพ</h2>
      </div>


      <!-- boxcontent ข้อมูลสุขภาพ  --------------------------------------------------------------------- -->
      <div
        class="bg-white dark:bg-gray-900 box-conten shadow-lg shadow-gray-300/50 mt-10 ml-5 mr-5 pt-6 pb-6 pl-6 pr-6  mb-10  rounded-lg "
        v-for="mydrug in result" :key="mydrug.id">
        <div class="grid-container flex justify-center max-h-72">
          <div class="hidden bg-cover lg:block lg:w-2/5 mt-10">
            <img src="/user2.png" class="max-w-60 mx-auto">
          </div>
          <div class="flex items-center justify-start w-full max-w-3xl p-8 mx-auto lg:px-12 lg:w-3/5">
            <div class="w-full">
              <h1 class="text-2xl font-semibold tracking-wider text-gray-800 capitalize dark:text-white">
                <div class>{{ name }}</div>
              </h1>

              <div class="mt-6">

                <h1 class="text-gray-500 dark:text-gray-300">เลือกเพื่อดูข้อมูล</h1>

                <div class="mt-3 md:flex md:items-center md:-mx-2">
                  <router-link :to="{ name: 'informationUser' }">
                    <button @click="handleButtonClick" :class="{ 'bg-blue-500 text-white': isButtonClicked }"
                      class="flex justify-center w-full px-6 py-3 text-blue-500 border border-blue-500 rounded-md md:mt-0 md:w-auto md:mx-2 dark:border-blue-400 dark:text-blue-400 focus:outline-none">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>

                      <span class="mx-2">
                        ข้อมูลส่วนบุคคล
                      </span>
                    </button>
                  </router-link>


                  <button
                    class="flex justify-center w-full px-6 py-3 text-white bg-blue-500 rounded-md md:w-auto md:mx-2 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>

                    <span class="mx-2">
                      ข้อมูลสุขภาพ
                    </span>
                  </button>

                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- <div class="flex items-center justify-end">
          <button type="button"
            class="block bg-blue-900 text-white font-normal py-2 px-4 mr-4 border rounded">แก้ไขข้อมูลสุขภาพ</button>
        </div> -->


        <!-- ข้อมูล ---------------------------------------------------------------------------------->
        <div class="box-content  pt-3 pb-3 mt-2 mx-2 md:mx-4 lg:mx-8 xl:mx-24 2xl:mx-28">
          <p>ช่วงระดับน้ำตาลที่แพทย์กำหนด </p>
          <div class="box-content ">

            <div
              class="block w-full rounded-md border-0 py-5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400">
              <p>ก่อนอาหาร 90 - 200 mg/dL</p>
            </div>
          </div>
        </div>
        <!-- ------------------------------------------------------------------------------------------- -->


        <!-- ข้อมูล ---------------------------------------------------------------------------------->
        <div class="box-content  pt-3 pb-3 mx-2 md:mx-4 lg:mx-8 xl:mx-24 2xl:mx-28">
          <p>ยาที่ใช้ประจำ</p>
          <div class="box-content ">

            <div
              class="block w-full rounded-md border-0 py-5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400">
              <p>{{ mydrug.my_drug }}</p>
            </div>
          </div>
        </div>
        <!-- ------------------------------------------------------------------------------------------- -->

        <!-- ข้อมูล ---------------------------------------------------------------------------------->
        <div class="box-content  pt-3 pb-3 mx-2 md:mx-4 lg:mx-8 xl:mx-24 2xl:mx-28">
          <p>ข้อมูลยาที่แพ้</p>
          <div class="box-content ">

            <div
              class="block w-full rounded-md border-0 py-5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400">
              <p>{{ mydrug.allergic_drug }}</p>
            </div>
          </div>
        </div>
        <!-- ------------------------------------------------------------------------------------------- -->


        <button
        @click="openModal"
          class="flex items-center justify-between w-3/6 mx-auto px-6 py-3 mr-24 mt-4 mb-2 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
          <span>แก้ไขข้อมูลสุขภาพ</span>

          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 rtl:-scale-x-100" @click.prevent="add_drug"
            viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd" />
          </svg>
        </button>

      </div>
      <!-- --------------------------------------------------------------------------------------------------------------------------- -->

    </div>

 <!-- Pop up กรอกข้อมูลยา -->
 <div v-if="showPopup" class="fixed inset-0 z-10 flex items-center justify-center">
      <div class="fixed inset-0 bg-black opacity-50"></div>
      <div class="bg-white p-8 rounded shadow-md z-20">
        <h2 class="text-xl font-bold mb-4 text-center">แก้ไขข้อมูลยา</h2>
        <div class="card-body">
          <form @submit.prevent="updateDrug">
            <div class="box-content pt-3 pb-3">
              <p>ยาที่ใช้ประจำ <span style="font-size: 13px; color: rgb(177, 109, 241)">( ถ้าไม่มีพิมพ์ว่า ' ไม่มี ' หรือ ' - ' )</span></p>
              <input type="text" v-model="mydrug.my_drug" class="block w-full rounded-md border-0 py-10 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400" placeholder="กรุณากรอกยาที่ใช้ประจำ">
            </div>
            <div class="box-content pt-3 pb-3">
              <p>ยาที่แพ้ <span style="font-size: 13px; color: rgb(177, 109, 241)">( ถ้าไม่มีพิมพ์ว่า ' ไม่มี ' หรือ ' - ' )</span></p>
              <div class="box-content">
                <input type="text" v-model="mydrug.allergic_drug" class="block w-full rounded-md border-0 py-10 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400" placeholder="กรุณากรอกชื่อยาที่แพ้">
              </div>
            </div>
            <div class="flex justify-center mt-3">
              <button type="submit" class=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                บันทึกข้อมูล
              </button>
              <button @click="closeModal" class="focus:outline-none text-white bg-gray-400 hover:bg-gray-500 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-12 py-2.5  me-2 mb-2 dark:focus:ring-yellow-900">
                ยกเลิก
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
      <!-- ส่วนของ pop-up เพื่อกรอกข้อมูลใหม่ -->


  </Layout>


</template>

<style>
.grid-container {
  display: grid;
  grid-template-columns: 1fr;
  /* หรือเลือกค่าอื่น ๆ ตามต้องการ */
  align-items: start;
  /* หรือ end หรือ center, ขึ้นอยู่กับความต้องการ */
  height: 100vh;
  /* ทำให้ container มีความสูงเต็มหน้าจอ */
}
</style>