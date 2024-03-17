<script setup>
import { useRouter } from "vue-router";
import { ref, onBeforeMount, computed, onMounted, onUnmounted } from "vue";
import Layout from '../layouts/Layout.vue';


</script>
 
<template>
    <Layout class="bg-gradient-to-b from-blue-100">
        <div class="container mx-auto">
            <div
                class="box-content p-3 ml-5 mr-5 mt-10 bg-gradient-to-b from-blue-900 to-blue-800 shadow-lg shadow-slate-500/50 rounded-lg">
                <h2 class="font-semibold text-xl text-center text-slate-200">
                    สาระความรู้
                </h2>
            </div>


            <div
                class="box-content bg-white shadow-lg shadow-gray-300/50 mt-10 ml-5 mr-5 pt-10 pb-6 pl-14 pr-6 mb-10 rounded-lg">

                <!-- <div class="box-content pt-6 pb-3   ">
                    <p>กรุณาทำแบบทดสอบครั้งที่ 1 (ก่อนการดูคลิป)</p>
                    <router-link :to="{ name: 'test' }"
                        class="block w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 px-4  border rounded text-center">
                        - แบบทดสอบครั้งที่ 1 - </router-link>

                </div>
                <br>
                <br>
                <br> -->


                <div class=" grid grid-cols-1 gap-2 sm:grid-cols-2 pl-8 ">
                    <div class=" ml-2 pb-6 ">
                        <iframe src="https://www.youtube.com/embed/lcN3aSoDF2M" frameborder="0" allowfullscreen
                            class="rounded-md w-4/5 h-64 "></iframe>
                        <!-- <iframe width="450" height="260" src="https://www.youtube.com/embed/Vj48SNcUPXY" frameborder="0" allowfullscreen> -->
                        <p class="font-semibold text-lg">1. รู้จักเบาหวานใน 3 นาที</p>
                        <p class="font-light">Cr. Thonburi Hospital channel</p>
                    </div>
                    <div class="ml-2 pb-6">
                        <iframe src="https://www.youtube.com/embed/7mw04nvCScg" frameborder="0" allowfullscreen
                            class="rounded-md w-4/5 h-64"></iframe>
                        <p class="font-semibold text-lg">2. โรคร้าย ที่มากับเบาหวาน </p>
                        <p class="font-light">Cr. Thonburi Hospital channel</p>
                    </div>
                    <div class="ml-2 pb-6">
                        <iframe src="https://www.youtube.com/embed/IZanRzm79uk" frameborder="0" allowfullscreen
                            class="rounded-md w-4/5 h-64"></iframe>
                        <p class="font-semibold text-lg">3. การรับประทานอาหารสำหรับผู้ป่วยโรคเบาหวาน</p>
                        <p class="font-light">Cr. โรงพยาบาลรามคําแหง</p>
                    </div>
                    <div class="ml-2 pb-6">
                        <iframe src="https://www.youtube.com/embed/2tP14jlCq9Q" frameborder="0" allowfullscreen
                            class="rounded-md w-4/5 h-64"></iframe>
                        <p class="font-semibold text-lg">4. ออกกำลังกายพิชิตโรคเบาหวาน</p>
                        <p class="font-light">Cr. Thonburi Hospital channel</p>
                    </div>


                </div>

                <!-- <div class="box-content pt-6 pb-3   ">
                    <p>กรุณาทำแบบทดสอบครั้งที่ 2 (หลังการดูคลิป)</p>

                    <router-link :to="{ name: 'test' }"
                        class="block w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 px-4  border rounded text-center">-
                        แบบทดสอบครั้งที่ 2 -</router-link>

                </div> -->
            </div>


        </div>
    </Layout>
</template>
 
<style>

</style>