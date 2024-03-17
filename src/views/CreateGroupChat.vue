<script setup>
import { useRouter } from "vue-router";
import { ref, onBeforeMount, computed,onMounted, onUnmounted } from "vue";
import LayoutNurse from '../layouts/LayoutNurse.vue';
import moment from "moment";
import Swal from "sweetalert2";

// State variables
const users = ref([]);
const admins = ref([]);
const selectedPatients = ref([]);
const selectedNurses = ref([]);
const groupName = ref('');

// Fetch users data from API
fetch(`${import.meta.env.VITE_BASE_URL}api/patient/getProfile`)
  .then(response => response.json())
  .then(data => {
    users.value = data; // Assuming data is an array of users
  })
  .catch(error => {
    console.error('Error fetching users:', error);
  });

// Fetch admins data from API
fetch(`${import.meta.env.VITE_BASE_URL}api/nurse/getProfile`)
  .then(response => response.json())
  .then(data => {
    admins.value = data; // Assuming data is an array of admins
  })
  .catch(error => {
    console.error('Error fetching admins:', error);
  });

// Function to create group
const createGroup = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}api/groups`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: groupName.value,
        user_ids: selectedPatients.value,
        admin_id: selectedNurses.value,
      }),
    });

    if (!response.ok) {
      const responseData = await response.json();
      throw new Error(responseData.errors);
    }

    // Group created successfully, handle response
    const groupData = await response.json();
    console.log('Group created:', groupData);

    // Display success message
    await Swal.fire({
      icon: 'success',
      title: 'Group Created',
      text: 'The group has been successfully created.',
    });

    // Perform any additional actions here, such as redirecting or displaying a success message
  } catch (error) {
    console.error('Error creating group:', error);
    // Handle errors here, such as displaying an error message to the user
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'An error occurred while creating the group. Please try again later.',
    });
  }
};


</script>
 


<template>
<LayoutNurse class="bg-gradient-to-b  from-blue-100 ">


<!-- content -->
<div class="container mx-auto">


<div class="container mx-auto">
    <h1 class="text-2xl font-bold mb-4">Create Group</h1>
    
    <div>
      <h2 class="text-lg font-bold mb-2">Select Patients:</h2>
      <div class="space-y-2">
        <template v-for="user in users" :key="user.id">
          <label class="flex items-center">
            <input type="checkbox" v-model="selectedPatients" :value="user.id" class="mr-2">
            <span>{{ user.fname }} {{ user.lname }}   </span>
          </label>
        </template>
      </div>
    </div>

    <div>
      <h2 class="text-lg font-bold mb-2">Select Nurses:</h2>
      <div class="space-y-2">
        <template v-for="admin in admins" :key="admin.id">
          <label class="flex items-center">
            <input type="checkbox" v-model="selectedNurses" :value="admin.id" class="mr-2">
            <span>{{ admin.name }}</span>
          </label>
        </template>
      </div>
    </div>

    <div class="mt-4">
      <label class="block mb-2">
        Group Name:
        <input type="text" v-model="groupName" class="border border-gray-300 rounded-md px-2 py-1">
      </label>
      <button @click="createGroup" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Create Group</button>
    </div>
  </div>

















  </div>
  

  
               
    </LayoutNurse>
</template>
 
<style>

</style>