<script setup>

import Header from '../layouts/Header.vue';
import Footer from '../layouts/Footer.vue';

</script>

<template>
<section class="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
  <div>
 <Header></Header>
    <div class="relative isolate px-6 pt-14 lg:px-8">
     	 
     <!-- ------------------------------------------------------------------------------------- -->
     
		 <div class="container max-w-xl p-6 py-12 mx-auto space-y-24 lg:px-8 lg:max-w-7xl">
			 <div>
				 <h2 class="text-3xl font-bold tracki text-center sm:text-5xl dark:text-gray-50">ฟีเจอร์แนะนำ</h2>
				<p class="max-w-3xl mx-auto mt-4 text-xl text-center dark:text-gray-400">ระบบ Tele-nursing ออกแบบมาสำหรับผู้ป่วยเบาหวาน ซึ่งมีฟีเจอร์หลักๆดังต่อไปนี้</p>
			</div>
			<!-- 1,2------------------------------------------------------------------------------------- -->
			<div class="grid lg:gap-8 lg:grid-cols-2 lg:items-center">
				<div>
					<h3 class="text-2xl font-bold tracki sm:text-3xl dark:text-gray-50">บันทึกค่าระดับน้ำตาล</h3>
					<p class="mt-3 text-lg dark:text-gray-400">การบันทึกค่าระดับน้ำตาลในผู้ป่วยเบาหวาน เมื่อกดบันทึกระบบจะแสดงผลระดับน้ำตาลในเลือดว่าอยู่ในเกณฑ์ใด ซึ่งการบันทึกค่าระดับน้ำตาลเป็นประจำมีหลายข้อดีที่สำคัญสำหรับการดูแลสุขภาพของผู้ป่วยเบาหวาน ดังนี้:</p>
					<div class="mt-12 space-y-12">
						<div class="flex">
							<div class="flex-shrink-0">
								<div class="flex items-center justify-center w-12 h-12 rounded-md dark:bg-violet-400 dark:text-gray-900">
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-7 h-7">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
									</svg>
								</div>
							</div>
							<div class="ml-4">
								<h4 class="text-lg font-medium leadi dark:text-gray-50">ตรวจสอบประสิทธิภาพและการปรับแผนการรักษา</h4>
								<p class="mt-2 dark:text-gray-400">ข้อมูลเกี่ยวกับระดับน้ำตาลในเลือดจะช่วยแพทย์ปรับแผนการรักษาให้เหมาะสมตามความต้องการของผู้ป่วย เพื่อควบคุมระดับน้ำตาลในเลือดให้มีค่าปกติและลดความเสี่ยงของภาวะภูมิต้านทานต่ำหรือภาวะเสี่ยงต่อการแทรกซ้อนอื่น ๆ ที่อาจเกิดขึ้นจากน้ำตาลสูง</p>
							</div>
						</div>
						<div class="flex">
							<div class="flex-shrink-0">
								<div class="flex items-center justify-center w-12 h-12 rounded-md dark:bg-violet-400 dark:text-gray-900">
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-7 h-7">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
									</svg>
								</div>
							</div>
							<div class="ml-4">
								<h4 class="text-lg font-medium leadi dark:text-gray-50">ป้องกันภาวะแทรกซ้อน</h4>
								<p class="mt-2 dark:text-gray-400">การควบคุมระดับน้ำตาลในเลือดช่วยลดความเสี่ยงต่อภาวะแทรกซ้อนที่สามารถเกิดขึ้นจากเบาหวาน เช่น โรคหัวใจ, โรคไต, และอาการของภาวะแทรกซ้อนเรื้อรัง</p>
							</div>
						</div>
						<div class="flex">
							<div class="flex-shrink-0">
								<div class="flex items-center justify-center w-12 h-12 rounded-md dark:bg-violet-400 dark:text-gray-900">
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-7 h-7">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
									</svg>
								</div>
							</div>
							<div class="ml-4">
								<h4 class="text-lg font-medium leadi dark:text-gray-50">เพิ่มคุณภาพชีวิต</h4>
								<p class="mt-2 dark:text-gray-400">การรักษาเบาหวานด้วยการควบคุมระดับน้ำตาลในเลือดอย่างเหมาะสมช่วยลดอาการที่เกิดขึ้นจากโรคเบาหวาน และสามารถเพิ่มคุณภาพชีวิตของผู้ป่วยได้</p>
							</div>
						</div>
					</div>
				</div>
				<div aria-hidden="true" class="mt-10 lg:mt-0">
					<img src="/f1.png" alt="" class="mx-auto rounded-lg shadow-lg dark:bg-gray-500">
					<img src="/g.png" alt="" class="mx-auto mt-4 rounded-lg shadow-lg dark:bg-gray-500">
				</div>
			</div>
			<div>
				<div class="grid lg:gap-8 lg:grid-cols-2 lg:items-center">
					<div class="lg:col-start-2">
						<h3 class="text-2xl font-bold tracki sm:text-3xl dark:text-gray-50">แสดงสถิติและประวัติการบันทึกค่าน้ำตาล</h3>
						<p class="mt-3 text-lg dark:text-gray-400">สามารถดูผลการบันทึกค่าน้ำตาลย้อนหลังได้</p>
						<div class="mt-12 space-y-12">
							<div class="flex">
								<div class="flex-shrink-0">
									<div class="flex items-center justify-center w-12 h-12 rounded-md dark:bg-violet-400 dark:text-gray-900">
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-7 h-7">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
										</svg>
									</div>
								</div>
								<div class="ml-4">
									<h4 class="text-lg font-medium leadi dark:text-gray-50">แก้ไข และ ลบ</h4>
									<p class="mt-2 dark:text-gray-400">ในกรณีที่มีการกรอกค่าน้ำตาลผิดพลาด สามารถแก้ไขผลการบันทึก หรือลบประวัติการบันทึกที่ต้องการได้</p>
								</div>
							</div>
							
							<div class="flex">
								<div class="flex-shrink-0">
									<div class="flex items-center justify-center w-12 h-12 rounded-md dark:bg-violet-400 dark:text-gray-900">
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-7 h-7">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
										</svg>
									</div>
								</div>
								<div class="ml-4">
									<h4 class="text-lg font-medium leadi dark:text-gray-50">วิเคราะห์สถิติ</h4>
									<p class="mt-2 dark:text-gray-400">สามารถเลือกวันที่ หรือช่วงระยะเวลาที่ต้องการ เพื่อดูว่าในช่วงเวลานั้นๆมีระดับน้ำตาลในเลือดอยู่ในเกณฑ์ใดกี่ครั้ง และคิดเป็นกี่เปอร์เซ็นต์</p>
								</div>
							</div>
						</div>
					</div>
					<div class="mt-10 lg:mt-0 lg:col-start-1 lg:row-start-1">
						<img src="/f2.png" alt="" class="mx-auto rounded-lg shadow-lg dark:bg-gray-500">
					</div>
				</div>
			</div>

			<!-- 3,4------------------------------------------------------------- -->
			<div class="grid lg:gap-8 lg:grid-cols-2 lg:items-center py-10">
				<div>
					<h3 class="text-2xl font-bold tracki sm:text-3xl dark:text-gray-50">คุยกับพยาบาล</h3>
					<p class="mt-3 text-lg dark:text-gray-400">ในระบบสามารถติดต่อปรึกษาสิ่งต่างๆกับพยาบาลได้โดยผ่านการพิมพ์แชท</p>
					<div class="mt-12 space-y-12">
						<div class="flex">
							<div class="flex-shrink-0">
								<div class="flex items-center justify-center w-12 h-12 rounded-md dark:bg-violet-400 dark:text-gray-900">
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-7 h-7">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
									</svg>
								</div>
							</div>
							<div class="ml-4">
								<h4 class="text-lg font-medium leadi dark:text-gray-50">Chatbot AI</h4>
								<p class="mt-2 dark:text-gray-400">สามารถส่งคำถามเบื้องต้นเพื่อให้ Chatbot ตอบข้อความอัตโนมัติตอบกลับสิ่งที่ต้องการ</p>
							</div>
						</div>
						<div class="flex">
							<div class="flex-shrink-0">
								<div class="flex items-center justify-center w-12 h-12 rounded-md dark:bg-violet-400 dark:text-gray-900">
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-7 h-7">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
									</svg>
								</div>
							</div>
							<div class="ml-4">
								<h4 class="text-lg font-medium leadi dark:text-gray-50">Real-Time Chat with Nurse</h4>
								<p class="mt-2 dark:text-gray-400">สามารถรับการปรึกษากับพยาบาลได้สะดวกโดยการแชทกับพยาบาลแบบ Real-Time</p>
							</div>
						</div>
						
					</div>
				</div>
				<div aria-hidden="true" class="mt-10 lg:mt-0">
					<img src="/f3.png" alt="" class="mx-auto rounded-lg shadow-lg dark:bg-gray-500">
				</div>
			</div>
			<div>
				<div class="grid lg:gap-8 lg:grid-cols-2 lg:items-center mb-10">
					<div class="lg:col-start-2">
						<h3 class="text-2xl font-bold tracki sm:text-3xl dark:text-gray-50">สาระความรู้</h3>
						<p class="mt-3 text-lg dark:text-gray-400">ฟีเจอร์นี้เป็นการนำเสนอคลิปเพื่อให้ความรู้ที่จำเป็นเกี่ยวกับโรคเบาหวานสำหรับผู้ป่วยเบาหวาน จากแหล่งข้อมูลที่เชื่อถือได้</p>
						<div class="mt-12 space-y-12">
								
						</div>
					</div>
					<div class="mt-10 lg:mt-0 lg:col-start-1 lg:row-start-1">
						<img src="/f4.png" alt="" class="mx-auto rounded-lg shadow-lg dark:bg-gray-500">
					</div>
				</div>
			</div>
		</div>
	</div>
	<Footer></Footer>
</div>
</section>
  
</template>

<style></style>
