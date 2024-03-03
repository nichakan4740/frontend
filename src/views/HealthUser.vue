<script setup>
import { useRouter } from "vue-router";
import { ref, onBeforeMount, computed,onMounted, onUnmounted } from "vue";
import Layout from '../layouts/Layout.vue';
import moment from "moment";
import Swal from "sweetalert2";


const originalData = ref([]); // Store original data
const result = ref([]);
/* --------------------------------------------------------------------------------------------------- */
const Mydrug = async () => {
  try {
    const userId = localStorage.getItem('iduser');
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}api/drug/${userId}`);
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
onMounted(Mydrug );
/* --------------------------------------------------------------------------------------------------- */









const appRouter = useRouter();
</script>
 
<template>
<Layout class="bg-gradient-to-b from-blue-100">
      <!-- content -->

    <div class="container mx-auto">
       <div  class="box-content p-3  ml-5 mr-5 mt-10 bg-gradient-to-b from-blue-900 to-blue-800  shadow-lg shadow-slate-500/50  rounded-lg">
            <h2 class="font-semibold text-xl text-center text-slate-200 ">ข้อมูลสุขภาพ</h2>
       </div>
    
        <!-- boxcontent ข้อมูลสุขภาพ  --------------------------------------------------------------------- -->
         <div class="box-content p-8 bg-white shadow-lg shadow-gray-300/50 mt-8 ml-5 mr-5 mb-10 rounded-lg"
          v-for="mydrug in result" :key="mydrug.id" 
         >
            <button type="button" 
            class="block bg-blue-900 text-white font-normal py-2 px-4 border rounded float-right ">แก้ไขข้อมูลสุขภาพ</button>
            
             
             <!-- ข้อมูล ---------------------------------------------------------------------------------->
             <div class="box-content  pt-3 pb-3  " >
                  <p>ช่วงระดับน้ำตาลที่แพทย์กำหนด </p>
                  <div class="box-content ">

                      <div class="block w-full rounded-md border-0 py-5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400">
                      <p>ก่อนอาหาร   90 - 200 mg/dL</p>
                      </div>
                  </div>
            </div>
            <!-- ------------------------------------------------------------------------------------------- -->


             <!-- ข้อมูล ---------------------------------------------------------------------------------->
             <div class="box-content  pt-3 pb-3  " >
                  <p>ข้อมูลการใช้ยา</p>
                   <div class="box-content ">

                      <div class="block w-full rounded-md border-0 py-5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400">
                      <p>{{mydrug.my_drug}}</p>
                      </div>
                  </div>
            </div>
            <!-- ------------------------------------------------------------------------------------------- -->

             <!-- ข้อมูล ---------------------------------------------------------------------------------->
             <div class="box-content  pt-3 pb-3  " >
                  <p>ข้อมูลยาที่แพ้</p>
                   <div class="box-content ">

                      <div class="block w-full rounded-md border-0 py-5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400">
                      <p>{{mydrug.allergic_drug}}</p>
                      </div>
                  </div>
            </div>
            <!-- ------------------------------------------------------------------------------------------- -->

    


        </div>
    <!-- --------------------------------------------------------------------------------------------------------------------------- -->  



    </div>




</Layout>


</template>
 
<style>

</style>