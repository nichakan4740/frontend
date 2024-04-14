<script setup>
import { useRouter } from "vue-router";
import { ref, onBeforeMount } from "vue";
import Swal from "sweetalert2";
import Spinner from "./Spinner.vue"
import Header from '../layouts/Header.vue';
const idcard = ref('');
const password = ref('');
const loading = ref(false);



const loginpatient = async () => {
  loading.value = true;
  try {
    const res = await 
    fetch(`http://cp23ssa2.sit.kmutt.ac.th:8000/api/patient/login`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        idcard: idcard.value,
        password: password.value,
      }),
    });

    if (res.status === 200) {
      const response = await res.json();
      localStorage.setItem("idcard", response.user.idcard);
      localStorage.setItem("iduser", response.user.id);
      localStorage.setItem("name", response.user.fname);
      localStorage.setItem("lname", response.user.lname);
      localStorage.setItem("dob", response.user.dob);
      localStorage.setItem("phone", response.user.phone);
      localStorage.setItem("address", response.user.address);
      localStorage.setItem("accesstoken", response.authorisation.token);

      Swal.fire({
        icon: "success",
        title: "เข้าสู่ระบบสำเร็จ!",
        showConfirmButton: false,
      });

      setTimeout(() => {
        close();
        Swal.close(); // Close the current popup
      }, 2000);
        console.log("You login success");
      // }, 1000);
    } else if (res.status === 404) {
      Swal.fire({
        icon: "error",
        title: "ขอโทษ!!!",
        text: "เลขบัตรประจำตัวประชาชนไม่ถูกต้อง!",
      });
      console.log("The professional number is incorrect.");
    } else if (res.status === 401) {
      Swal.fire({
        icon: "error",
        title: "ขอโทษ !!!",
        text: "รหัสผ่านไม่ถูกต้อง โปรดใส่ใหม่",
      });
      console.log("Password Not Matched");
    }



  } catch (error) {
    console.error('Error during login:', error);
  } finally {
    loading.value = false; // Set loading to false regardless of success or failure
  }
};


const appRouter = useRouter();
const close = () => appRouter.push({ name: "home" });

</script>

<template>
  <div class="container mx-auto">
     <Header></Header>
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto my-8 md:h-screen lg:py-0">
      <div class="w-full rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 bg-white">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 class="text-xl font-bold text-center leading-tight tracking-tight text-gray-900 md:text-2xl">
            การเข้าสู่ระบบสำหรับผู้ใช้ทั่วไป
          </h1>
          <form class="space-y-4 md:space-y-6" action="#">
            <div>
              <label for="idcard" class="block mb-2 text-sm font-medium text-gray-900">เลขบัตรประจำตัวประชาชน</label>
              <input type="text" name="idcard" id="idcard"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="xxxxxxxxxxxxx" v-model.trim="idcard" required="" maxlength="13"/>
            </div>

            <div>
              <label for="password" class="block mb-2 text-sm font-medium text-gray-900">Password</label>
              <input type="password" name="password" id="password" placeholder="xxxxxxxx"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                maxlength="14" minlength="8" v-model.trim="password" required="" />
            </div>

            <div>
              <button @click.prevent="loginpatient"
                class="block w-full bg-blue-900 text-white font-bold py-2 px-4 mb-4 border rounded"
                :disabled="!idcard || !password" :class="{ 'bg-blue-900': !idcard || !password }">

                เข้าสู่ระบบ
              </button>
            </div>

            <div class="text-center">
              <router-link :to="{ name: 'registerPatient' }">
                <p class="text-sm font-medium text-gray-500">
                  คุณไม่ม่บัญชีใช่หรือไม่?
                  <a class="font-bold text-primary-600 hover:underline text-indigo-800">โปรดลงทะเบียน</a>
                </p>
              </router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <Spinner :loading="loading"></Spinner>
</template>

<style>
.bg-blue-900:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  /* เปลี่ยนเป็น cursor ปีกหลุดเพื่อแสดงว่าปุ่มไม่สามารถคลิกได้ */
}
</style>