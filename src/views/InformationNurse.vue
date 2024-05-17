<script setup>
import { useRouter } from "vue-router";
import { ref, onBeforeMount, computed, onMounted, onUnmounted, watch } from "vue";
import LayoutNurse from '../layouts/LayoutNurse.vue';
import moment from "moment";
import Swal from "sweetalert2";

const appRouter = useRouter();
const name = localStorage.getItem("name");
const professional_id = localStorage.getItem("professional_id");

const result = ref([]);
/* --------------------------------------------------------------------------------------------------- */
const NurseInfo = async () => {
    try {
        const userId = localStorage.getItem('idadmin');
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}api/nurse/getProfile/${userId}`);
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("name", data.name);
            localStorage.setItem("professional_id", data.professional_id);

        } else if (response.status === 404) {
            // Handle case when no data is found
            console.log('No data found');
            result.value = [];
        } else {
            throw new Error('Failed to fetch data');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};
onMounted(NurseInfo);

const nurseinfo = ref({
    name: '',
    professional_id: ''
});

const updateinfouser = async () => {
    try {
        // Check if professional_id is numeric and has exactly 10 digits
        const isNumeric = /^\d+$/.test(nurseinfo.value.professional_id);
        const hasTenDigits = nurseinfo.value.professional_id.length === 10;

        if (!isNumeric || !hasTenDigits) {
            // Display warning message
            Swal.fire({
                title: "เกิดข้อผิดพลาด",
                text: "เลขใบประกอบวิชาชีพพยาบาลจะต้องเป็นตัวเลขและมี 10 หลัก",
                icon: "error",
                confirmButtonText: "ตกลง"
            });
            return; // Exit the function without proceeding
        }

        // Proceed with the update if validation passes
        const userId = localStorage.getItem('idadmin');
        const editinfo = `${import.meta.env.VITE_BASE_URL}api/nurse/getProfile/${userId}`;

        const confirmationResult = await Swal.fire({
            title: "ยืนยันการแก้ไข",
            text: "คุณต้องการที่จะแก้ไขข้อมูล",
            icon: "warning",
            confirmButtonText: "ยืนยัน",
            cancelButtonText: "ยกเลิก",
            showCancelButton: true,
            showCloseButton: true
        });

        if (confirmationResult.isConfirmed) {
            const response = await fetch(editinfo, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(nurseinfo.value),
            });

            if (response.ok) {
                await NurseInfo();
            } else {
                throw new Error("Failed to delete");
            }
        }
    } catch (error) {
        console.error("Error deleting data:", error);
    }
    window.location.reload();
    closeModal();
}

// ให้ปุ่มเปลี่ยนสี
const isButtonClicked = ref(false);

const handleButtonClick = () => {
    // Toggle the state when the button is clicked
    isButtonClicked.value = !isButtonClicked.value;
};
/* model popup */
const isModalOpen = ref(false);

const openModal = () => {
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
};
const editinfo = () => {
    nurseinfo.value.name = name;
    nurseinfo.value.professional_id = professional_id;

    openModal();
};

</script>

<template>
    <div class="bg-gradient-to-b from-blue-100">
        <LayoutNurse>
            <!-- content -->
            <div class="container mx-auto my-auto ">
                <div
                    class="box-content p-3  ml-5 mr-5 mt-10 bg-gradient-to-b from-blue-900 to-blue-800  shadow-lg shadow-slate-500/50  rounded-lg">
                    <h2 class="font-semibold text-xl text-center text-slate-200 ">ข้อมูลส่วนบุคคล</h2>
                </div>



                <!-- component -->
                <section
                    class="bg-white dark:bg-gray-900 box-conten shadow-lg shadow-gray-300/50 mt-10 ml-5 mr-5 pt-6 pl-6 pr-6  mb-10  rounded-lg ">
                    <div class="flex justify-center min-h-screen">
                        <div class="hidden bg-cover lg:block lg:w-2/5 mt-24">
                            <img src="/nurse (2).png" class="max-w-60 mx-auto">
                        </div>

                        <div class="flex items-center w-full max-w-3xl p-2 mx-auto lg:px-12 lg:w-3/5 -mt-64">
                            <div class="w-full">
                                <h1
                                    class="text-2xl font-semibold tracking-wider text-gray-800 capitalize dark:text-white">
                                    <div class>{{ name }}</div>
                                </h1>



                                <form class="grid grid-cols-1 gap-6 mt-2 md:grid-cols-2">
                                    <div>
                                        <label
                                            class="block mb-2 text-sm text-gray-600 dark:text-gray-200">ชื่อจริง</label>
                                        <div type="text"
                                            class="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40">
                                            {{ name }}
                                        </div>

                                    </div>

                                    <div>
                                        <label
                                            class="block mb-2 text-sm text-gray-600 dark:text-gray-200">เลขใบประกอบวิชาชีพพยาบาล</label>
                                        <div type="text"
                                            class="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40">
                                            {{ professional_id }}
                                        </div>
                                    </div>


                                </form>
                                <button type="button"
                                    class="flex items-center justify-between w-full mt-10 px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                                    @click="editinfo">
                                    <span>แก้ไขข้อมูลส่วนบุคคล</span>

                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 rtl:-scale-x-100"
                                        viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd"
                                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- ------------------------------------------------------------------------------------------ -->
                <!-- modal popup -->
                <div>
                    <!-- Modal -->
                    <div v-if="isModalOpen"
                        class="absolute inset-0 z-10 flex items-center justify-center lg:mt-60 mt-20">
                        <div class="fixed inset-0 bg-black opacity-50"></div>
                        <div class="bg-white p-8 rounded shadow-md z-20">
                            <h2 class="text-xl font-bold mb-4 text-center">แก้ไขข้อมูลส่วนตัว</h2>

                            <div class="card-body">
                                <form @submit.prevent="updateinfouser">

                                    <div class="box-content  pt-3 pb-3  ">
                                        <p>ชื่อจริง-นามสกุล</p>
                                        <div class="box-content ">
                                            <input type="text" v-model="nurseinfo.name"
                                                class="block w-full rounded-md border-0 py-2 pl-6 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400">
                                        </div>
                                    </div>

                                    <div class="box-content  pt-3 pb-3  ">
                                        <p>เลขใบประกอบวิชาชีพพยาบาล</p>
                                        <div class="box-content ">
                                            <input type="text" v-model="nurseinfo.professional_id" maxlength="10"
                                                class="block w-full rounded-md border-0 py-2 pl-6 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400">
                                        </div>
                                    </div>

                                    <div class="flex items-center justify-center">
                                        <button type="submit"
                                            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mt-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                            บันทึกการแก้ไข
                                        </button>
                                        <button @click="closeModal"
                                            class="focus:outline-none text-white bg-yellow-300 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mt-2 dark:focus:ring-yellow-900">
                                            ยกเลิก
                                        </button>
                                    </div>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </LayoutNurse>
    </div>
</template>

<style>
.grid-container {

    height: 100vh;
    /* ทำให้ container มีความสูงเต็มหน้าจอ */
}
</style>