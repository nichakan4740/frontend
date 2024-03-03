<script setup>
import { useRouter } from "vue-router";
import { ref, onBeforeMount, computed,onMounted, onUnmounted } from "vue";
import Layout from '../layouts/Layout.vue';
import moment from "moment";
import Swal from "sweetalert2";

const appRouter = useRouter();
</script>
 
<template>
<Layout>
      <!-- content -->

    <div class="container mx-auto">
       <div  class="box-content p-3  ml-5 mr-5 mt-10 bg-gradient-to-b from-blue-900 to-blue-800  shadow-lg shadow-slate-500/50  rounded-lg">
            <h2 class="font-semibold text-xl text-center text-slate-200 ">ข้อมูลส่วนบุคคล</h2>
       </div>
    



    </div>



</Layout>
</template>
 
<style>

</style>