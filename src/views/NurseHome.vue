<script setup>
import { useRouter } from "vue-router";
import { ref, onBeforeMount, computed,onMounted, onUnmounted } from "vue";
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

/* -------------------------------------------------------------------------------- */
// แสดงข้อมูลผู้ป่วย
const getPatient = async () => {
  try {
    const accessToken = localStorage.getItem('accesstoken');
    if (!accessToken) {
      throw new Error('Access token not found');
    }
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}api/patient/getProfile`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch patient profile');
    }
    const patientData = await response.json();
    return patientData;
  } catch (error) {
    console.error('Error fetching patient profile:', error.message);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to fetch patient profile. Please try again later.',
    });
    return null;
  }
};

// Fetch patient profile when component is mounted
const patientProfile = ref(null);
onMounted(async () => {
  patientProfile.value = await getPatient();
});


// Cleanup on component unmount
onUnmounted(() => {
});

</script>
 
<template>
 <LayoutNurse class="bg-gradient-to-b from-blue-100">
    <!-- content -->

    <div class="container mx-auto">
       <div  class="box-content p-3  ml-5 mr-5 mt-10 bg-gradient-to-b from-blue-900 to-blue-800  shadow-lg shadow-slate-500/50  rounded-lg">
            <h2 class="font-semibold text-xl text-center text-slate-200 ">หน้าหลัก</h2>
       </div>
    
 
    <!-- boxcontent -->
    <div class="grid grid-cols-2 gap-2  mt-5  ">
     <div class="box-content"></div>
 
 
     <div class="box-content p-8 bg-white shadow-lg shadow-gray-300/50 mt-8 ml-5 mr-5  rounded-lg  ">
     <p>เวลาปัจจุบัน: {{ currentTime }}</p>
     </div>
     </div>
        <!-- ----------------------------------------------------------------------------------------------------------------------------- -->


        <!-- boxcontent แสดงรายละเอียด --------------------------------------------------------------------- -->
         <div class="box-content p-8 bg-white shadow-lg shadow-gray-300/50 mt-8 ml-5 mr-5 mb-10 rounded-lg">
        <h2 class="text-center text-2xl font-bold mb-5">รายละเอียดค่าน้ำตาลช่วง</h2>
        
        <div v-if="patientProfiles && patientProfiles.length > 0">
          <div v-for="(patient, index) in patientProfiles" :key="index" class="mb-4">
            <p>ชื่อ: {{ patient.fname }}</p>
            <!-- Add more fields as needed -->
          </div>
        </div>
        <div v-else>
          <p>No patient profiles available</p>
        </div>
        <!-- End of iteration -->
      </div>






       <!-- ------------------------------------------------------------------------------------ -->
    </div>   
  </LayoutNurse>
</template>
 
<style>

</style>