<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import SidebarNurse from "../components/SidebarNurse.vue";

// ฟังก์ชันสำหรับการ logout พยาบาล
const router = useRouter();
const logout = () => {
  localStorage.removeItem('professional_id');
  localStorage.removeItem('accesstoken');
  localStorage.removeItem('idadmin');
  localStorage.removeItem('name');
  backloginnurse()
};
const appRouter = useRouter();
const  backloginnurse = () => appRouter.push({ name: "homerole" });





// ดึงข้อมูล name จาก Local Storage
const name = localStorage.getItem("name");




const showMenu = ref(false);

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};
</script>

<template>
  <div>
    <nav class="bg-white shadow-lg shadow-slate-300/60 sticky top-0  ">
      <!-- Primary Navigation Menu -->
      <!-- user -->
      <button class="float-right">

        <img src="/user.png" class="w-10 h-10  mr-10 mt-3 shadow-md rounded-full" @click="toggleMenu" />
      </button>

      <!-- Hamburger Menu -->
      <div v-if="showMenu" class="menu">
        <!-- เพิ่มเนื้อหาของเมนูที่นี่ -->
        <!-- <p>Profile</p> -->
        <p @click="logout">ออกจากระบบ</p>
      </div>

       
      <div>

        <div class="flex justify-between h-16">

          <!-- sidebar-->
          <SidebarNurse/>
          <div class="hidden sm:flex sm:items-center sm:ml-6">

        <div>{{ name }} </div>
     
            <!-- Settings Dropdown -->
            <div class="ml-3 relative"> </div>
          </div>
           
        </div>
      </div>


    </nav>
    <!-- Page Heading -->
    <header class="bg-white shadow" v-if="$slots.header">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <slot name="header"/>
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
  /* ปรับตำแหน่งตามที่คุณต้องการ */
  right: 10px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 8%;
  box-shadow: 8px;
  padding: 10px;
  z-index: 1000;
  /* ให้เป็นหน้ากว่า */
}
</style>
