<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import Swal from "sweetalert2";
import Header from '../layouts/Header.vue';

const fname = ref("");
const lname = ref("");
// const allergic_drug = ref("");
// const my_drug = ref("");
const idcard = ref("");
const password = ref("");
const passwordcheck = ref("");

const registerpatient = async () => {
  const res = await fetch(
    `${import.meta.env.VITE_BASE_URL}api/patient/register`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        fname: fname.value,
        lname: lname.value,
        // allergic_drug : allergic_drug.value,
        // my_drug :  my_drug .value,
        idcard:  idcard.value,
        password: password.value,
      }),
    }
  );
  if (res.status === 200) {
    Swal.fire("คุณสร้างบัญชีสำเร็จ!");
    setTimeout(function () {
      close();
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

const checkmatch = () => {
  const pass = password.value;
  const passcheck = passwordcheck.value;
  if (pass === passcheck) {
    document.getElementById("password").style.backgroundColor = "#e9f7e3";
    document.getElementById("passwordcheck").style.backgroundColor = "#e9f7e3";
  } else {
    document.getElementById("password").style.backgroundColor = "#fae2e0";
    document.getElementById("passwordcheck").style.backgroundColor = "#fae2e0";
  }
};

const checkinputpassword = () => {
  const pass = password.value;
  const passcheck = passwordcheck.value;
  if (pass.length === 0) {
    password.value = null;
    Swal.fire("โปรดใส่รหัสผ่าน");
  }
  if (pass.length < 8) {
    password.value = null;
    Swal.fire("รหัสผ่านต้องมีความยาวมากกว่า 8 ตัวอักษร");
  }
  if (passcheck !== pass) {
    password.value = null;
    Swal.fire("รหัสผ่านไม่ตรงกัน");
  }
};

const checkinputidcard = () => {
  const idc = idcard.value;
  const isNumeric = /^\d+$/.test(idc);
  if (idc.length === 0) {
    idcard.value = null;
    Swal.fire("โปรดใส่เลขบัตรประชาชน");
  }
  if (idc.length < 13) {
    idcard.value = null;
    Swal.fire("เลขบัตรประชาชนต้องมี 13 หลัก");
  } else if (!isNumeric) {
    idcard.value = null;
    Swal.fire("เลขบัตรประชาชนต้องเป็นตัวเลขเท่านั้น");
  }
};

const appRouter = useRouter();
const close = () => appRouter.push({ name: "loginPatient" });
</script>

<template>
  <div class="container mx-auto ">
    <Header></Header>
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto my-28 lg:py-0">
      <div class="w-full rounded-xl shadow dark:border md:mt-0 sm:max-w-md xl:p-0 bg-white">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8 ">
          <h1 class="text-xl font-bold text-center leading-tight tracking-tight text-gray-900 md:text-2xl">
            ลงทะเบียนสำหรับบุคคลทั่วไป
          </h1>
          <form class="space-y-4 md:space-y-6">


<!-- ชื่อ --------------------------------------------------------------------------- -->
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-900">ชื่อ &nbsp;
                <span style="font-size: 10px; color: rgb(177, 109, 241)">
                  ( ตัวอักษรต้องไม่เกิน 100 ตัวอักษร )
                </span>
              </label>
              <input
                type="text"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="xxxxxxxxxx"
                v-model.trim="fname"
                maxlength="100"
              />
              <p v-if="fname.length" class="input-count"> {{ fname.length }}/100</p>
              <p v-show="fname.length < 1">* Please input your name <span></span></p>
              <p v-show="fname.length > 100">* Characters must not exceed 100</p>
            </div>
  <!-- นามสกุล --------------------------------------------------------------------------- -->


              <div>
              <label class="block mb-2 text-sm font-medium text-gray-900">นามสกุล &nbsp;
                <span style="font-size: 10px; color: rgb(177, 109, 241)">
                  ( ตัวอักษรต้องไม่เกิน 100 ตัวอักษร )
                </span>
              </label>
              <input
                type="text"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="xxxxxxxxxx"
                v-model.trim="lname"
                maxlength="100"
              />
              <p v-if="lname.length" class="input-count"> {{ lname.length }}/100 </p>
              <p v-show="lname.length < 1"> * Please input your last name <span></span></p>
              <p v-show="lname.length > 100">* Characters must not exceed 100</p>
            </div>
  <!-- ยาที่แพ้--------------------------------------------------------------------------- -->

            <!-- <div>
              <label class="block mb-2 text-sm font-medium text-gray-900">ยาที่แพ้ &nbsp;
                <span style="font-size: 10px; color: rgb(177, 109, 241)">
                  ( ตัวอักษรต้องไม่เกิน 100 ตัวอักษร )
                </span>
              </label>
              <input
                type="text"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="xxxxxxxxxx"
                v-model.trim="allergic_drug"
                maxlength="100"
              />
              <p v-if="allergic_drug.length" class="input-count">{{ allergic_drug.length }}/100</p>
              <p v-show="allergic_drug.length < 1"> * Please input your name <span></span></p>
              <p v-show="allergic_drug.length > 100">* Characters must not exceed 100</p>
            </div> -->
            
            
  <!-- ยาประจำ--------------------------------------------------------------------------- -->

             <!-- <div>
              <label class="block mb-2 text-sm font-medium text-gray-900">ยาประจำตัวที่ใช้ &nbsp;
                <span style="font-size: 10px; color: rgb(177, 109, 241)">
                  ( ตัวอักษรต้องไม่เกิน 100 ตัวอักษร )
                </span>
              </label>
              <input
                type="text"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="xxxxxxxxxx"
                v-model.trim=" my_drug"
                maxlength="100"
              />
              <p v-if=" my_drug.length" class="input-count">{{ my_drug.length }}/100 </p>
              <p v-show="my_drug.length < 1"> * Please input your name <span></span> </p>
              <p v-show="my_drug.length > 100">* Characters must not exceed 100</p>
            </div> -->
  <!-- บัตรประชาชน--------------------------------------------------------------------------- -->



            <div>
              <label class="block mb-2 text-sm font-medium text-gray-900">เลขบัตรประจำตัวประชาชน</label>
              <input
                type="text"
                inputmode="numeric"
                v-model.trim="idcard"
                placeholder="xxxxxxxxxxxxx"
                maxlength="13"
                @blur="checkinputidcard"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              <p v-if="idcard .length" class="input-count"> {{ idcard .length }}/13</p>
              <p v-show="idcard .length < 13">  * Please input your id_card <span></span></p>
              <p v-show="idcard .length > 13"> * Characters must not exceed 13</p>
            </div>
  <!-- รหัส--------------------------------------------------------------------------- -->



            <div>
              <label class="block mb-2 text-sm font-medium text-gray-900" >รหัสผ่าน</label>
              <input
                placeholder="xxxxxxxx"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="password"
                name="password"
                v-model.trim="password"
                maxlength="14"
                minlength="8"
              />
              <p v-if="password" class="input-count" id="count"> {{ password.length }}/14 </p>
              <p v-show="password.length < 8" id="checkname"> * Password must not be less than 8 characters</p>
              <p v-show="password.length > 14" id="checkname">* Password must not be more than 14 characters</p>
            </div>



            <div v-show="password.length >= 1">
              <label class="block mb-2 text-sm font-medium text-gray-900">ยืนยันรหัสผ่าน</label>
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
              />
              <p v-if="passwordcheck" class="input-count"> {{ passwordcheck.length }}/14 </p>
              <p v-show="passwordcheck.length < 8" class="checkname">* Password must be at least 8 characters long</p>
              <p v-show="passwordcheck.length > 14" class="checkname">* Password must not exceed 14 characters</p>
            </div>

            <button
              class="block w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 px-4 mb-4 border rounded"
              @click.prevent="registerpatient " 
              :disabled="!fname || !lname || !idcard || !password || !passwordcheck || idcard.length !== 13"
              :class="{ 'bg-blue-900': !idcard || !password }"> สร้างบัญชี
              
            </button>


            <div class="text-center">
              <router-link :to="{ name: 'loginPatient' }">
                <p class="text-sm font-medium text-gray-500">
                  คุณมีบัญชีอยู่แล้ว?  
                 <a class="font-bold text-primary-600 hover:underline text-indigo-800">เข้าสู่ระบบ ที่นี้</a >
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
  /* สีแดงตามที่คุณต้องการ */
  cursor: not-allowed;
  /* เปลี่ยนเป็น cursor ปีกหลุดเพื่อแสดงว่าปุ่มไม่สามารถคลิกได้ */
}
.form-container {
  overflow-y: auto;
}
</style>
