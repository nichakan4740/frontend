<script setup>
import { useRouter } from "vue-router";
import Dashboard from './views/Dashboard.vue';
import Login from './views/Login.vue';

import Sidebar from './components/Sidebar.vue';

const appRouter = useRouter();
/* const close = () => appRouter.push({ name: "home" });
const signin = () => appRouter.push({ name: "login" }); */
</script>
<template>
  <router-view />
   
</template>