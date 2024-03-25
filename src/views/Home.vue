<script setup>
import { useRouter } from "vue-router";
import { ref, onBeforeMount, computed, onMounted, onUnmounted } from "vue";
import Layout from '../layouts/Layout.vue';
import moment from "moment";
import Swal from "sweetalert2";
import axios from 'axios';


/* แสดงเวลาแบบ real time  */
const currentTime = ref('');
const updateCurrentTime = () => {
  currentTime.value = moment().format("DD MMM YYYY, HH:mm");
};
// ใช้ onMounted เพื่อเรียกใช้ฟังก์ชันเมื่อ Component ถูก Mount
onMounted(() => {
  // เริ่มต้นใช้งาน real-time update โดยเรียกฟังก์ชันทุกๆ 1 วินาที
  updateCurrentTime();
  setInterval(updateCurrentTime, 1000);
});
// ใช้ onUnmounted เพื่อทำความสะอาดเมื่อ Component ถูก Unmount
onUnmounted(() => {
  // ยกเลิกการใช้งาน setInterval เมื่อ Component ถูก Unmount เพื่อป้องกัน memory leak
  clearInterval(updateCurrentTime);
});


/* แสดงค่าน้ำตาล */
const result = ref([]);
const mysugar = ref({
  id: '',
  sugarValue: '',
  symptom: '',
  note: '',
});

const MysugarLoad = async () => {
  try {
    const user_id = localStorage.getItem('iduser');
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}api/mysugar`);
    const sugarData = await response.json();

    // เพิ่ม user_id เข้าไปในข้อมูลที่โหลดมา
    result.value = sugarData.map(item => ({ ...item, user_id }));

  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const save = async () => {
  if (!mysugar.value.sugarValue || isNaN(parseInt(mysugar.value.sugarValue))) {
    Swal.fire({
      icon: 'error',
      title: 'กรุณาระบุค่าน้ำตาลเป็นตัวเลข',
    });
    return;
  }

  if (parseInt(mysugar.value.sugarValue) > 1000) {
    Swal.fire({
      icon: 'error',
      title: 'น้ำตาลในเลือดต้องไม่เกิน 1000 mg/dL',
    });
    return;
  }

  if (mysugar.value.id === '') {
    await saveData();
  } else {
    await updateData();
  }
};

const router = useRouter();


const saveData = async () => {
  try {
    // ดึง user_id จาก Local Storage
    const user_id = localStorage.getItem('iduser');

    const dataToSend = {
      ...mysugar.value,
      user_id: user_id // เพิ่ม user_id เข้าไปในข้อมูลที่จะส่ง
    };

    const response = await fetch(`${import.meta.env.VITE_BASE_URL}api/mysugar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    });
    if (response.ok) {
      await Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'บันทึกค่าน้ำตาลเรียบร้อย',
        showConfirmButton: false,
        timer: 1500
      });
      await MysugarLoad();
      navigateToSugarValue(mysugar.value.sugarValue);
    } else {
      throw new Error('Failed to save');
    }
  } catch (error) {
    console.error('Error saving data:', error);
  }
};


// ทำการนำทางไปยังหน้า SugarValue
const navigateToSugarValue = (sugarValue) => {
  router.push({
    path: '/sugar-value',
    query: {
      sugarValue: sugarValue,
    },
  });
  // console.log('เข้า');
  // console.log(sugarValue);

};

const edit = (record) => {
  mysugar.value = { ...record };
};


const updateData = async () => {
  try {
    // ดึง user_id จาก Local Storage
    const user_id = localStorage.getItem('iduser');
    const editrecords = `${import.meta.env.VITE_BASE_URL}api/mysugar/${mysugar.value.id}`;
    const dataToSend = {
      ...mysugar.value,
      user_id: user_id // เพิ่ม user_id เข้าไปในข้อมูลที่จะส่ง
    };

    const response = await fetch(editrecords, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    });
    if (response.ok) {
      alert('Updated!!!');
      await MysugarLoad();
      mysugar.value.sugarValue = '';
      mysugar.value.symptom = '';
      mysugar.value.note = '';
      mysugar.value.id = '';
    } else {
      throw new Error('Failed to update');
    }
  } catch (error) {
    console.error('Error updating data:', error);
  }
};


const remove = async (record) => {
  try {
    const url = `${import.meta.env.VITE_BASE_URL}api/mysugar/${record.id}`;
    const response = await fetch(url, { method: 'DELETE' });
    if (response.ok) {
      alert('Deleted');
      await MysugarLoad();
    } else {
      throw new Error('Failed to delete');
    }
  } catch (error) {
    console.error('Error deleting data:', error);
  }
};
MysugarLoad();
MysugarLoad();



// ฟังก์ชันสำหรับการ logout ของ ผู้ป่วย
const logoutpatient = () => {
  // ลบ JWT จาก localStorage หรือตำแหน่งที่คุณเก็บ token
  localStorage.removeItem('idcard');
  localStorage.removeItem('accesstoken');
  localStorage.removeItem('name');
  localStorage.removeItem('iduser');
  backloginpatient()
};
const appRouter = useRouter();
const backloginpatient = () => appRouter.push({ name: "homerole" });





// ----------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------
// เรียกใช้ API เพื่อตรวจสอบว่ามีข้อมูลหรือไม่
// แล้วแสดง pop-up หรือไม่โดยใช้เงื่อนไข
const showPopup = ref(false);
const closeModal = () => {
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
      result.value = originalData.value; 
      // result.value = filterBySelectedDate(mydrug); 
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
onMounted(MyDrugLoad);



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
            <p class="text-sm text-gray-500 mt-2">** เมื่อกด 'ข้าม' ฟอร์มนี้จะแสดงในครั้งถัดไปเมื่อมีการเข้ามาหน้า Home อีกครั้ง</p>
            <div class="flex justify-center mt-3">
              <button type="submit" class=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                บันทึกข้อมูล
              </button>
              <button @click="closeModal" class="focus:outline-none text-white bg-gray-400 hover:bg-gray-500 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-12 py-2.5  me-2 mb-2 dark:focus:ring-yellow-900">
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

  <Layout class="bg-gradient-to-b  from-blue-100 ">
    <!-- content -->
    <div class="container mx-auto">

      <div
        class="box-content p-3  ml-5 mr-5 mt-10 bg-gradient-to-b from-blue-900 to-blue-800  shadow-lg shadow-slate-500/50  rounded-lg">
        <h2 class="font-semibold text-xl text-center text-slate-200 ">หน้าหลัก</h2>
      </div>

      <div class="grid grid-cols-2 gap-2  mt-5  ">

        <div class="box-content  p-8 bg-white shadow-lg shadow-gray-300/50 mt-8 ml-5 mr-5  rounded-lg">
          <p>ยาอินซูลินที่แพทย์กำหนด</p>
          <p>------------</p>
        </div>

        <div class="box-content   p-8 bg-white shadow-lg shadow-gray-300/50 mt-8 ml-5 mr-5  rounded-lg  ">
          <p>เวลาปัจจุบัน: {{ currentTime }}</p>
        </div>
      </div>

      <div>



        <div
          class="box-content   bg-white shadow-lg shadow-gray-300/50 mt-10 ml-5 mr-5 pt-6 pb-6 pl-20 pr-20  mb-10  rounded-lg ">
          <form @submit.prevent="save">

            <div class="box-content  pt-3 pb-3  ">
              <p>น้ำตาลในเลือด (mg/dL) <span class="text-red-500">*</span></p>
              <div class="box-content ">
                <input type="text" v-model="mysugar.sugarValue"
                  class="block w-full rounded-md border-0 py-5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400"
                  placeholder="กรอกเฉพาะตัวเลข เช่น 260 ">
              </div>
            </div>


            <div class="box-content pt-3 pb-3">
              <p>อาการผิดปกติ (ถ้ามี)</p>
              <input type="text" v-model="mysugar.symptom"
                class="block w-full rounded-md border-0 py-5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400"
                placeholder="กรุณากรอกข้อมูลเมื่อพบอาการผิดปกติ">
            </div>



            <div class="box-content pt-3 pb-3 ">
              <p>ข้อมูลอื่นๆ (ถ้ามี)</p>
              <div class="box-content">
                <input type="text" v-model="mysugar.note"
                  class="block w-full rounded-md border-0 py-5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400"
                  placeholder="กรุณากรอกข้อมูลอื่นๆที่อยากบอกเรา เช่น เมื่อคืนรับประทานอะไรไปบ้าง การออกกำลังกาย ฯลฯ">
              </div>
            </div>


            <div class="box-content pt-3 pb-3   ">
              <button :disabled="!mysugar.sugarValue"
                class="block w-full bg-blue-900 text-white font-bold py-2 px-4 border rounded"
                :class="{ 'bg-blue-800': !mysugar.sugarValue }">
                บันทึกค่าน้ำตาล
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>




  </Layout>

</template>

<style>
.bg-blue-900:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  /* เปลี่ยนเป็น cursor ปีกหลุดเพื่อแสดงว่าปุ่มไม่สามารถคลิกได้ */
}

.form-container {
  overflow-y: auto;
}
</style>