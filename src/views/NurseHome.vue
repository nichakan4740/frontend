<script setup>
import { useRouter } from "vue-router";
import { ref, onBeforeMount, computed,onMounted, onUnmounted } from "vue";
import LayoutNurse from '../layouts/LayoutNurse.vue';
import moment from "moment";
import Swal from "sweetalert2";
const router = useRouter();
// ฟังก์ชันสำหรับการ logout พยาบาล
const logout = () => {
  // ลบ JWT จาก localStorage หรือตำแหน่งที่คุณเก็บ token
  localStorage.removeItem('professional_id');
  localStorage.removeItem('accesstoken');
  localStorage.removeItem('idadmin');
  localStorage.removeItem('name');
  backloginnurse()
};

const appRouter = useRouter();
const  backloginnurse = () => appRouter.push({ name: "homerole" });

</script>
 
<template>
<LayoutNurse class="bg-gradient-to-b  from-blue-100 ">
<!-- content -->
<div class="container mx-auto">


  
  

   <button @click="logout"  class="box-content p-3  ml-5 mr-5 mt-10 bg-gradient-to-b from-blue-900 to-blue-800  shadow-lg shadow-slate-500/50  rounded-lg">
            <h2 class="font-semibold text-xl text-center text-slate-200 ">ออก</h2>
    </button>

  </div>
               
    </LayoutNurse>
</template>
 
<style>

</style>