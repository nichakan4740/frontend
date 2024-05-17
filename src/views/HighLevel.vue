<script setup>
import { ref, computed, onMounted } from "vue";
import Layout from "../layouts/Layout.vue";
import { useRoute } from 'vue-router';


const sugarLevelText = 'น้ำตาลสูง';
  

const high = `1.ดื่มน้ำสะอาดมากๆ 
2.หยุดทํากิจกรรม และนอนพัก  
3.หากอาการไม่ดีขึ้น โดยเจาะเลือดด้วยตนเองแล้วพบว่าระดับน้ำตาลในเลือดสูงมาก ให้รีบมาพบแพทย์  \n
4.หากอาการดีขึ้น ควรตรวจเลือด และปัสสาวะซ้ำทุก 4 ชม. รวมถึงดื่มน้ำสะอาดมากๆ  \n
5.หากมีอาการชักกระตุกเฉพาะที่ หรือมีอาการซึม และมีระดับน้ำตาลในเลือดมาก ให้พบแพทย์ทันที`;

const Ghigh = '1.ผักสีเขียวและผลไม้ที่มีใยอาหาร: เช่น สะตอ, ผักบุ้ง, ถั่วฝักยาว, แตงกวา, และแอปเปิ้ล เป็นต้น เพราะมีใยอาหารช่วยลดการดูดซึมน้ำตาลในเลือด  2.โปรตีนเสริม: เช่น เนื้อไก่, เนื้อปลา, ถั่วเหลือง, และเกาะหลังปู เป็นต้น เพื่อช่วยควบคุมระดับน้ำตาลในเลือดและส่งเสริมการเติบโตของกล้ามเนื้อ  3.ไขมันดี: เลือกไขมันที่ดีเช่น น้ำมันมะกอก, น้ำมันมะพร้าว, และน้ำมันมะกอกบราสิล เป็นต้น เพื่อควบคุมการดูดซึมน้ำตาลในเลือด  4.คาร์โบไฮเดรตที่มีคุณค่า: เลือกคาร์โบไฮเดรตที่มีคุณค่าเช่น ข้าวสุก, โปรตีนอาร์ติโชกับข้าว, และข้าวโอทสุก เพื่อควบคุมการดูดซึมน้ำตาลในเลือด';

const Bhigh = 'อาหารที่มีน้ำตาลและคาร์โบไฮเดรตสูง: เช่น ขนมหวาน, อาหารที่มีน้ำตาลและคาร์โบไฮเดรตสูงส่วนมาก  อาหารที่มีไขมันไม่ดี: เช่น อาหารที่มีไขมันสูง, อาหารที่ทำจากน้ำมันประกอบด้วยไขมันที่ไม่ดีต่อสุขภาพ  อาหารที่มีความเค็มสูง: เช่น อาหารที่มีการใช้เกลือสูง อาจส่งผลกระทบต่อความสมดุลของน้ำตาลในเลือด';



const bgColor = '#f36c60';
  

const textColor = 'darkred'; // สีแดงเข้ม
  


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
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>

        <p :style="{ color: textColor }" class="text-4xl font-bold text-center mt-5">{{ sugarLevelText }}</p>
      </div>




      <div class="my-5 p-10 bg-white box-border rounded-lg shadow-lg shadow-gray-300/50">
        <b>
          คำแนะนำการปฏิบัติตัวเบื้องต้น
        </b>
        <div>{{ high }}</div>
        <br>
        <b>
          อาหารที่ควรรับประทาน
        </b>
        <div>{{ Ghigh }}</div>
        <br>
        <b>
          อาหารที่ควรหลีกเลี่ยงหรือลดการบริโภค
        </b>
        <div>{{ Bhigh }}</div>
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