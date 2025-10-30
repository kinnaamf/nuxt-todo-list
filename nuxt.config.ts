// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/fonts'],
  runtimeConfig: {
    app: {
      api: 'http://localhost:5000'
    }
  },
  css: ['~/assets/css/transitions.pcss', '~/assets/css/styles.pcss']
})