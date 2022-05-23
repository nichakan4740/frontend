<script setup>
import { computed, ref, onBeforeMount } from "vue";
import moment from "moment";
defineEmits(["createevent"]);

const category = ref([]);

onBeforeMount(async () => {
  const res = await fetch(`${import.meta.env.VITE_BASE_URL}api/categories`);
  if (res.status === 200) {
    category.value = await res.json();
    console.log(category.value);
  } else console.log("no event");
});

const StartTimeISO = computed(() => {
  return new Date(StartTime.value).toISOString("utc");
});

const Name = ref("");
const Email = ref("");
const CategoryID = ref("");
const Notes = ref();
const StartTime = ref("");

const Duration = computed(() => {
  if (CategoryID.value == "") {
    return null;
  } else {
    return category.value.filter((c) => c.id == CategoryID.value)[0]
      .eventDuration;
  }
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

const cleartext = () => {
  (Name.value = ""),
    (Email.value = ""),
    (CategoryID.value = ""),
    (Notes.value = null),
    (StartTime.value = ""),
    (Duration.value = "");
};

const date = new Date();
const today = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  .toISOString()
  .replace(/\..+/, "");
</script>

<template>
  <div class="modal-body">
    <div class="bg-light p-3 rounded">
      <p class="text">
        Name &nbsp;
        <span style="font-size: 10px; color: rgb(177, 109, 241)">
          ( Characters must not exceed 100 )
        </span>
      </p>
      <input
        type="text"
        class="form-control"
        v-model.trim="Name"
        maxlength="100"
      />

      <div>
        <p v-if="Name.length" class="input-count" id="count">
          {{ Name.length }}/100
        </p>
      </div>

      <div>
        <p v-show="Name.length < 1" id="checkname">* Please input your name <span></span></p>
        <p v-show="Name.length >= 100" id="checkname">
          * Characters must not exceed 100
        </p>
      </div>
    </div>
    <br />

    <div class="bg-light p-3 rounded">
      <p class="text">Email</p>
      <form action="#" id="form">
        <div class="input-box">
          <input
            type="email"
            id="email"
            class="form-control"
            placeholder="Ex. kw2@kmutt.ac.th"
            v-on:keydown="validation"
            v-model.trim="Email"
          />
          <p v-show="Email < 1" id="checkname">* Please input your Email</p>
        </div>
      </form>
    </div>
    <br />

    <div class="bg-light p-3 rounded">
      <p class="text">CategoryName</p>
      <select class="form-select" v-model="CategoryID">
        <option v-for="cat in category" :value="cat.id">
          {{ cat.eventCategoryName }}
        </option>
      </select>
      <p v-show="CategoryID.length === 0" id="checkname">
        * Please select categoryname
      </p>
    </div>
    <br />

    <div class="bg-light p-3 rounded">
      <p class="text">Duration</p>
      <input v-model="Duration" class="form-control" disabled />
    </div>
    <br />

    <div class="bg-light p-3 rounded">
      <p class="text">
        Notes &nbsp;
        <span style="font-size: 10px; color: rgb(177, 109, 241)"
          >( Characters must not exceed 500 )</span
        >
      </p>
      <textarea
        type="text"
        class="form-control"
        v-model.trim="Notes"
        Maxlength="500"
        rows="3"
      >
      </textarea>
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
      <p v-show="StartTime.length === 0" id="checkname">
        * Please select a future time
      </p>
    </div>

    <br />
  </div>

  <div class="modal-footer">
    <div class="clearbooking" @click="cleartext">Clear</div>
    &nbsp;

    <div
      class="addbooking"
      @click="
        $emit(
          'createevent',
          Name,
          Email,
          Notes,
          Duration,
          StartTimeISO,
          CategoryID
        ),
          cleartext()
      "
    >
      Add Event
    </div>
  </div>
</template>

<style>
.modal-body {
  font-family: "Prompt", sans-serif;
}

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

#checkname {
  color: rgb(192, 6, 6);
  font-family: "Prompt", sans-serif;
  font-weight: 700;
  font-size: 10px;
  width: 50%;
  border-radius: 120px;
  margin-top: 10px;
  margin-bottom: -5px;
}

#count {
  font-size: 10px;
  opacity: 0.5;
  margin-left: 95%;
  margin-top: 10px;
  margin-bottom: -5px;
}
</style>
