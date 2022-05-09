import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
export default defineConfig({
  plugins: [vue()],
  base:'/kw2/',
  server:{
   proxy:{
     '/api':{
      target: 'http://intproj21.sit.kmutt.ac.th:8080',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
     }
   }
  }
})



