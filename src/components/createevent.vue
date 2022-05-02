<script setup>
import { ref } from "vue";
defineEmits(["createevent"]);

const name = ref('')
const email = ref('')
const categoryname = ref('')
const notes = ref('')
const StartTimes = ref('')
const Duration = ref('')

</script>
 
<template>

<div class="modal-body ">
          
            <div class="bg-light p-3 rounded">
              <p class="text">Name</p>
              <input type="text" class="form-control" v-model="name">
            </div><br>

            <div class="bg-light p-3 rounded">
              <p class="text">Email</p>
              <input type="email" class="form-control" v-model="email">
            </div><br>

            <div class="bg-light p-3 rounded">
              <p class="text">CategoryName</p>
              <input type="text" class="form-control" v-model="categoryname">
            </div><br>

            <div class="bg-light p-3 rounded">
              <p class="text">Notes</p>
              <input type="text" class="form-control" v-model="notes">
            </div><br>

            <div class="bg-light p-3 rounded">
              <p class="text">StartTimes</p>
              <input type="text" class="form-control" v-model="StartTimes"><br>
              <input type="time" class="form-control" v-model="StartTimes">
            </div><br>

            <div class="bg-light p-3 rounded">
              <p class="text">Duration</p>
              <input type="number" class="form-control" v-model="Duration">
            </div>
 
          </div>

          <div class="modal-footer">
            <!-- <div class="addbooking" @click="showSuccessAlert">Add Event</div> -->
            <div class="addbooking" @click="$emit('createevent', name , email , categoryname , notes , StartTimes )">Add Event</div>
          </div>

</template>
 
<style>

</style>