import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
export default defineConfig({
  plugins: [vue()],
  base:'/kw2/',
  server:{
   proxy:{
     '/api':{
      target: 'http://backend:8080',
      changeOrigin: true,
      secure: false,
      rewrite: (path) => path.replace(/^\/api/, '')
     }
   }
  }
})



