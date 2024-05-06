<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import { Dialog, DialogPanel } from "@headlessui/vue";
import { Bars3Icon, XMarkIcon } from "@heroicons/vue/24/outline";

const navigation = [ 
  { name: "หน้าหลัก", href: "/" },
  // { name: "Tele-Nursing คืออะไร", href: "/what-is" },
  // { name: "ฟีเจอร์แนะนำ", href: "/Features" }
];
const mobileMenuOpen = ref(false);


/* // เพิ่ม pusher
const pusherScript = document.createElement('script');
pusherScript.src = 'https://js.pusher.com/8.2.0/pusher.min.js';
document.head.appendChild(pusherScript);

// Pusher initialization code
pusherScript.onload = () => {
  window.Pusher.logToConsole = true;
  var pusher = new window.Pusher('d0537e1c7c0b105eaa20', {
    cluster: 'ap1'
  });
  var channel = pusher.subscribe('user-milk');
  channel.bind('my-event', function(data) {
    // Assuming `app` is defined somewhere else
    alert('my-event')
  });
  channel.bind('live-chat', function(data) {
    // Assuming `app` is defined somewhere else
    alert('live-chat'+data)
    console.log(data)
  });
}; */
 

</script>

<template>
  <!-- header  -->
  <header class="absolute inset-x-0 top-0 z-50">
    <nav
      class="flex items-center justify-between p-6 lg:px-8"
      aria-label="Global"
    >
    <div class="hidden lg:flex lg:gap-x-12 mr-8">
        <a
          v-for="item in navigation"
          :key="item.name"
          :href="item.href"
          class="text-sm font-semibold leading-6 text-gray-900"
          >{{ item.name }}</a
        >
      </div>
    <router-link :to="{ name: 'what-is' }">
        <button
          type="button"
          class="text-sm font-semibold leading-6 text-gray-900 mr-6"
        >
        Tele-Nursing คืออะไร
        </button>
      </router-link>
      <router-link :to="{ name: 'features' }">
        <button
          type="button"
          class="text-sm font-semibold leading-6 text-gray-900 mr-6"
        >
        ฟีเจอร์แนะนำ
        </button>
      </router-link>
      <div class="flex lg:flex-1"></div>
      <div class="flex lg:hidden">
        <button
          type="button"
          class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          @click="mobileMenuOpen = true"
        >
          <span class="sr-only">Open main menu</span>
          <Bars3Icon class="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      
     

      <!-- คอม  -->


      
      <div class="hidden lg:flex lg:flex-1 lg:justify-end">
        <router-link :to="{ name: 'loginNurse' }">
          <button
            type="button"
            class="text-sm font-semibold leading-6 text-gray-900 mr-6"
          >
            เข้าใช้งานสำหรับพยาบาล
          </button>
        </router-link>

        <router-link :to="{ name: 'loginPatient' }">
          <button
            type="button"
            class="text-sm font-semibold leading-6 text-gray-900"
          >
            เข้าใช้งานสำหรับบุคคลทั่วไป
          </button>
        </router-link>
      </div>
      <!--  -->
    </nav>
    <Dialog
      as="div"
      class="lg:hidden"
      @close="mobileMenuOpen = false"
      :open="mobileMenuOpen"
    >
      <div class="fixed inset-0 z-50" />
      <DialogPanel
        class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
      >
        <div class="flex items-center justify-between">
          <button
            type="button"
            class="-m-2.5 rounded-md p-2.5 text-gray-700"
            @click="mobileMenuOpen = false"
          >
            <span class="sr-only">Close menu</span>
            <XMarkIcon class="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div class="mt-6 flow-root">
          <div class="-my-6 divide-y divide-gray-500/10">
            <div class="space-y-2 py-6">
              <a
                v-for="item in navigation"
                :key="item.name"
                :href="item.href"
                class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >{{ item.name }}</a
              >
            </div>

            <!-- สำหรับโทรศัพท์ -->
            <div class="py-6">
              <router-link :to="{ name: 'what-is' }">
                <button
                  type="button"
                  class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                Tele-Nursing คืออะไร
                </button>
              </router-link>

              <router-link :to="{ name: 'features' }">
                <button
                  type="button"
                  class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                ฟีเจอร์แนะนำ
                </button>
              </router-link>
              <router-link :to="{ name: 'loginNurse' }">
                <button
                  type="button"
                  class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  เข้าใช้งานสำหรับพยาบาล
                </button>
              </router-link>

              <router-link :to="{ name: 'loginPatient' }">
                <button
                  type="button"
                  class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  เข้าใช้งานสำหรับบุคคลทั่วไป
                </button>
              </router-link>
            </div>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  </header>
  <!-- ------------------------------------------------------------------------------------------------------------------------ -->
</template>

<style></style>
