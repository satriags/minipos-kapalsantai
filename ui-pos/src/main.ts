import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'animate.css/animate.min.css'
import VueApexCharts from 'vue3-apexcharts'
import GoogleLogin from 'vue3-google-login'

import '@/assets/scss/custom_bootstrap.scss' // Import file custom SCSS
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import { globalFormatter } from './mixins/formatter'

const app = createApp(App)

app.use(router)
app.use(VueApexCharts)
app.use(GoogleLogin, {
  clientId: window.__APP_CONFIG__?.CLIENT_ID,
})
app.mixin(globalFormatter) // Daftarkan mixin global

app.mount('#app')
