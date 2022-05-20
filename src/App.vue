<script setup></script>

<template>

  <header class="header-area header-sticky">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <nav class="main-nav">
            <!-- ***** Logo Start ***** -->
            <a class="logo">
              <img src="./assets/booking.png" alt="Softy Pinko" />
            </a>
            <!-- ***** Logo End ***** -->
            <!-- ***** Menu Start ***** -->
            <ul class="nav">
              <li>
                <a class="active"
                  ><router-link :to="{ name: 'home' }">Home</router-link></a
                >
              </li>

              <li>
                <a
                  ><router-link :to="{ name: 'showcategory' }"
                    >Category</router-link
                  ></a
                >
              </li>

              <li>
                <a
                  ><router-link :to="{ name: 'showeventall' }"
                    >Event All</router-link
                  ></a
                >
              </li>

              <li>
                <a
                  ><router-link :to="{ name: 'addevent' }"
                    >Booking</router-link
                  ></a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </header>

  <router-view />
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500&display=swap");

.header-area {
  position: fixed;
  top: -150px;
  left: 0px;
  right: 0px;
  z-index: 100;
  height: 100px;
  -webkit-transition: all 0.3s ease 0s;
  -moz-transition: all 0.3s ease 0s;
  -o-transition: all 0.3s ease 0s;
  transition: all 0.3s ease 0s;
}

.header-area .main-nav {
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
  border-radius: 40px;
  min-height: 80px;
  background: rgb(250, 250, 250);
}

.header-area .main-nav .logo img {
  -webkit-transition: all 0.3s ease 0s;
  -moz-transition: all 0.3s ease 0s;
  -o-transition: all 0.3s ease 0s;
  transition: all 0.3s ease 0s;
  margin-top: 16px;
  margin-left: 30px;
  width: 20%;
}

.header-area .main-nav .nav {
  float: right;
  margin-top: 27px;
  margin-left: 0px;
  margin-right: 30px;
  -webkit-transition: all 0.3s ease 0s;
  -moz-transition: all 0.3s ease 0s;
  -o-transition: all 0.3s ease 0s;
  transition: all 0.3s ease 0s;
  position: relative;
  z-index: 999;
}

.header-area .main-nav .nav li {
  padding-left: 30px;
  padding-right: 30px;
}

.header-area .main-nav .nav li:last-child {
  padding-right: 50px;
}

.header-area .main-nav .nav li a {
  display: block;
  font-weight: 700;
  font-size: 15px;
  color: #fff;
  -webkit-transition: all 0.3s ease 0s;
  -moz-transition: all 0.3s ease 0s;
  -o-transition: all 0.3s ease 0s;
  transition: all 0.3s ease 0s;
  height: 40px;
  line-height: 40px;
  border: transparent;
  letter-spacing: 1px;
  text-decoration: none;
  opacity: 0.9;
}

.header-area .main-nav .nav li a:hover {
  color: #ff589e;
}

.header-area.header-sticky .nav {
  margin-top: 20px !important;
}

.header-area.header-sticky .nav li a {
  color: #1e1e1e;
}

.active {
  background-color: #dddde0b4;
  border-radius: 30px;
  padding-left: 18px;
  padding-right: 18px;
}
</style>
