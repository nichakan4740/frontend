<script setup>
import { ref, computed, onMounted } from "vue";
import Layout from "../layouts/Layout.vue";
import { useRoute } from 'vue-router';


const route = useRoute();
// const sugarValue = parseInt(route.query.sugarValue);
const sugarValue = ref(parseInt(route.query.sugarValue));
console.log(sugarValue.value);

const sugarLevelText = computed(() => {
  if (sugarValue.value < 70) {
    return 'น้ำตาลต่ำ';
  } else if (sugarValue.value >= 70 && sugarValue.value <= 125) {
    return 'น้ำตาลปกติ';
  } else {
    return 'น้ำตาลสูง';
  }
});

const high = `1.ดื่มน้ำสะอาดมากๆ  \n
2.หยุดทํากิจกรรม และนอนพัก  \n
3.หากอาการไม่ดีขึ้น โดยเจาะเลือดด้วยตนเองแล้วพบว่าระดับน้ำตาลในเลือดสูงมาก ให้รีบมาพบแพทย์  \n
4.หากอาการดีขึ้น ควรตรวจเลือด และปัสสาวะซ้ำทุก 4 ชม. รวมถึงดื่มน้ำสะอาดมากๆ  \n
5.หากมีอาการชักกระตุกเฉพาะที่ หรือมีอาการซึม และมีระดับน้ำตาลในเลือดมาก ให้พบแพทย์ทันที`;
const normal = 'การออกกำลังกาย: เริ่มต้นการออกกำลังกายอย่างสม่ำเสมอ เช่น การเดิน, วิ่ง, โยคะ, หรือกิจกรรมทางกายอื่น ๆ อย่างสม่ำเสมอ เพื่อช่วยลดระดับน้ำตาลในเลือด  การตรวจสุขภาพประจำ: ทำการตรวจสุขภาพประจำอย่างสม่ำเสมอ เพื่อตรวจสอบสุขภาพทั่วไปและการตรวจระดับน้ำตาลในเลือดอย่างสม่ำเสมอ  การลดน้ำหนัก (หากจำเป็น): หากมีน้ำหนักที่เกินมา การลดน้ำหนักอาจช่วยลดการดูดซึมน้ำตาลในเลือดได้  ปฏิบัติการเปลี่ยนแปลงพฤติกรรม: การเปลี่ยนแปลงพฤติกรรมที่เป็นประโยชน์ เช่น เลิกสูบบุหรี่, การดื่มเครื่องดื่มที่มีแอลกอฮอล์หรือน้ำตาลสูง, การลดความเครียด, การนอนพักผ่อนที่เพียงพอ เป็นต้น';
const low = 'รับประทานอาหารหวานหรือคาร์โบไฮเดรตที่ออกฤทธิ์เร็ว รอ 15 นาทีแล้วตรวจระดับน้ำตาลในเลือด  หากระดับน้ำตาลในเลือดยังต่ำกว่า 70 มก./ดล. ให้รับประทานอาหารหวาน ๆ เพิ่ม  ทำตามขั้นตอนนี้ซ้ำจนกว่าระดับน้ำตาลในเลือดจะเทียบเท่าหรือสูงกว่า 70 มก./ดล.';

const Ghigh = '1.ผักสีเขียวและผลไม้ที่มีใยอาหาร: เช่น สะตอ, ผักบุ้ง, ถั่วฝักยาว, แตงกวา, และแอปเปิ้ล เป็นต้น เพราะมีใยอาหารช่วยลดการดูดซึมน้ำตาลในเลือด  2.โปรตีนเสริม: เช่น เนื้อไก่, เนื้อปลา, ถั่วเหลือง, และเกาะหลังปู เป็นต้น เพื่อช่วยควบคุมระดับน้ำตาลในเลือดและส่งเสริมการเติบโตของกล้ามเนื้อ  3.ไขมันดี: เลือกไขมันที่ดีเช่น น้ำมันมะกอก, น้ำมันมะพร้าว, และน้ำมันมะกอกบราสิล เป็นต้น เพื่อควบคุมการดูดซึมน้ำตาลในเลือด  4.คาร์โบไฮเดรตที่มีคุณค่า: เลือกคาร์โบไฮเดรตที่มีคุณค่าเช่น ข้าวสุก, โปรตีนอาร์ติโชกับข้าว, และข้าวโอทสุก เพื่อควบคุมการดูดซึมน้ำตาลในเลือด';
const Gnormal = 'การควบคุมอาหาร: รักษาการบริโภคอาหารที่มีความหลากหลายและสมดุล เน้นการรับประทานผักผลไม้, โปรตีน, และไขมันดี เพื่อช่วยควบคุมระดับน้ำตาลในเลือด';
const Glow = 'ตัวอย่างอาหารคาร์โบไฮเดรตออกฤทธ์เร็วในปริมาณ 15 กรัม กล้วยครึ่งผล น้ำผลไม้หรือน้ำอัดลมแบบมีน้ำตาลครึ่งแก้ว น้ำตาล น้ำผึ้ง น้ำเชื่อม 1 ช้อนโต๊ะ เจลกลูโคส 1 หลอด (ดูเอกสารการใช้ยา) ยาเม็ดกลูโคส 3 - 4 เม็ด (ดูเอกสารการใช้ยา)';

const Bhigh = 'อาหารที่มีน้ำตาลและคาร์โบไฮเดรตสูง: เช่น ขนมหวาน, อาหารที่มีน้ำตาลและคาร์โบไฮเดรตสูงส่วนมาก  อาหารที่มีไขมันไม่ดี: เช่น อาหารที่มีไขมันสูง, อาหารที่ทำจากน้ำมันประกอบด้วยไขมันที่ไม่ดีต่อสุขภาพ  อาหารที่มีความเค็มสูง: เช่น อาหารที่มีการใช้เกลือสูง อาจส่งผลกระทบต่อความสมดุลของน้ำตาลในเลือด';
const Bnormal = 'เครื่องดื่มที่ผสมแอลกอฮอล์ รวมทั้งยาดองเหล้า หรือจำกัดการดื่มแอลกอฮอล์ให้เหลือน้อยที่สุด เพราะแอลกอฮอล์อาจมีผลต่อยาที่ใช้ควบคุมเบาหวานและโรคต่างๆ และหลีกเลี่ยงการกินน้ำตาล น้ำอัดลม เครื่องดื่มชูกำลัง ขนมหาน ผลไม้เชื่อมแช่อิ่ม ผลไม้ที่มีรสหวาน ไขมัน สัตว์ เนย มันหมู เนื้อติดมัน เครื่องในสัตว์ หอยนางรม ไข่แดง ครีม กะทิ และอาหารทอด';
const Blow = 'หลีกเลี่ยงการรับประทานอาหารที่มีน้ำตาลและคาร์โบไฮเดรตสูง เช่น ขนมหวาน หรืออาหารที่มีน้ำตาลและคาร์โบไฮเดรตสูงมาก ';

const advice = computed(() => {
  if (sugarValue.value < 70) {
    return low;
  } else if (sugarValue.value >= 70 && sugarValue.value <= 125) {
    return normal;
  } else {
    return high;
  }
});
//อารหารที่ควรกิน Good food
const GFood = computed(() => {
  if (sugarValue.value < 70) {
    return Glow;
  } else if (sugarValue.value >= 70 && sugarValue.value <= 125) {
    return Gnormal;
  } else {
    return Ghigh;
  }
});
//อารหารที่ควรหลีกเลี่ยง Bad food
const BFood = computed(() => {
  if (sugarValue.value < 70) {
    return Blow;
  } else if (sugarValue.value >= 70 && sugarValue.value <= 125) {
    return Bnormal;
  } else {
    return Bhigh;
  }
});

const bgColor = computed(() => {
  if (sugarValue.value < 70) {
    return '#fff59d';
  } else if (sugarValue.value >= 70 && sugarValue.value <= 125) {
    return '#d0f8ce';
  } else {
    return '#f36c60';
  }
});

const textColor = computed(() => {
  if (sugarValue.value < 70) {
    return 'darkgoldenrod'; // สีเหลืองเข้ม
  } else if (sugarValue.value >= 70 && sugarValue.value <= 125) {
    return 'darkgreen'; // สีเขียวเข้ม
  } else {
    return 'darkred'; // สีแดงเข้ม
  }
});


</script>


 
<template>
  <Layout class="bg-gradient-to-b from-blue-100">
    <div class="content">

      <div :style="{ backgroundColor: bgColor, color: textColor }"
        class="box-border rounded-lg mt-5 py-2 flex place-content-center shadow-lg shadow-gray-300/50">

        <div v-if="sugarValue < 70">
          <!-- ใส่คลาสของ Icon Tailwind CSS -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            class="w-20 h-20 flex-1 mr-5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
          </svg>
        </div>

        <div v-else-if="sugarValue >= 70 && sugarValue <= 125">
          <!-- ใส่คลาสของ Icon Tailwind CSS -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            class="w-20 h-20 flex-1 mr-5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
          </svg>
        </div>

        <div v-else>
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
        <div>{{ advice }}</div>
        <br>
        <b>
          อาหารที่ควรรับประทาน
        </b>
        <div>{{ GFood }}</div>
        <br>
        <b>
          อาหารที่ควรหลีกเลี่ยงหรือลดการบริโภค
        </b>
        <div>{{ BFood }}</div>
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