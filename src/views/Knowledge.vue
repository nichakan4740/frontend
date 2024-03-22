<script setup>
import { useRouter } from "vue-router";
import { ref, onBeforeMount, computed, onMounted, onUnmounted } from "vue";
import Layout from '../layouts/Layout.vue';
import { initFlowbite, Modal } from 'flowbite'


</script>

<template>
    <Layout class="bg-gradient-to-b from-blue-100">
        <div class="container mx-auto">
            <div
                class="box-content p-3 ml-5 mr-5 mt-10 bg-gradient-to-b from-blue-900 to-blue-800 shadow-lg shadow-slate-500/50 rounded-lg">
                <h2 class="font-semibold text-xl text-center text-slate-200">
                    สาระความรู้
                </h2>
            </div>


            <div
                class="box-content bg-white shadow-lg shadow-gray-300/50 mt-10 ml-5 mr-5 pt-10 pb-6 pl-14 pr-6 mb-10 rounded-lg">

                <!-- <div class="box-content pt-6 pb-3   ">
                    <p>กรุณาทำแบบทดสอบครั้งที่ 1 (ก่อนการดูคลิป)</p>
                    <router-link :to="{ name: 'test' }"
                        class="block w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 px-4  border rounded text-center">
                        - แบบทดสอบครั้งที่ 1 - </router-link>

                </div>
                <br>
                <br>
                <br> -->


                <div class=" grid grid-cols-1 gap-2 sm:grid-cols-2 pl-8 ">
                    <div class=" ml-2 pb-6 ">
                        <iframe src="https://www.youtube.com/embed/lcN3aSoDF2M" frameborder="0" allowfullscreen
                            class="rounded-md w-4/5 h-64 "></iframe>
                        <!-- <iframe width="450" height="260" src="https://www.youtube.com/embed/Vj48SNcUPXY" frameborder="0" allowfullscreen> -->
                        <p class="font-semibold text-lg">1. รู้จักเบาหวานใน 3 นาที</p>
                        <p class="font-light">แหล่งอ้างอิง: โรงพยาบาลธนบุรี</p>
                    </div>
                    <div class="ml-2 pb-6">
                        <iframe src="https://www.youtube.com/embed/7mw04nvCScg" frameborder="0" allowfullscreen
                            class="rounded-md w-4/5 h-64"></iframe>
                        <p class="font-semibold text-lg">2. โรคร้าย ที่มากับเบาหวาน </p>
                        <p class="font-light">แหล่งอ้างอิง: โรงพยาบาลธนบุรี</p>
                    </div>
                    <div class="ml-2 pb-6">
                        <iframe src="https://www.youtube.com/embed/IZanRzm79uk" frameborder="0" allowfullscreen
                            class="rounded-md w-4/5 h-64"></iframe>
                        <p class="font-semibold text-lg">3. การรับประทานอาหารสำหรับผู้ป่วยโรคเบาหวาน</p>
                        <p class="font-light">แหล่งอ้างอิง: โรงพยาบาลรามคําแหง</p>
                    </div>
                    <div class="ml-2 pb-6">
                        <iframe src="https://www.youtube.com/embed/2tP14jlCq9Q" frameborder="0" allowfullscreen
                            class="rounded-md w-4/5 h-64"></iframe>
                        <p class="font-semibold text-lg">4. ออกกำลังกายพิชิตโรคเบาหวาน</p>
                        <p class="font-light">แหล่งอ้างอิง: โรงพยาบาลธนบุรี</p>
                    </div>


                </div>



                <p class="font-semibold text-lg mt-16">ระดับน้ำตาลในเลือด</p>
                <div>
                    <div class="mb-4 border-b border-gray-200 dark:border-gray-700">
                    <ul class="flex flex-wrap -mb-px text-sm font-medium text-center" id="default-tab"
                        data-tabs-toggle="#default-tab-content" role="tablist">
                        <li class="me-2" role="presentation">
                            <button class="inline-block p-4 border-b-2 rounded-t-lg" id="profile-tab"
                                data-tabs-target="#profile" type="button" role="tab" aria-controls="profile"
                                aria-selected="false">น้ำตาลสูง (มากกว่า 126)</button>
                        </li>
                        <li class="me-2" role="presentation">
                            <button
                                class="inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                                id="dashboard-tab" data-tabs-target="#dashboard" type="button" role="tab"
                                aria-controls="dashboard" aria-selected="false">น้ำตาลปกติ (70 - 125)</button>
                        </li>
                        <li class="me-2" role="presentation">
                            <button
                                class="inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                                id="settings-tab" data-tabs-target="#settings" type="button" role="tab"
                                aria-controls="settings" aria-selected="false">น้ำตาลต่ำ (ต่ำกว่า 70)</button>
                        </li>
                        <li role="presentation">
                        </li>
                    </ul>
                </div>
                <div id="default-tab-content">
                    <!-- น้ำตาลสูง -->
                    <div class="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="profile" role="tabpanel"
                    aria-labelledby="profile-tab">
                    <strong class="font-bold text-gray-800 dark:text-white">คำแนะนำการปฏิบัติตัวเบื้องต้น</strong> 
                        <ul>
                            <li>1. ดื่มน้ำสะอาดมากๆ </li>
                            <li>2. หยุดทํากิจกรรม และนอนพัก  </li>
                            <li>3. หากอาการไม่ดีขึ้น โดยเจาะเลือดด้วยตนเองแล้วพบว่าระดับน้ำตาลในเลือดสูงมาก ให้รีบมาพบแพทย์  </li>
                            <li>4. หากอาการดีขึ้น ควรตรวจเลือด และปัสสาวะซ้ำทุก 4 ชม. รวมถึงดื่มน้ำสะอาดมากๆ   </li>
                            <li>5. หากมีอาการชักกระตุกเฉพาะที่ หรือมีอาการซึม และมีระดับน้ำตาลในเลือดมาก ให้พบแพทย์ทันที</li>
                        </ul>
                        
                        <br>
                        <strong class="font-bold text-gray-800 dark:text-white">อาหารที่ควรรับประทาน</strong> 
                        <ul>
                            <li>- ผักสีเขียวและผลไม้ที่มีใยอาหาร เช่น สะตอ, ผักบุ้ง, ถั่วฝักยาว, แตงกวา, และแอปเปิ้ล เป็นต้น เพราะมีใยอาหารช่วยลดการดูดซึมน้ำตาลในเลือด </li>
                            <li>- โปรตีนเสริม เช่น เนื้อไก่, เนื้อปลา, ถั่วเหลือง, และเกาะหลังปู เป็นต้น เพื่อช่วยควบคุมระดับน้ำตาลในเลือดและส่งเสริมการเติบโตของกล้ามเนื้อ  </li>
                            <li>- ไขมันดี เช่น น้ำมันมะกอก, น้ำมันมะพร้าว, และน้ำมันมะกอกบราสิล เป็นต้น เพื่อควบคุมการดูดซึมน้ำตาลในเลือด </li>
                            <li>- คาร์โบไฮเดรตที่มีคุณค่า เลือกคาร์โบไฮเดรตที่มีคุณค่าเช่น ข้าวสุก, โปรตีนอาร์ติโชกับข้าว, และข้าวโอทสุก เพื่อควบคุมการดูดซึมน้ำตาลในเลือด</li>
                        </ul>

                        <br>
                        <strong class="font-bold text-gray-800 dark:text-white">อาหารที่ควรหลีกเลี่ยงหรือลดการบริโภค</strong> 

                        <ul>
                            <li>- อาหารที่มีน้ำตาลและคาร์โบไฮเดรตสูง เช่น ขนมหวาน, อาหารที่มีน้ำตาลและคาร์โบไฮเดรตสูงส่วนมาก</li>
                            <li>- อาหารที่มีไขมันไม่ดี เช่น อาหารที่มีไขมันสูง, อาหารที่ทำจากน้ำมันประกอบด้วยไขมันที่ไม่ดีต่อสุขภาพ </li>
                            <li>- อาหารที่มีความเค็มสูง เช่น อาหารที่มีการใช้เกลือสูง อาจส่งผลกระทบต่อความสมดุลของน้ำตาลในเลือด</li>
                        </ul>
                      </div>



                        <!-- น้ำตาลปกติ -->
                    <div class="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="dashboard" role="tabpanel"
                        aria-labelledby="dashboard-tab">
                    <strong class="font-bold text-gray-800 dark:text-white">คำแนะนำการปฏิบัติตัวเบื้องต้น</strong> 
                        <ul>
                            <li>- การออกกำลังกาย เริ่มต้นการออกกำลังกายอย่างสม่ำเสมอ เช่น การเดิน, วิ่ง, โยคะ, หรือกิจกรรมทางกายอื่น ๆ อย่างสม่ำเสมอ เพื่อช่วยลดระดับน้ำตาลในเลือด</li>
                            <li>- การตรวจสุขภาพประจำ ทำการตรวจสุขภาพประจำอย่างสม่ำเสมอ เพื่อตรวจสอบสุขภาพทั่วไปและการตรวจระดับน้ำตาลในเลือดอย่างสม่ำเสมอ</li>
                            <li>- การลดน้ำหนัก (หากจำเป็น) หากมีน้ำหนักที่เกินมา การลดน้ำหนักอาจช่วยลดการดูดซึมน้ำตาลในเลือดได้  </li>
                            <li>- ปฏิบัติการเปลี่ยนแปลงพฤติกรรม การเปลี่ยนแปลงพฤติกรรมที่เป็นประโยชน์ เช่น เลิกสูบบุหรี่, การดื่มเครื่องดื่มที่มีแอลกอฮอล์หรือน้ำตาลสูง, การลดความเครียด, การนอนพักผ่อนที่เพียงพอ เป็นต้น</li>
                        </ul>
                             
                        
                        <br>
                        <strong class="font-bold text-gray-800 dark:text-white">อาหารที่ควรรับประทาน</strong> 
                        <ul>
                            <li>การควบคุมอาหาร: รักษาการบริโภคอาหารที่มีความหลากหลายและสมดุล เน้นการรับประทานผักผลไม้, โปรตีน, และไขมันดี เช่น น้ำมันมะกอก, น้ำมันมะพร้าว, และน้ำมันมะกอกบราสิล เป็นต้น เพื่อช่วยควบคุมระดับน้ำตาลในเลือด </li>
                        </ul>

                        <br>
                        <strong class="font-bold text-gray-800 dark:text-white">อาหารที่ควรหลีกเลี่ยงหรือลดการบริโภค</strong> 

                        <ul>
                            <li>- เครื่องดื่มที่ผสมแอลกอฮอล์ รวมทั้งยาดองเหล้า หรือจำกัดการดื่มแอลกอฮอล์ให้เหลือน้อยที่สุด เพราะแอลกอฮอล์อาจมีผลต่อยาที่ใช้ควบคุมเบาหวานและโรคต่างๆ </li>
                            <li>- หลีกเลี่ยงการกินน้ำตาล น้ำอัดลม เครื่องดื่มชูกำลัง ขนมหาน ผลไม้เชื่อมแช่อิ่ม ผลไม้ที่มีรสหวาน </li>
                            <li>- ไขมันสัตว์ เนย มันหมู เนื้อติดมัน เครื่องในสัตว์ หอยนางรม ไข่แดง ครีม กะทิ และอาหารทอด</li>
                        </ul>
                    </div>


                    <!-- น้ำตาลต่ำ -->
                    <div class="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="settings" role="tabpanel"
                        aria-labelledby="settings-tab">
                    <strong class="font-bold text-gray-800 dark:text-white">คำแนะนำการปฏิบัติตัวเบื้องต้น</strong> 
                    <ul>
                            <li>รับประทานอาหารหวานหรือคาร์โบไฮเดรตที่ออกฤทธิ์เร็ว รอ 15 นาทีแล้วตรวจระดับน้ำตาลในเลือด  หากระดับน้ำตาลในเลือดยังต่ำกว่า 70 มก./ดล. ให้รับประทานอาหารหวานๆ เพิ่ม  ทำตามขั้นตอนนี้ซ้ำจนกว่าระดับน้ำตาลในเลือดจะเทียบเท่าหรือสูงกว่า 70 มก./ดล.</li>
                        </ul>
                        <br>
                        <strong class="font-bold text-gray-800 dark:text-white">อาหารที่ควรรับประทาน</strong> 
                        <ul>
                            <li>ตัวอย่างอาหารคาร์โบไฮเดรตออกฤทธ์เร็วในปริมาณ 15 กรัม</li>
                            <li>- กล้วย ครึ่งผล </li>
                            <li>- น้ำผลไม้หรือน้ำอัดลมแบบมีน้ำตาล ครึ่งแก้ว</li>
                            <li>- น้ำตาล น้ำผึ้ง น้ำเชื่อม 1 ช้อนโต๊ะ  </li>
                            <li>- เจลกลูโคส 1 หลอด (ดูเอกสารการใช้ยา)</li>
                            <li>- ยาเม็ดกลูโคส 3 - 4 เม็ด (ดูเอกสารการใช้ยา)</li>
                        </ul>
                        <br>
                        <strong class="font-bold text-gray-800 dark:text-white">อาหารที่ควรหลีกเลี่ยงหรือลดการบริโภค</strong> 

                        <ul>
                            <li>- หลีกเลี่ยงการรับประทานอาหารที่มีน้ำตาลและคาร์โบไฮเดรตสูง เช่น ขนมหวาน </li>
                            <li class="font-medium text-purple-600 dark:text-white">* การเพิ่มน้ำตาลต้องค่อยเป็นค่อยไปตามขั้นตอน ถ้ารับประทานอาหารที่มีน้ำตาลและคาร์โบไฮเดรตสูงมากๆเกินกำหนด อาจทำให้เกิดอันตรายต่อร่างกายได้ </li>
                        </ul>

                    </div>
                </div>
                </div>
                



                <!-- <div class="box-content pt-6 pb-3   ">
                    <p>กรุณาทำแบบทดสอบครั้งที่ 2 (หลังการดูคลิป)</p>

                    <router-link :to="{ name: 'test' }"
                        class="block w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 px-4  border rounded text-center">-
                        แบบทดสอบครั้งที่ 2 -</router-link>

                </div> -->
            </div>


        </div>
    </Layout>
</template>

<style></style>