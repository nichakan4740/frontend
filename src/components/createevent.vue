<script setup>
import { computed, ref } from "vue";
import moment from "moment";
defineEmits(["createevent"]);

const Name = ref("");
const Email = ref();
const CategoryID = ref("");
const Notes = ref();
const StartTime = ref("");

const StartTimeISO = computed(() => {
  return new Date(StartTime.value).toISOString("utc");
});

const validation = () => {
  let email = document.getElementById("email").value;
  let pattern = /^[^\s@]+@[^\s@]+\.[^\s]+$/;

  if (email.match(pattern)) {
    form.classList.add("valid");
    form.classList.remove("invalid");
  } else {
    form.classList.remove("valid");
    form.classList.add("invalid");
  }
  if (email == "") {
    form.classList.remove("valid");
    form.classList.remove("invalid");
  }
};

const date = new Date();
const today = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  .toISOString()
  .replace(/\..+/, "");
console.log(today);
</script>

<template>
  <div class="modal-body">
    <div class="bg-light p-3 rounded">
      <p class="text">Name</p>
      <input type="text" class="form-control" v-model="Name" />
    </div>
    <br />

    <!-- <div class="bg-light p-3 rounded">
      <p class="text">Email</p>
      <input type="email" id="email" class="form-control" v-model="Email" :keydown="validation"/>
    </div> -->
    <div class="bg-light p-3 rounded">
      <p class="text">Email</p>
      <form action="#" id="form">
        <div class="input-box">
          <input
            type="email"
            id="email"
            class="form-control"
            placeholder="Ex. kw2@kmutt.ac.th"
            v-on:keydown="validation()"
            v-model="Email"
          />
        </div>
      </form>
    </div>
    <br />

    <div class="bg-light p-3 rounded">
      <p class="text">CategoryName</p>
      <select class="form-select" v-model="CategoryID">
        <option value="1">Project Management Clinic ( 30 minute )</option>
        <option value="2">DevOps-Infra Clinic ( 20 minute )</option>
        <option value="3">Database Clinic ( 15 minute )</option>
        <option value="4">Client-side Clinic ( 30 minute )</option>
        <option value="5">Server-side Clinic ( 30 minute )</option>
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
      <input
        type="datetime-local"
        class="form-control"
        :min="today"
        v-model="StartTime"
      />
    </div>
    <br />
  </div>

  <div class="modal-footer">
    <div
      class="addbooking"
      @click="
        $emit('createevent', Name, Email, Notes, StartTimeISO, CategoryID)
      "
    >
      Add Event
    </div>
  </div>
</template>
<style>
.text-danger {
  font-family: "Ubuntu", sans-serif;
  opacity: 0.5;
  font-size: 12px;
}

#form {
  position: relative;
}

#form #email {
  width: 573px;
  height: 41px;
  background: #ffffff;
  outline: none;
  padding: 10px;
  border-radius: 4px;
  color: rgb(0, 0, 0);
  font-style: 18px;
  border-color: rgb(220, 220, 220);
}

#form .input-box {
  position: relative;
}

#text {
  display: block;
  color: #000;
  font-weight: 300;
  font-style: italic;
  padding: 5px;
}

#form.invalid .input-box::before {
  content: "";
  position: absolute;
  right: 12px;
  top: 9px;
  width: 24px;
  height: 24px;
  background: url(https://fadzrinmadu.github.io/hosted-assets/email-validation-check-using-javascript/invalid.png);
  -webkit-background-size: cover;
  background-size: cover;
}

#form.valid .input-box::before {
  content: "";
  position: absolute;
  right: 12px;
  top: 9px;
  width: 24px;
  height: 24px;
  background: url(https://fadzrinmadu.github.io/hosted-assets/email-validation-check-using-javascript/valid.png);
  -webkit-background-size: cover;
  background-size: cover;
}
</style>
