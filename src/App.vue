<script setup>
import { useRouter } from "vue-router";
import Sidebar from './components/Sidebar.vue';
import SidebarNurse from './components/SidebarNurse.vue';

const appRouter = useRouter();
</script>

<template>
  <router-view />
   
</template>