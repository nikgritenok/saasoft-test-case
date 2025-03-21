import './assets/main.css'
import 'primeicons/primeicons.css'

import { createPinia } from 'pinia'
import Button from 'primevue/button'
import PrimeVue from 'primevue/config'
import { createApp } from 'vue'
import Aura from '@primeuix/themes/aura'
import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})

app.component('app-button', Button)

app.mount('#app')
