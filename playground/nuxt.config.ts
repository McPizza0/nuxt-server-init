import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['../src/module'],
  serverInit: {
    scripts: ['example.init'],
    silent: false
  }

})
