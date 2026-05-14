// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',

  devtools: {
    enabled: false
  },

  css: ['~/assets/css/main.css'],

  modules: ['@pinia/nuxt'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  vite: {
    build: {
      sourcemap: false
    },
    css: {
      devSourcemap: false
    }
  },

  nitro: {
    preset: 'firebase',
    firebase: {
      gen: 2,
      region: 'asia-northeast1'
    }
  },
})