// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css','vue3-carousel/dist/carousel.css'],
  plugins: ['~/plugins/firebase',],
  modules: ["@pinia/nuxt",],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  }, 
  ssr:false,

  build: {
    transpile: ['vue3-carousel','plotly.js-dist'],
  },
 
  
})
