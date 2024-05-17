<script setup>
import { ref, computed, onMounted } from "vue";
import Layout from "../layouts/Layout.vue";
import { useRoute } from 'vue-router';


const sugarLevelText = 'น้ำตาลปกติ';




const normal = 'การออกกำลังกาย: เริ่มต้นการออกกำลังกายอย่างสม่ำเสมอ เช่น การเดิน, วิ่ง, โยคะ, หรือกิจกรรมทางกายอื่น ๆ อย่างสม่ำเสมอ เพื่อช่วยลดระดับน้ำตาลในเลือด  การตรวจสุขภาพประจำ: ทำการตรวจสุขภาพประจำอย่างสม่ำเสมอ เพื่อตรวจสอบสุขภาพทั่วไปและการตรวจระดับน้ำตาลในเลือดอย่างสม่ำเสมอ  การลดน้ำหนัก (หากจำเป็น): หากมีน้ำหนักที่เกินมา การลดน้ำหนักอาจช่วยลดการดูดซึมน้ำตาลในเลือดได้  ปฏิบัติการเปลี่ยนแปลงพฤติกรรม: การเปลี่ยนแปลงพฤติกรรมที่เป็นประโยชน์ เช่น เลิกสูบบุหรี่, การดื่มเครื่องดื่มที่มีแอลกอฮอล์หรือน้ำตาลสูง, การลดความเครียด, การนอนพักผ่อนที่เพียงพอ เป็นต้น';

const Gnormal = 'การควบคุมอาหาร: รักษาการบริโภคอาหารที่มีความหลากหลายและสมดุล เน้นการรับประทานผักผลไม้, โปรตีน, และไขมันดี เพื่อช่วยควบคุมระดับน้ำตาลในเลือด';

const Bnormal = 'เครื่องดื่มที่ผสมแอลกอฮอล์ รวมทั้งยาดองเหล้า หรือจำกัดการดื่มแอลกอฮอล์ให้เหลือน้อยที่สุด เพราะแอลกอฮอล์อาจมีผลต่อยาที่ใช้ควบคุมเบาหวานและโรคต่างๆ และหลีกเลี่ยงการกินน้ำตาล น้ำอัดลม เครื่องดื่มชูกำลัง ขนมหาน ผลไม้เชื่อมแช่อิ่ม ผลไม้ที่มีรสหวาน ไขมัน สัตว์ เนย มันหมู เนื้อติดมัน เครื่องในสัตว์ หอยนางรม ไข่แดง ครีม กะทิ และอาหารทอด';



const bgColor = '#d0f8ce';


const textColor ='darkgreen'; // สีเขียวเข้ม



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
              d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
          </svg>
        </div>

       

        <p :style="{ color: textColor }" class="text-4xl font-bold text-center mt-5">{{ sugarLevelText }}</p>
      </div>




      <div class="my-5 p-10 bg-white box-border rounded-lg shadow-lg shadow-gray-300/50">
        <b>
          คำแนะนำการปฏิบัติตัวเบื้องต้น
        </b>
        <div>{{ normal }}</div>
        <br>
        <b>
          อาหารที่ควรรับประทาน
        </b>
        <div>{{ Gnormal }}</div>
        <br>
        <b>
          อาหารที่ควรหลีกเลี่ยงหรือลดการบริโภค
        </b>
        <div>{{ Bnormal }}</div>
      </div>

      <div class="mb-8 ml-2 mr-4">
        <p class="text-left">แหล่งอ้างอิง: 
          <a class="text-blue-600" href="https://www.paolohospital.com/th-TH/chokchai4/Search?s=%E0%B9%80%E0%B8%9A%E0%B8%B2%E0%B8%AB%E0%B8%A7%E0%B8%B2%E0%B8%99"> โรงพยาบาลเปาโล </a>,
          <a class="text-blue-600" href="https://www.phyathai.com/th/news/%E0%B9%82%E0%B8%A0%E0%B8%8A%E0%B8%99%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A3%25%3C0%3EE0%B8%AA%E0%B8%B3%E0%B8%AB%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B9%82%E0%B8%A3%E0%B8%84%E0%B9%80%E0%B8%9A%E0%B8%B2%E0%B8%AB%E0%B8%A7"> โรงพยาบาลพญาไท </a>
          <a class="text-blue-600" href="https://w2.med.cmu.ac.th/nd/wp-content/uploads/2019/11/Dm60.pdf">และ สมาคมโรคเบาหวานแห่งประเทศไทย </a>
        </p>
      </div>

      <div class="flex justify-center">
        <router-link to="/dashboard">
          <button
            class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mr-5">
            กลับหน้าหลัก
          </button>
        </router-link>

        <router-link to="/addsugar">
          <button
            class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
            บันทึกค่าน้ำตาลเพิ่ม
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