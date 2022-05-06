<script setup>
import { computed, ref } from "vue";
defineEmits(["createevent"]);

// const props = defineProps({
//   currentbooking:{
//     type: Object,
//     default:{}
//   }
// })
// console.log(props.currentbooking)

// const newbooking = computed(() =>{
//   return{
//    id: props.currentbooking.id,
//    bookingName: props.currentbooking.bookingName,
//    eventEmail: props.currentbooking.eventEmail,
//    eventCategory: props.currentbooking.eventCategory,
//    eventStartTime: props.currentbooking.eventStartTime,
//    eventDuration: props.currentbooking.eventDuration,
//    eventNotes:props.currentbooking.eventNotes
//   }
// })
// console.log(newbooking.value)

const id = ref("");
const Name = ref("");
const Email = ref();
const Category = ref("");
const Notes = ref();
const StartTime = ref("2022-04-26T15:30");

const StartTimeISO = computed(() => {
  return new Date(StartTime.value).toISOString();
});

const Duration = ref("");
const CategoryID = ref("");

</script>

<template>
  <div class="modal-body">
    <div class="bg-light p-3 rounded">
      <p class="text">id</p>
      <input type="number" class="form-control" v-model="id" />
    </div>
    <br />

    <div class="bg-light p-3 rounded">
      <p class="text">Name</p>
      <input type="text" class="form-control" v-model="Name" />
    </div>
    <br />

    <div class="bg-light p-3 rounded">
      <p class="text">Email</p>
      <input type="text" class="form-control" v-model="Email" />
    </div>
    <br />

    <div class="bg-light p-3 rounded">
      <p class="text">CategoryName</p>
      <select class="form-select" v-model="Category">
        <option>Project Management Clinic</option>
        <option>Database Clinic</option>
        <option>DevOps-Infra Clinic</option>
        <option>Front-End Clinic</option>
        <option>BackEnd Clinic</option>
        <option>Business Requirements</option>
      </select>
    </div>
    <br />

    <div class="bg-light p-3 rounded">
      <p class="text">Notes</p>
      <input type="text" class="form-control" v-model="Notes" />
    </div>
    <br />

    <div class="bg-light p-3 rounded">
      <p class="text">StartTimes</p>
      <!--    <input type="text" class="form-control" v-model="StartTime" /> -->
      <input type="datetime-local" class="form-control" v-model="StartTime" />
    </div>
    <br />

    <div class="bg-light p-3 rounded">
      <p class="text">Duration</p>
      <input type="number" class="form-control" v-model="Duration" />
    </div>

    <div class="bg-light p-3 rounded">
      <p class="text">eventCategoryID</p>
      <select class="form-select" v-model="CategoryID">
        <option value="1">Project Management Clinic</option>
        <option value="2">Database Clinic</option>
        <option value="3">DevOps-Infra Clinic</option>
        <option value="4">Front-End Clinic</option>
        <option value="5">BackEnd Clinic</option>
        <option value="6">Business Requirements</option>
      </select>
    </div>
  </div>

  <div class="modal-footer">
    <div
      class="addbooking"
      @click="
        $emit(
          'createevent',
          id,
          Name,
          Email,
          Category,
          Notes,
          StartTimeISO,
          Duration,
          CategoryID
        )
      "
    >
      Add Event
    </div>
  </div>
</template>
<style></style>
