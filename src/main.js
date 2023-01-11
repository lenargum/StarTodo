import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import './assets/css/reset.css'
import './assets/css/typography.scss'


const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')
