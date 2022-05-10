import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
export default defineConfig({
  plugins: [vue()],
  base:'/kw2/',
  server: {
    origin: 'http://intproj21.sit.kmutt.ac.th/kw2/'
  }
  
  /* ,
  server:{
   proxy:{
     '/api':{
      target: 'http://intproj21.sit.kmutt.ac.th:8080/kw2',
      changeOrigin: true,
      secure: false,
      rewrite: (path) => path.replace(/^\/api/, '')
     }
   }
  } */
})



