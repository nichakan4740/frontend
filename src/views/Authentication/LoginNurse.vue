<script setup>
import { useRouter } from "vue-router";
import { ref, onBeforeMount, reactive } from "vue";
import Swal from "sweetalert2";

const professional_id = ref("");
const password = ref("");
const loginnurse = async (professional_id, password) => {
  const res = await fetch(`${import.meta.env.VITE_BASE_URL}api/nurse/login`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      professional_id: professional_id,
      password: password,
    }),
  });

  if (res.status === 200) {
    const response = await res.json();
    localStorage.setItem("professional_id", response.user.professional_id);
    localStorage.setItem("accesstoken", response.authorisation.token);
    /* localStorage.setItem('refreshtoken', jwt.refreshToken) */
    console.log(response);
    Swal.fire({
      icon: "success",
      title: "เข้าสู่ระบบสำเร็จ!",
      showConfirmButton: false,
    });
    /*  setTimeout(function () {
    }, 500);  */
    close();
    console.log("You login success");
  }

  if (res.status === 404) {
    Swal.fire({
      icon: "error",
      title: "ขอโทษ!!!",
      text: "เลขประกอบวิชาชีพไม่ถูกต้อง!",
    });
    console.log("The professional number is incorrect.");
  }
  if (res.status === 401) {
    Swal.fire({
      icon: "error",
      title: "ขอโทษ !!!",
      text: "รหัสผิด โปรดใส่ใหม่",
    });
    console.log("Password Not Matched");
  }
};

const appRouter = useRouter();
const close = () => appRouter.push({ name: "home" });

/* ทำ Tebs */
const openTab = ref(1);
const toggleTabs = (tabNumber) => {
  openTab.value = tabNumber;
};
</script>

<template>
  <div class="container mx-auto">
    <div
      class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
    >
      <p class="flex items-center mb-6 text-2xl font-semibold text-gray-900">
        Tele-Nursing System
      </p>
      <p class="flex items-center mb-6 text-2xl font-semibold text-gray-900">
        ระบบพยาบาลทางไกล
      </p>

      <!--  -->
      <div class="flex flex-wrap">
        <div class="w-full">
          <ul class="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row">
            <li class="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a
                class="text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal"
                @click="toggleTabs(1)"
                :class="{
                  'text-pink-600 bg-white': openTab !== 1,
                  'text-white bg-pink-600': openTab === 1,
                }"
              >
                สำหรับพยาบาล
              </a>
            </li>
            <li class="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a
                class="text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal"
                @click="toggleTabs(2)"
                :class="{
                  'text-pink-600 bg-white': openTab !== 2,
                  'text-white bg-pink-600': openTab === 2,
                }"
              >
                สำหรับบุคคลทั่วไป
              </a>
            </li>
          </ul>
          <div
            class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded"
          >
            <div class="px-4 py-5 flex-auto">
              <div class="tab-content tab-space">
                <!-- login ของพยาบาล -->
                <div :class="{ hidden: openTab !== 1, block: openTab === 1 }">
                  <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <form class="space-y-4 md:space-y-6" action="#">
                      <div>
                        <label
                          for="professional_id"
                          class="block mb-2 text-sm font-medium text-gray-900"
                          >เลขใบประกอบวิชาชีพพยาบาล</label
                        >
                        <input
                          type="professional_id"
                          name="professional_id"
                          id="professional_id"
                          class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="xxxxxxxxxxx"
                          v-model.trim="professional_id"
                          required=""
                        />
                      </div>

                      <div>
                        <label
                          for="password"
                          class="block mb-2 text-sm font-medium text-gray-900"
                          >Password</label
                        >
                        <input
                          type="password"
                          name="password"
                          id="password"
                          placeholder="xxxxxxxx"
                          class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          maxlength="14"
                          minlength="8"
                          v-model.trim="password"
                          required=""
                        />
                      </div>

                      <div class="flex items-center justify-between">
                        <div class="flex items-start">
                          <div class="flex items-center h-5">
                            <input
                              id="remember"
                              aria-describedby="remember"
                              type="checkbox"
                              class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                              required=""
                            />
                          </div>
                          <div class="ml-3 text-sm">
                            <label
                              for="remember"
                              class="text-gray-500 dark:text-gray-300"
                              >Remember me</label
                            >
                          </div>
                        </div>
                        <a
                          href="#"
                          class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                          >Forgot password?</a
                        >
                      </div>

                      <div>
                        <button
                          @click="loginnurse(professional_id, password)"
                          class="block w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 px-4 mb-4 border rounded"
                        >
                          เข้าสู่ระบบ
                        </button>
                      </div>

                      <div class="text-center">
                        <router-link :to="{ name: 'registerNurse' }">
                          <p class="text-sm font-medium text-gray-500">
                            คุณไม่ม่บัญชีใช่หรือไม่?
                            <a
                              class="font-bold text-primary-600 hover:underline text-indigo-800"
                              >โปรดลงทะเบียน</a
                            >
                          </p>
                        </router-link>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <!-- ของผู้ป่วย -->
              <div :class="{ hidden: openTab !== 2, block: openTab === 2 }">
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                  <form class="space-y-4 md:space-y-6" action="#">
                    <div>
                      <label
                        for="professional_id"
                        class="block mb-2 text-sm font-medium text-gray-900"
                        >เลขใบประกอบวิชาชีพพยาบาล</label
                      >
                      <input
                        type="professional_id"
                        name="professional_id"
                        id="professional_id"
                        class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="xxxxxxxxxxx"
                        v-model.trim="professional_id"
                        required=""
                      />
                    </div>

                    <div>
                      <label
                        for="password"
                        class="block mb-2 text-sm font-medium text-gray-900"
                        >Password</label
                      >
                      <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="xxxxxxxx"
                        class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        maxlength="14"
                        minlength="8"
                        v-model.trim="password"
                        required=""
                      />
                    </div>

                    <div class="flex items-center justify-between">
                      <div class="flex items-start">
                        <div class="flex items-center h-5">
                          <input
                            id="remember"
                            aria-describedby="remember"
                            type="checkbox"
                            class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                            required=""
                          />
                        </div>
                        <div class="ml-3 text-sm">
                          <label
                            for="remember"
                            class="text-gray-500 dark:text-gray-300"
                            >Remember me</label
                          >
                        </div>
                      </div>
                      <a
                        href="#"
                        class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                        >Forgot password?</a
                      >
                    </div>

                    <div>
                      <button
                        @click="loginnurse(professional_id, password)"
                        class="block w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 px-4 mb-4 border rounded"
                      >
                        เข้าสู่ระบบ
                      </button>
                    </div>

                    <div class="text-center">
                      <router-link :to="{ name: 'registerNurse' }">
                        <p class="text-sm font-medium text-gray-500">
                          คุณไม่ม่บัญชีใช่หรือไม่?
                          <a
                            class="font-bold text-primary-600 hover:underline text-indigo-800"
                            >โปรดลงทะเบียน</a
                          >
                        </p>
                      </router-link>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--  -->
</template>

<style></style>
