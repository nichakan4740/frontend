<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Sidebar from "../components/Sidebar.vue";
const showMenu = ref(false);

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

// ฟังก์ชันสำหรับการ logout ของ ผู้ป่วย
const logoutpatient = () => {
  // ลบ JWT จาก localStorage หรือตำแหน่งที่คุณเก็บ token
  localStorage.removeItem('idcard');
  localStorage.removeItem('accesstoken');
  localStorage.removeItem('fname');
   localStorage.removeItem('lname');
  localStorage.removeItem('iduser');
  backloginpatient()
};
const appRouter = useRouter();
const backloginpatient = () => appRouter.push({ name: "homerole" });

const fname = localStorage.getItem("fname");

</script>

<template>
  <div>
    <nav class="bg-white shadow-lg shadow-slate-300/60 sticky top-0  ">
      <!-- Primary Navigation Menu -->
      <!-- user -->
      <button class="float-right mr-2">

        <img src="/user.png" class="w-10 h-10  mr-10 mt-3 shadow-md rounded-full" @click="toggleMenu" />
      </button>

      <!-- Hamburger Menu -->
      <div v-if="showMenu" class="menu">
        <!-- เพิ่มเนื้อหาของเมนูที่นี่ -->
        <router-link :to="'/informationUser/'">
          <p>ข้อมูลส่วนตัว</p>
        </router-link>
        <p @click="logoutpatient">ออกจากระบบ</p>
      </div>
      
      <!-- <router-link :to="{ name: 'home' }">
        <button type="button"
        class="float-right shadow-xs text-blue-800 border border-blue-800 bg-white hover:bg-blue-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2.5 text-center mt-3 mr-8 me-2 mb-2 dark:bg-blue-600 :hover:bg-white dark:focus:ring-blue-800">
        เพิ่มการบันทึก
      </button>
    </router-link> -->
    
    <div>
      
      <div class="flex justify-between h-16">
        
        <!-- sidebar-->
        <Sidebar />
        <div class="hidden sm:flex sm:items-center sm:ml-6">
            <div class>{{fname}}</div>

            <!-- Settings Dropdown -->
            <div class="ml-3 relative"> </div>
          </div>
          <!-- Hamburger จอเล็ก -->
          <div class="-mr-2 flex items-center sm:hidden">
            <button class="bg-blue-100 text-tahiti rounded">
              <!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-7 h-7">
                <path
                  d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                <path
                  d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
              </svg> -->
            </button>
          </div>
        </div>
      </div>


    </nav>
    <!-- Page Heading -->
    <header class="bg-white shadow" v-if="$slots.header">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <slot name="header" />
      </div>
    </header>

    <!-- Page Content -->
    <main>
      <slot />
    </main>




  </div>
</template>

<style>
.menu {
  position: absolute;
  top: 50px;
  right: 10px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 8%;
  box-shadow: 8px;
  padding: 10px;
  z-index: 1000;
}
</style>
