<script setup>
import { useRouter } from "vue-router";
import { ref, onBeforeMount, computed,onMounted, onUnmounted } from "vue";
import Layout from '../layouts/Layout.vue';
import moment from "moment";
import Swal from "sweetalert2";
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
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}api/mysugar`);
    const data = await response.json();
    result.value = data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};


const save = async () => {
  if (mysugar.value.id === '') {
    await saveData();
  } else {
    await updateData();
  }
};

const router = useRouter();


const saveData = async () => {
  try {
   const response = await fetch(`${import.meta.env.VITE_BASE_URL}api/mysugar`, 
   
   {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mysugar.value),
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
    const editrecords = `${import.meta.env.VITE_BASE_URL}api/mysugar/${mysugar.value.id}`;
    const response = await fetch(editrecords, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mysugar.value),
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
</script>

<template >
 <Layout class="bg-gradient-to-b  from-blue-100 ">
<!-- content -->
<div class="container mx-auto">
   
    <div  class="box-content p-3  ml-5 mr-5 mt-10 bg-gradient-to-b from-blue-900 to-blue-800  shadow-lg shadow-slate-500/50  rounded-lg">
            <h2 class="font-semibold text-xl text-center text-slate-200 ">หน้าหลัก</h2>
    </div>
          
<div class="grid grid-cols-2 gap-2  mt-5  ">

  <div  class="box-content  p-8 bg-white shadow-lg shadow-gray-300/50 mt-8 ml-5 mr-5  rounded-lg">
   <p>ยาอินซูลินที่แพทย์กำหนด</p>
    <p>------------</p>
  </div>
 
  <div class="box-content   p-8 bg-white shadow-lg shadow-gray-300/50 mt-8 ml-5 mr-5  rounded-lg  ">
     <p>เวลาปัจจุบัน: {{ currentTime }}</p>
  </div>
  </div>

<div>

    <div  class="box-content   bg-white shadow-lg shadow-gray-300/50 mt-10 ml-5 mr-5 pt-6 pb-6 pl-20 pr-20  mb-10  rounded-lg ">
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
            

             <div class="box-content pt-3 pb-3   ">
             <button  class=" block w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 px-4 border  rounded">
               บันทึกค่าน้ำตาล</button>
            </div>
          </form>
        </div>
    </div>
  </div>
               
    </Layout>

</template>

<style>

</style>