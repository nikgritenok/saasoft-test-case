import './assets/main.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

import { createPinia } from 'pinia'
import Button from 'primevue/button'
import Card from 'primevue/card'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import ConfirmDialog from 'primevue/confirmdialog'
import Divider from 'primevue/divider'
import IftaLabel from 'primevue/iftalabel'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import Password from 'primevue/password'
import Select from 'primevue/select'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import { createApp } from 'vue'
import Aura from '@primeuix/themes/aura'
import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.dark',
    },
  },
})
app.use(ConfirmationService)
app.use(ToastService)

app.component('app-button', Button)
app.component('app-input', InputText)
app.component('app-select', Select)
app.component('app-password', Password)
app.component('app-message', Message)
app.component('app-divider', Divider)
app.component('app-iftalabel', IftaLabel)
app.component('app-confirmdialog', ConfirmDialog)
app.component('app-toast', Toast)
app.component('app-card', Card)
app.mount('#app')
