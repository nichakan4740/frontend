<script setup>
import { computed, ref } from "vue";
defineEmits(["createevent"]);

// const id = ref('')
const Name = ref('')
const Email = ref()
const CategoryID = ref('')
const Notes = ref()
const StartTime = ref('2022-01-01T12:00')

const StartTimeISO = computed(() => {
  return new Date(StartTime.value).toISOString('utc')
})

const Duration = ref('')

</script>

<template>
  <div class="modal-body">
    
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
      <select class="form-select" v-model="CategoryID">
        <option value="1">Project Management Clinic</option>
        <option value="2">DevOps-Infra Clinic</option>
        <option value="3">Database Clinic</option>
        <option value="4">Client-side Clinic</option>
        <option value="5">Server-side Clinic</option>
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
      <input type="datetime-local" class="form-control" v-model="StartTime" />
    </div>
    <br />

    <div class="bg-light p-3 rounded">
      <p class="text">Duration</p>
      <input type="number" class="form-control" v-model="Duration" />
    </div>
    
  </div>

  <div class="modal-footer">
    <div
      class="addbooking"
      @click="
        $emit(
          'createevent',
          Name,
          Email,
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
