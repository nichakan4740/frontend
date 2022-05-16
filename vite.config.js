import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
export default defineConfig({
  plugins: [vue()],

  server:{
  base:'/kw2/',
 /*  proxy: {
    '/api':{
      target: 'http://intproj21.sit.kmutt.ac.th',
      changeOrigin:true,
      secure:false,
      rewrite: (path)=>path.replace(/^\/api/,'')
    }
  } */
}
})



