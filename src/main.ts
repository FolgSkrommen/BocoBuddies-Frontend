import { createApp, onMounted } from 'vue'
import App from './App.vue'
import './index.css'
import router from './router'
import { store, key } from './store'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8001'
axios.defaults.headers.post = { 'Content-Type': 'application/json' }

const userString = localStorage.getItem('userData')
if (userString) {
	const userData = JSON.parse(userString)
	store.commit('SET_USER_DATA', userData)
}

createApp(App).use(router).use(store, key).mount('#app')
