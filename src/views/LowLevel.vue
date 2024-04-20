<script setup>
import { ref, computed, onMounted } from "vue";
import Layout from "../layouts/Layout.vue";
import { useRoute } from 'vue-router';



const sugarLevelText = 'น้ำตาลต่ำ';
  

const low = 'รับประทานอาหารหวานหรือคาร์โบไฮเดรตที่ออกฤทธิ์เร็ว รอ 15 นาทีแล้วตรวจระดับน้ำตาลในเลือด  หากระดับน้ำตาลในเลือดยังต่ำกว่า 70 มก./ดล. ให้รับประทานอาหารหวาน ๆ เพิ่ม  ทำตามขั้นตอนนี้ซ้ำจนกว่าระดับน้ำตาลในเลือดจะเทียบเท่าหรือสูงกว่า 70 มก./ดล.';

const Glow = 'ตัวอย่างอาหารคาร์โบไฮเดรตออกฤทธ์เร็วในปริมาณ 15 กรัม กล้วยครึ่งผล น้ำผลไม้หรือน้ำอัดลมแบบมีน้ำตาลครึ่งแก้ว น้ำตาล น้ำผึ้ง น้ำเชื่อม 1 ช้อนโต๊ะ เจลกลูโคส 1 หลอด (ดูเอกสารการใช้ยา) ยาเม็ดกลูโคส 3 - 4 เม็ด (ดูเอกสารการใช้ยา)';

const Blow = 'หลีกเลี่ยงการรับประทานอาหารที่มีน้ำตาลและคาร์โบไฮเดรตสูง เช่น ขนมหวาน หรืออาหารที่มีน้ำตาลและคาร์โบไฮเดรตสูงมาก ';



const bgColor = '#fff59d';


const textColor = 'darkgoldenrod'; // สีเหลืองเข้ม
 


</script>


 
<template>
  <Layout class="bg-gradient-to-b from-blue-100">
    <div class="content">

      <div :style="{ backgroundColor: bgColor, color: textColor }"
        class="box-border rounded-lg mt-5 py-2 flex place-content-center shadow-lg shadow-gray-300/50">

        <div>
          <!-- ใส่คลาสของ Icon Tailwind CSS -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            class="w-20 h-20 flex-1 mr-5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
          </svg>
        </div>

        
        <p :style="{ color: textColor }" class="text-4xl font-bold text-center mt-5">{{ sugarLevelText }}</p>
      </div>




      <div class="my-5 p-10 bg-white box-border rounded-lg shadow-lg shadow-gray-300/50">
        <b>
          คำแนะนำการปฏิบัติตัวเบื้องต้น
        </b>
        <div>{{ low }}</div>
        <br>
        <b>
          อาหารที่ควรรับประทาน
        </b>
        <div>{{ Glow }}</div>
        <br>
        <b>
          อาหารที่ควรหลีกเลี่ยงหรือลดการบริโภค
        </b>
        <div>{{ Blow }}</div>
      </div>

      <div class="flex justify-center">
        <router-link to="/home">
          <button
            class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mr-5">
            กลับหน้าหลัก
          </button>
        </router-link>

        <router-link to="/dashboard">
          <button
            class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
            ดูประวัติการบันทึก
          </button>
        </router-link>
      </div>
      <br>

    </div>
  </Layout>
</template>
 
<style>
.content {
  max-width: 60%;
  margin: auto;
}</style>