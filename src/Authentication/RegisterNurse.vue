<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import Swal from "sweetalert2";
import Header from '../layouts/Header.vue';

const name = ref("");
const professional_id = ref("");
const password = ref("");
const passwordcheck = ref("");

const passwordInput = ref(null);
const passwordCheckInput = ref(null);

const appRouter = useRouter();

const registernurse = async () => {
  const res = await fetch(`${import.meta.env.VITE_BASE_URL}api/nurse/register`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      name: name.value,
      professional_id: professional_id.value,
      password: password.value,
      password_confirmation: passwordcheck.value,
    }),
  });
  // ตรวจสอบข้อมูลที่คืนกลับจาก API ด้วยการแสดงผลในคอนโซล
  console.log("Response from server:", res);
  
  if (res.status === 200) {
    Swal.fire("คุณสร้างบัญชีสำเร็จ!");
    setTimeout(function () {
      appRouter.push({ name: "loginNurse" }); // แก้ไขตรงนี้เป็นการเรียกใช้งาน Vue Router
    }, 1500);
    console.log("You add user success");
  } else {
    console.log("error,cannot add");
    Swal.fire({
      icon: "error",
      title: "ขอโทษ !!!",
      text: "ไม่สามารถสร้างบัญชีได้ โปรดตรวจสอบความถูกต้อง!",
    });
  }
};


const checkinputprofessional = () => {
  const idp = professional_id.value;
  const isNumeric = /^\d+$/.test(idp);
  if(idp) {
    if (idp.length === 0) {
      professional_id.value = null;
    Swal.fire("โปรดใส่เลขบัตรประชาชน");
  }
  if (idp.length < 10) {
    professional_id.value = null;
    Swal.fire("เลขบัตรประชาชนต้องมี 10 หลัก");
  } else if (!isNumeric) {
    professional_id.value = null;
    Swal.fire("เลขบัตรประชาชนต้องเป็นตัวเลขเท่านั้น");
  }

  }
  
};

const checkmatch = () => {
  const pass = password.value;
  const passcheck = passwordcheck.value;
  if (passwordInput.value && passwordCheckInput.value) {
    if (pass === passcheck) {
      passwordInput.value.style.backgroundColor = "#e9f7e3";
      passwordCheckInput.value.style.backgroundColor = "#e9f7e3";
    } else {
      passwordInput.value.style.backgroundColor = "#fae2e0";
      passwordCheckInput.value.style.backgroundColor = "#fae2e0";
    }
  }
};

const checkinputpassword = () => {
  const pass = password.value;
  const passcheck = passwordcheck.value;
  const passRegex = /^(?=.*\d)(?=.*[a-zA-Zก-๙]).{8,}$/;

  if (pass.length === 0) {
    password.value = null;
    passwordcheck.value = null;
    Swal.fire("โปรดใส่รหัสผ่าน");
  } else if (pass.length < 8 || !passRegex.test(pass)) {
    password.value = null;
    passwordcheck.value = null;
    Swal.fire("รหัสผ่านต้องประกอบด้วยตัวเลข อักขระพิเศษ และตัวอักษร ที่มีความยาวมากกว่า 8 ตัวอักษร");
  } else if (passcheck !== pass) {
    password.value = null;
    passwordcheck.value = null;
    Swal.fire("รหัสผ่านไม่ตรงกัน");
  }

  if (name.value.length === 0) {
    name.value = null;
    Swal.fire("โปรดใส่ชื่อผู้ใช้");
  }

  if (professional_id.value.length === 0) {
    professional_id.value = null;
    Swal.fire("โปรดใส่เลขใบประกอบวิชาชีพ");
  }
};





const close = () => appRouter.push({ name: "loginNurse" });


</script>

<template>
 <div class="container mx-auto">
   <Header></Header>
  <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto my-28 lg:py-0">
      <div class="w-full rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 bg-white">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1  class="text-xl font-bold text-center leading-tight tracking-tight text-gray-900 md:text-2xl">
                ลงทะเบียนสำหรับพยาบาล
              </h1>
              <form class="space-y-4 md:space-y-6" >
                  <div>
                      <label 
                      class="block mb-2 text-sm font-medium text-gray-900">ชื่อผู้ใช้งาน
                      &nbsp;
                      <span style="font-size: 10px; color: rgb(177, 109, 241)">
                      ( ตัวอักษรต้องไม่เกิน 100 ตัวอักษร )
                      </span>
                      </label>
                      <input 
                      type="text"
                      class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="xxxxxxxxxx" 
                      v-model.trim="name"
                      maxlength="100"
                      >
                       <p v-if="name" class="input-count">
                      {{ name.length }}/100
                      </p>
                      <p v-if="name.length < 1">
                      * Please input your name <span></span>
                      </p>
                      <p v-if="name.length > 100" >
                      * Characters must not exceed 100
                      </p>

                  </div>

                  

                    <div>
                      <label 
                      class="block mb-2 text-sm font-medium text-gray-900">เลขใบประกอบวิชาชีพ
                      &nbsp;
                      <span style="font-size: 10px; color: rgb(177, 109, 241)">
                      ( ตัวอักษรต้องไม่เกิน 10 ตัวอักษร )
                      </span></label>
                      <input 
                      type="text"
                      v-model.trim="professional_id"
                      placeholder="xxxxxxxx" 
                      maxlength="10"
                      @blur="checkinputprofessional"
                      class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                      <div v-if="professional_id">
                        <p class="input-count">
                          {{ professional_id.length }}/10
                        </p>
                        <p v-show="professional_id.length < 1" >
                          * Please input your professional_id  <span></span>
                        </p>
                        <p v-show="professional_id.length > 100" >
                          * Characters must not exceed 10
                        </p>
                      </div>
                     
                      </div>



                      <div>
                      <label  
                      class="block mb-2 text-sm font-medium text-gray-900">รหัสผ่าน</label>
                      <input 
                      placeholder="xxxxxxxx" 
                      class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      type="password"
                      name="password"
                      v-model.trim="password"
                      maxlength="14"
                      minlength="8"
                      >

                      <div v-if="password">
                        <p class="input-count" id="count">
                          {{ password.length }}/14
                        </p>
                        <p v-show="password.length < 8" id="checkname">
                          * Password must not be less than 8 characters
                        </p>
                        <p v-show="password.length > 14" id="checkname">
                          * Password must not be more than 14 characters
                        </p>

                      </div>
                     
                      </div>


                  <div v-show="password">
                      <label 
                      class="block mb-2 text-sm font-medium text-gray-900">ยืนยันรหัสผ่าน</label>
                     <input 
                     placeholder="xxxxxxxx" 
                     class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                     type="password"
                     name="passwordcheck"
                     v-model="passwordcheck"
                     maxlength="14"
                     minlength="8"
                     @keyup="checkmatch"
                     @blur="checkinputpassword"
                      >
                      <div v-if="passwordcheck">
                        <p class="input-count">{{ passwordcheck.length }}/14</p>
                        <p v-show="passwordcheck.length < 8" class="checkname">* Password must be at least 8 characters long</p>
                        <p v-show="passwordcheck.length > 14" class="checkname">* Password must not exceed 14 characters</p>
                      </div>
                     </div>

                


                    <button
                    class="block w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 px-4 mb-4 border rounded"
                    @click.prevent="registernurse"
                    :disabled="!name || !professional_id || !password" >
                    สร้างบัญชี
                   </button>
                  <div class="text-center">
              <router-link :to="{ name: 'loginNurse' }">
                <p class="text-sm font-medium text-gray-500">
                   คุณมีบัญชีอยู่แล้ว? 
                  <a
                    class="font-bold text-primary-600 hover:underline text-indigo-800"
                    >เข้าสู่ระบบ ที่นี้</a
                  >
                </p>
              </router-link>
              </div>

              </form>
          </div>
      </div>
  </div>
</div>


</template>
 
<style>
.bg-blue-900:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  /* เปลี่ยนเป็น cursor ปีกหลุดเพื่อแสดงว่าปุ่มไม่สามารถคลิกได้ */
}
</style>