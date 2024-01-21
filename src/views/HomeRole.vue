<script setup>

</script>
 
<template>

<div class="container mx-auto">

    <router-link :to="{ name: 'register' }">
      <button
        type="button"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
      พยาบาล
      </button>
    </router-link>



       <router-link :to="{ name: 'register' }">
      <button
        type="button"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
      ผู้ป่วย
      </button>
   
    </router-link>
</div>

</template>
 
<style>

</style>