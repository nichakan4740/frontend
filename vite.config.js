import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
export default defineConfig({
  plugins: [vue()],
  base:'/kw2/',
  server:{
   proxy:{
     '/api':{
      target: 'http://intproj21.sit.kmutt.ac.th:8080/kw2/api/booking',
      changeOrigin: true,
      secure: false,
      rewrite: (path) => path.replace(/^\/api/, '')
     }
   }
  }
})



