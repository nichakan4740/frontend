<script setup>
import { useRouter } from "vue-router";
import { ref ,onBeforeMount} from "vue";
import Swal from "sweetalert2";


const professional_id = ref("");
const password = ref("");
const loginnurse = async (professional_id, password) => {
  const res = await fetch(`${import.meta.env.VITE_BASE_URL}api/nurse/login`, {
    
    method: "POST",
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      professional_id: professional_id,
      password: password
    }),
  })

  if (res.status === 200) {
  const response = await res.json()
  localStorage.setItem('professional_id', response.user.professional_id)
/*   localStorage.setItem('accesstoken', jwt.accessToken)
  localStorage.setItem('refreshtoken', jwt.refreshToken) */
        console.log(response)
        Swal.fire({
        icon: 'success',
        title: 'You login success!',
        showConfirmButton: false,
      })
    setTimeout(function () {
    }, 1000); 
    close();
    console.log("You login success");

  }

  if (res.status === 404) {
    Swal.fire({
      icon: "error",
      title: "Sorry !!!",
      text: "Email dose not exist!",
    });
    console.log("Email dose not exist");
  }
  if (res.status === 401) {
    Swal.fire({
      icon: "error",
      title: "Sorry !!!",
      text: "Incorrect password!",
    });
    console.log("Password Not Matched");
  }
};

const appRouter = useRouter();
const close = () => appRouter.push({ name: "home" });


</script>

<template>
<div class="container mx-auto">
  <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <p class="flex items-center mb-6 text-2xl font-semibold text-gray-900 ">
          Tele-Nursing System  
      </p>
       <p class="flex items-center mb-6 text-2xl font-semibold text-gray-900 ">
          ระบบพยาบาลทางไกล
      </p>

      <div class="w-full  rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 bg-white ">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 class="text-xl font-bold text-center leading-tight tracking-tight text-gray-900 md:text-2xl ">
                  การเข้าสู่ระบบของพยาบาลพยาบาล
              </h1>
              <form class="space-y-4 md:space-y-6" action="#">
                  <div>
                      <label for="professional_id" class="block mb-2 text-sm font-medium text-gray-900 ">เลขใบประกอบวิชาชีพพยาบาล</label>
                      <input type="professional_id" 
                      name="professional_id" 
                      id="professional_id" 
                      class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5   dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                      placeholder="xxxxxxxxxxx"
                      v-model.trim="professional_id" 
                      required="">
                  </div>

                  
                  <div>
                      <label for="password" class="block mb-2 text-sm font-medium text-gray-900 ">Password</label>
                      <input type="password" 
                      name="password" 
                      id="password" 
                      placeholder="xxxxxxxx" 
                      class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5   dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                      maxlength="14"
                      minlength="8"
                      v-model.trim="password"
                      required="">
                  </div>


                  <div class="flex items-center justify-between">
                      <div class="flex items-start">
                          <div class="flex items-center h-5">
                            <input id="remember" aria-describedby="remember" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required="">
                          </div>
                          <div class="ml-3 text-sm">
                            <label for="remember" class="text-gray-500 dark:text-gray-300">Remember me</label>
                          </div>
                      </div>
                      <a href="#" class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
                  </div>

                <div>
                     <div
                     @click="loginnurse(professional_id, password)"
                     class=" block w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 px-4 mb-4 border rounded">เข้าสู่ระบบ</div>
                </div>
                
    <div class="text-center">
      <router-link :to="{ name: 'registerNurse' }">
      <p class="text-sm font-medium  text-gray-500 ">คุณไม่ม่บัญชีใช่หรือไม่?
      <a class=" font-bold text-primary-600 hover:underline text-indigo-800">โปรดลงทะเบียน</a>
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

</style>
