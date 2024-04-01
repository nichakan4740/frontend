<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import Header from '../layouts/Header.vue';
import Footer from '../layouts/Footer.vue';
</script>

<template>

  <div class="bg-white">
 <Header></Header>
    <div class="relative isolate px-6 pt-14 lg:px-8">
      <div
        class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style="
            clip-path: polygon(
              74.1% 44.1%,
              100% 61.6%,
              97.5% 26.9%,
              85.5% 0.1%,
              80.7% 2%,
              72.5% 32.5%,
              60.2% 62.4%,
              52.4% 68.1%,
              47.5% 58.3%,
              45.2% 34.5%,
              27.5% 76.7%,
              0.1% 64.9%,
              17.9% 100%,
              27.6% 76.8%,
              76.1% 97.7%,
              74.1% 44.1%
            );
          "
        />
      </div>
      <div
        class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)] mt-80"
        aria-hidden="true"
      >
        <div
          class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style="
            clip-path: polygon(
              74.1% 44.1%,
              100% 61.6%,
              97.5% 26.9%,
              85.5% 0.1%,
              80.7% 2%,
              72.5% 32.5%,
              60.2% 62.4%,
              52.4% 68.1%,
              47.5% 58.3%,
              45.2% 34.5%,
              27.5% 76.7%,
              0.1% 64.9%,
              17.9% 100%,
              27.6% 76.8%,
              76.1% 97.7%,
              74.1% 44.1%
            );
          "
        />
      </div>
    </div>
      <div class="mx-auto max-w-2xl py-32 sm:py-32 lg:py-36">
        <div class="hidden sm:mb-8 sm:flex sm:justify-center">
         
        </div>
        <div class="text-center">
          <h1
            class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
          >
            Tele-Nursing System  ระบบพยาบาลทางไกล
          </h1>
          <p class="mt-6 text-lg leading-8 text-gray-600">
            โปรดเลือกใช้งาน
          </p>
          <div class="mt-10 flex items-center justify-center gap-x-6">
         
        <router-link :to="{ name: 'loginNurse' }" >
        <button
        type="button"
        class=" block w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 px-4 mb-4 border rounded"
      >
        เข้าใช้งานสำหรับพยาบาล
      </button>
     
      </router-link>

  <router-link :to="{ name: 'loginPatient' }">
      <button
        type="button"
        class=" block w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 px-4 mb-4 border rounded"
      >
        เข้าใช้งานสำหรับบุคคลทั่วไป
      </button>

    </router-link>

          </div>
        </div>
      </div>
      
    </div>
  <Footer></Footer>
  
</template>

<style></style>
