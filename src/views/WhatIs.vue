
<script setup>
import { CloudArrowUpIcon, LockClosedIcon, ServerIcon } from '@heroicons/vue/20/solid'
import Header from '../layouts/Header.vue';
import Footer from '../layouts/Footer.vue';

// import 'taos/plugin'

import { onBeforeMount } from 'vue';

onBeforeMount(() => {
    const script = document.createElement('script');
    script.text = "document.documentElement.classList.add('js')";
    document.head.appendChild(script);
});

const features = [
    {
        name: 'Push to deploy.',
        description:
            'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.',
        icon: CloudArrowUpIcon,
    },
    {
        name: 'SSL certificates.',
        description: 'Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.',
        icon: LockClosedIcon,
    },
    {
        name: 'Database backups.',
        description: 'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.',
        icon: ServerIcon,
    },
]
</script>

<template>
    <Header></Header>
    <div class="scroll-container overflow-hidden bg-white py-24 sm:py-32">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <div
                class="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                <div class="lg:pr-6 lg:pt-3 ml-8">
                    <div class="lg:max-w-xl">
                        <h2 class="text-base font-semibold leading-7 text-indigo-600">คำอธิบาย</h2>
                        <p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Tele-Nursing คืออะไร</p>
                        <p class="mt-6 text-lg leading-8 text-gray-600">คำว่า Tele-nursing หรือการพยาบาลทางไกล
                            เป็นการใช้เทคโนโลยีดิจิทัลมาใช้ในการให้บริการทางการพยาบาล
                            เพื่อให้คำปรึกษาและแก้ปัญหาเกี่ยวกับสุขอนามัยภายใต้กรอบความรู้แห่งวิชาชีพการพยาบาล</p>
                        <p class="mt-2 text-lg leading-8 text-gray-600">
                            เหมาะสำหรับ<span
                                class="text-purple-600">บุคคลที่ต้องการการดูแลต่อเนื่องและหรือการดูแลระยะยาวจากสถานพยาบาล
                                หรือกลุ่มของบุคคลที่มีอาการโรคเรื้อรัง</span> เช่น </p>
                        <div class="grid grid-flow-col auto-cols-max gap-8 mt-7 ml-7 mb-12">
                            <div class="flex flex-col items-center mr-12">
                                <img src="/blood-pressure.png" class="drop-shadow-xl max-w-16 max-h-16 " />
                                <b class="mt-2">ความดันโลหิตสูง</b>
                            </div>
                            <div class="flex flex-col items-center mr-12">
                                <img src="/sugar-blood-level.png" class="drop-shadow-xl max-w-16 max-h-16 " />
                                <b class="mt-2">เบาหวาน</b>
                            </div>
                            <div class="flex flex-col items-center">
                                <img src="/blood-vessel.png" class="drop-shadow-xl max-w-16 max-h-16 " />
                                <b class="mt-2">ไขมันในเลือดสูง</b>
                            </div>


                        </div>
                        <hr>
                        <!-- <div class="delay-[300ms] duration-[600ms] taos:scale-[0.6] taos:opacity-0" data-taos-offset="400"> -->
                        <!-- </div> -->

                    </div>
                </div>

                <img src="/tele-n.jpg" alt="Product screenshot"
                    class="w-[38rem] max-w-none rounded-xl sm:w-[44rem] md:-ml-4 lg:-ml-0 mt-[-1.5rem]"
                    data-taos-offset="400" width="2432" height="1442" />
            </div>
        </div>
        <div class="text-center lg:pl-16 lg:pr-16 lg:pt-8 ml-4 mr-4">
            <h2 class="mt-20 text-base font-semibold leading-7 text-indigo-600 ">วัตถุประสงค์</h2>
            <p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                โปรเจกต์นี้ทำขึ้นเพื่ออะไร</p>
            <p class="mt-6 text-lg leading-8 text-gray-600">
                ระบบ Tele-nursing นี้เป็นโครงการนำร่องของการทำ Tele-nursing โดยออกแบบมาเพื่อใช้สำหรับผู้ป่วยโรคเบาหวาน
                ระบบนี้จะเป็นตัวช่วยในการดูแลตัวเองให้ดียิ่งขึ้นและป้องกันความเสี่ยงที่จะการเกิดภาวะฉุกเฉินได้มากขึ้น
                อีกทั้งระบบนี้ยังช่วยอำนวยความสะดวกในฝั่งของผู้ป่วยโดยการไม่ต้องเสียเวลาและทรัพย์สินในการเดินทางไปโรงพยาบาล
                และทำให้ผู้ป่วยมีความอุ่นใจเมื่อมีข้อสงสัยเกี่ยวกับโรคเบาหวานก็สามารถปรึกษาพยาบาลผ่านการคุยแชทได้ในทันที
                นอกจากนี้ทางฝั่งพยาบาลก็สามารถติดตามระดับน้ำตาลในเลือดของผู้ป่วยได้ง่าย
                และมีโอกาสให้คำปรึกษากับผู้ป่วยได้ตรงจุดยิ่งขึ้น
                <br><span class="text-purple-600">ทั้งนี้เพื่อส่งเสริมให้ผู้ป่วยโรคเบาหวานสามารถดูแลตัวเองที่บ้านได้</span>
            </p>

            <p class="mt-10 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                กลุ่มเป้าหมาย</p>
            <p class="mt-2 text-lg leading-8 text-gray-600">
                ผู้ป่วยเบาหวานที่ไม่สามารถควบคุมระดับน้ำตาลในเลือดได้</p>
            <div class="flex flex-col items-center">
                <img src="/glucose-meter.png" class="drop-shadow-2xl max-w-32 max-h-32 mt-7" />
            </div>
        </div>
    </div>
    <Footer></Footer>

</template>
  