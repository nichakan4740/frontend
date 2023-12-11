<script setup>
import Layout from "../layouts/Layout.vue";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

//links
//http://eloquentjavascript.net/09_regexp.html
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions

var messages = [], //array that hold the record of each string in chat
  lastUserMessage = "", //keeps track of the most recent input string from the user
  botMessage = "", //var keeps track of what the chatbot is going to say
  botName = "Chatbot", //name of the chatbot
  talking = true; //when false the speach function doesn't work

//edit this function to change what the chatbot says
function chatbotResponse() {
  talking = true;
  botMessage = "ขอโทษค่ะ กรุณาพิมพ์ตัวเลขที่กำหนด"; //the default message

  if (
    lastUserMessage === "1" ||
    lastUserMessage == "ข้อ 1" ||
    lastUserMessage == "ข้อ1"
  ) {
    const one = [
      "ดื่มน้ำสะอาดมากๆ หากอาการดีขึ้น ควรตรวจเลือด และปัสสาวะซ้ำทุก 4 ชม. รวมถึงดื่มน้ำสะอาดมากๆ",
      "หยุดทํากิจกรรม และนอนพัก หากมีอาการชักกระตุกเฉพาะที่ หรือมีอาการซึม และมีระดับน้ำตาลในเลือดมาก ให้พบแพทย์ทันที",
    ];
    botMessage = one[Math.floor(Math.random() * one.length)];
  }

  if (
    lastUserMessage === "2" ||
    lastUserMessage == "ข้อ 2" ||
    lastUserMessage == "ข้อ2"
  ) {
    const one = [
      "ไม่ควรปรับยาด้วยตนเองโดยไม่ปรึกษาแพทย์ก่อน",
      "ฉีดอินซูลินหรือกินยาลดระดับน้ำตาลในเลือดตามแพทย์สั่ง ไม่เพิ่มหรือลดยาเอง (ยกเว้นกรณีแพทย์แนะนำให้ปรับยาเองได้) ",
    ];
    botMessage = one[Math.floor(Math.random() * one.length)];
  }

  if (
    lastUserMessage === "1" ||
    lastUserMessage == "ข้อ 1" ||
    lastUserMessage == "ข้อ1"
  ) {
    const one = [
      "ดื่มน้ำสะอาดมากๆ หากอาการดีขึ้น ควรตรวจเลือด และปัสสาวะซ้ำทุก 4 ชม. รวมถึงดื่มน้ำสะอาดมากๆ",
      "หยุดทํากิจกรรม และนอนพัก หากมีอาการชักกระตุกเฉพาะที่ หรือมีอาการซึม และมีระดับน้ำตาลในเลือดมาก ให้พบแพทย์ทันที",
    ];
    botMessage = one[Math.floor(Math.random() * one.length)];
  }

  if (
    lastUserMessage === "3" ||
    lastUserMessage == "ข้อ 3" ||
    lastUserMessage == "ข้อ3"
  ) {
    const one = [
      "กรุณารอสักครู่ ระบบกำลังส่งห้องแชทใหhเท่าน / พยาบาลจะตอบกลับภายใน 10 นาที",
    ];
    botMessage = one[Math.floor(Math.random() * one.length)];
  }
  // if (lastUserMessage === "name") {
  //   botMessage = "My name is " + botName;
  // }
}
//****************************************************************

//this runs each time enter is pressed.
//It controls the overall input and output
function newEntry() {
  //if the message from the user isn't empty then run
  if (document.getElementById("chatbox").value != "") {
    //pulls the value from the chatbox ands sets it to lastUserMessage
    lastUserMessage = document.getElementById("chatbox").value;
    //sets the chat box to be clear
    document.getElementById("chatbox").value = "";
    //adds the value of the chatbox to the array messages
    messages.push(lastUserMessage);
    //Speech(lastUserMessage);  //says what the user typed outloud
    //sets the variable botMessage in response to lastUserMessage
    chatbotResponse();
    //add the chatbot's name and message to the array messages
    messages.push("<b>" + botName + ":</b> " + botMessage);
    // says the message using the text to speech function written below
    //Speech(botMessage);
    //outputs the last few array elements of messages to html
    for (var i = 1; i < 8; i++) {
      if (messages[messages.length - i])
        document.getElementById("chatlog" + i).innerHTML =
          messages[messages.length - i];
    }
    console.log(document.getElementById("chatlog" + i));
  }
}

//text to Speech
//https://developers.google.com/web/updates/2014/01/Web-apps-that-talk-Introduction-to-the-Speech-Synthesis-API
function Speech(say) {
  if ("speechSynthesis" in window && talking) {
    var utterance = new SpeechSynthesisUtterance(say);
    //msg.voice = voices[10]; // Note: some voices don't support altering params
    //msg.voiceURI = 'native';
    //utterance.volume = 1; // 0 to 1
    //utterance.rate = 0.1; // 0.1 to 10
    //utterance.pitch = 1; //0 to 2
    //utterance.text = 'Hello World';
    //utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  }
}

//runs the keypress() function when a key is pressed
document.onkeypress = keyPress;
//if the key pressed is 'enter' runs the function newEntry()
function keyPress(e) {
  var x = e || window.event;
  var key = x.keyCode || x.which;
  if (key == 13 || key == 3) {
    //runs this function when enter is pressed
    newEntry();
  }
  if (key == 38) {
    console.log("hi");
    //document.getElementById("chatbox").value = lastUserMessage;
  }
}

//clears the placeholder text ion the chatbox
//this function is set to run when the users brings focus to the chatbox, by clicking on it
function placeHolder() {
  document.getElementById("chatbox").placeholder = "";
  // ดึงอินพุตที่ต้องการ
  const chatbox = document.getElementById("chatbox");

  // เพิ่ม event listener เมื่อมีการ focus บน input element
  chatbox.addEventListener("focus", placeHolder);
}
</script>

<template>
  <Layout class="bg-gradient-to-b from-blue-100">
    <div class="container mx-auto">
      <div
        class="box-content p-3 ml-5 mr-5 mt-10 bg-gradient-to-b from-blue-900 to-blue-800 shadow-lg shadow-slate-500/50 rounded-lg"
      >
        <h2 class="font-semibold text-xl text-center text-slate-200">
          คุยกับเรา
        </h2>
      </div>

      <div
        class="box-content bg-white shadow-lg shadow-gray-300/50 mt-10 ml-5 mr-5 pt-6 pb-6 pl-20 pr-20 mb-10 rounded-lg"
      >
        <p>
          สวัสดีค่ะ คุณต้องการทราบอะไร <br />
          1. น้ำตาลในเลือดสูง ควรทำอย่างไร <br />
          2. น้ำตาลต่ำสามารถลดยาเองเลยได้หรือไม่ <br />
          3. ติดต่อพยาบาล <br />
          กรุณาพิมพ์เลขข้อที่ต้องการ ขออภัยในความไม่สะดวกอยู่ในช่วงพัฒนา
        </p>
        <div id="chatborder">
          <p id="chatlog8" class="chatlog">&nbsp;</p>
          <p id="chatlog7" class="chatlog">&nbsp;</p>
          <p id="chatlog6" class="chatlog">&nbsp;</p>
          <p id="chatlog5" class="chatlog">&nbsp;</p>
          <p id="chatlog4" class="chatlog">&nbsp;</p>
          <p id="chatlog3" class="chatlog">&nbsp;</p>
          <p id="chatlog2" class="chatlog">&nbsp;</p>
          <p id="chatlog1" class="chatlog">&nbsp;</p>
          <br />
        </div>
        <input
          type="text"
          name="chat"
          id="chatbox"
          placeholder="พิมพ์ข้อความที่นี่"
          class="p-3"
        />
      </div>

      <div class="mb-8 ml-2 mr-4">
        <p class="text">
          หากมีคำถามเพิ่มเติมหรือต้องการความช่วยเหลือเพิ่มเติมใด ๆ
          ก็อย่าลังเลที่จะสอบถามมานะคะ ฉันยินดีที่ได้ช่วยเสมอค่ะ!
        </p>
        <p class="text">
          **ขออภัยในเรื่องของขอมูลในการตอบคำถาม กำลังอยู่ในช่วงพัฒนา**
        </p>
      </div>
    </div>
  </Layout>
</template>

<style>
#bodybox {
  margin: auto;
  max-width: 600px;
  font: 15px arial, "Prompt", sans-serif;
  background-color: white;
  border-style: solid;
  border-width: 1px;
  padding-top: 20px;
  padding-bottom: 15px;
  padding-right: 20px;
  padding-left: 20px;
  box-shadow: 5px 5px 5px grey;
  border-radius: 15px;
}

#chatborder {
  border-style: solid;
  background-color: #f6f9f6;
  border-width: 3px;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 1px;
  margin-right: 1px;
  padding-top: 10px;
  padding-bottom: 15px;
  padding-right: 10px;
  padding-left: 15px;
  border-radius: 15px;
  max-height: 300px;
  font: 17px arial, "Prompt", sans-serif;
}

.chatlog {
  font: 15px arial, "Prompt", sans-serif;
}

#chatbox {
  font: 17px arial, "Prompt", sans-serif;
  height: 22px;
  width: 100%;
  border-style: solid;
  border-width: 1.5px;
  border-radius: 5px;
  background-color: #f6f9f6;
}

h1 {
  margin: auto;
  font: 17px arial, "Prompt", sans-serif;
}

pre {
  background-color: #f0f0f0;
  margin-left: 20px;
  font: 17px arial, "Prompt", sans-serif;
}

.text {
  font: 16px arial, "Prompt", sans-serif;
  color: #0047ab;
  text-align: center;
  margin-bottom: 8px;
}
</style>
