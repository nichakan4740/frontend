<script setup>
import { useRouter } from "vue-router";
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
                      <label for="email" class="block mb-2 text-sm font-medium text-gray-900 ">เลขใบประกอบวิชาชีพพยาบาล</label>
                      <input type="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5   dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="xxxxxxxxxxx" required="">
                  </div>
                  <div>
                      <label for="password" class="block mb-2 text-sm font-medium text-gray-900 ">Password</label>
                      <input type="password" name="password" id="password" placeholder="xxxxxxxx" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5   dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="">
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
                     <button type="submit" class=" block w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 px-4 mb-4 border rounded">เข้าสู่ระบบ</button>
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
