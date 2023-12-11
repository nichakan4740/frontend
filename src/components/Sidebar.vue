<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const open = ref(false);
/* const dimmer = ref(true);
const right = ref(false); */

const toggle = () => {
    open.value = !open.value;
};
</script>
<template>
    <div class="relative flex h-screen  sticky top-0">
        <!-- Sidebar -->
        <div
            ref="content"
            class="bg-blue-900 text-cyan-100 w-64  h-5/5 ransition-all duration-700 overflow-hidden "
            :class="[open ? 'max-w-full' : 'max-w-0']"
        >
            <a href="" class="flex items-conter py-3 px-12">
                <span class="text-2xl front-extrabold text-white"
                    >Tele-Nursing</span
                >
            </a>

            <!-- ------------------------------------------------------------------------------- -->
            <!-- drodown in Sidebar -->

            <nav>
                <a
                    class="flex item-center space-x-2 py-3 px-4 hover:bg-indigo-500 rounded transition duration-200"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        class="w-5 h-5"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z"
                            clip-rule="evenodd"
                            fill="#A8B4CD"
                        />
                    </svg>
                   <router-link  :to="{ name: 'home' }" class="text-slate-300">หน้าหลัก</router-link>
                </a>
                <!-- ------------------------------------------------------------------------------- -->
                <a
                   
                    class="flex item-center space-x-2 py-3 px-4 hover:bg-indigo-500 rounded transition duration-200"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        class="w-5 h-5"
                    >
                        <path
                            d="M15.5 2A1.5 1.5 0 0014 3.5v13a1.5 1.5 0 001.5 1.5h1a1.5 1.5 0 001.5-1.5v-13A1.5 1.5 0 0016.5 2h-1zM9.5 6A1.5 1.5 0 008 7.5v9A1.5 1.5 0 009.5 18h1a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0010.5 6h-1zM3.5 10A1.5 1.5 0 002 11.5v5A1.5 1.5 0 003.5 18h1A1.5 1.5 0 006 16.5v-5A1.5 1.5 0 004.5 10h-1z"
                            fill="#A8B4CD"
                        />
                    </svg>
                    <router-link  :to="{ name: 'dashboard' }" class="text-slate-300">สถิติ</router-link>
                   
                </a>
                <!-- ------------------------------------------------------------------------------- -->
                <a
                    class="flex item-center space-x-2 py-3 px-4 hover:bg-indigo-500 rounded transition duration-200"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        class="w-5 h-5"
                    >
                        <path
                            d="M3.505 2.365A41.369 41.369 0 019 2c1.863 0 3.697.124 5.495.365 1.247.167 2.18 1.108 2.435 2.268a4.45 4.45 0 00-.577-.069 43.141 43.141 0 00-4.706 0C9.229 4.696 7.5 6.727 7.5 8.998v2.24c0 1.413.67 2.735 1.76 3.562l-2.98 2.98A.75.75 0 015 17.25v-3.443c-.501-.048-1-.106-1.495-.172C2.033 13.438 1 12.162 1 10.72V5.28c0-1.441 1.033-2.717 2.505-2.914z"
                            fill="#A8B4CD"
                        />
                        <path
                            d="M14 6c-.762 0-1.52.02-2.271.062C10.157 6.148 9 7.472 9 8.998v2.24c0 1.519 1.147 2.839 2.71 2.935.214.013.428.024.642.034.2.009.385.09.518.224l2.35 2.35a.75.75 0 001.28-.531v-2.07c1.453-.195 2.5-1.463 2.5-2.915V8.998c0-1.526-1.157-2.85-2.729-2.936A41.645 41.645 0 0014 6z"
                            fill="#A8B4CD"
                        />
                    </svg>
                    <router-link  :to="{ name: 'chatbot' }" class="text-slate-300">คุยกับเรา</router-link>
                </a>
                <!-- ------------------------------------------------------------------------------- -->
                <a
                    href=""
                    class="flex item-center space-x-2 py-3 px-4 hover:bg-indigo-500 rounded transition duration-200"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 19"
                        fill="currentColor"
                        class="w-5 h-5"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M10 1c-1.828 0-3.623.149-5.371.435a.75.75 0 00-.629.74v.387c-.827.157-1.642.345-2.445.564a.75.75 0 00-.552.698 5 5 0 004.503 5.152 6 6 0 002.946 1.822A6.451 6.451 0 017.768 13H7.5A1.5 1.5 0 006 14.5V17h-.75C4.56 17 4 17.56 4 18.25c0 .414.336.75.75.75h10.5a.75.75 0 00.75-.75c0-.69-.56-1.25-1.25-1.25H14v-2.5a1.5 1.5 0 00-1.5-1.5h-.268a6.453 6.453 0 01-.684-2.202 6 6 0 002.946-1.822 5 5 0 004.503-5.152.75.75 0 00-.552-.698A31.804 31.804 0 0016 2.562v-.387a.75.75 0 00-.629-.74A33.227 33.227 0 0010 1zM2.525 4.422C3.012 4.3 3.504 4.19 4 4.09V5c0 .74.134 1.448.38 2.103a3.503 3.503 0 01-1.855-2.68zm14.95 0a3.503 3.503 0 01-1.854 2.68C15.866 6.449 16 5.74 16 5v-.91c.496.099.988.21 1.475.332z"
                            clip-rule="evenodd"
                            fill="#A8B4CD"
                        />
                    </svg>
                    <span class="text-slate-300">ความรู้</span>
                </a>
                <!-- ------------------------------------------------------------------------------- -->
                <a
                    href=""
                    class="flex item-center space-x-2 py-3 px-4 hover:bg-indigo-500 rounded transition duration-200"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 14"
                        fill="currentColor"
                        class="w-5 h-5"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M1 6a3 3 0 013-3h12a3 3 0 013 3v8a3 3 0 01-3 3H4a3 3 0 01-3-3V6zm4 1.5a2 2 0 114 0 2 2 0 01-4 0zm2 3a4 4 0 00-3.665 2.395.75.75 0 00.416 1A8.98 8.98 0 007 14.5a8.98 8.98 0 003.249-.604.75.75 0 00.416-1.001A4.001 4.001 0 007 10.5zm5-3.75a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5a.75.75 0 01-.75-.75zm0 6.5a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5a.75.75 0 01-.75-.75zm.75-4a.75.75 0 000 1.5h2.5a.75.75 0 000-1.5h-2.5z"
                            clip-rule="evenodd"
                            fill="#A8B4CD"
                        />
                    </svg>
                    <span class="text-slate-300">จัดการข้อมูล</span>
                </a>
                <!-- ------------------------------------------------------------------------------- -->
            </nav>
        </div>
    
        <svg
             @click.prevent="toggle()"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class=" m-3 w-10 h-10  p-1 rounded  text-center focus:outline-none hover:bg-gray-100 transition-color duration-300"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
        </svg>

       
    </div>
</template>

<style>

</style>
