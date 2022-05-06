import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import router from './router'
import { store, key } from './store'
import axios from 'axios'

import VueGoogleMaps from '@fawmi/vue-google-maps'

document.title = 'Boco Buddies'

if (import.meta.env.VITE_USE_CUSTOM_IP == 'true') {
	axios.defaults.baseURL = import.meta.env.VITE_IP
	console.log(axios.defaults.baseURL)
} else {
	axios.defaults.baseURL = 'http://localhost:8001'
}
axios.defaults.headers.post = { 'Content-Type': 'application/json' }
console.log(axios.defaults.baseURL)

const userString = localStorage.getItem('userData')
if (userString) {
	const userData = JSON.parse(userString)
	store.commit('SET_USER_DATA', userData)
}
const token = localStorage.getItem('token')
if (token) {
	const tokenData = JSON.parse(token)
	store.commit('SET_TOKEN', tokenData)
}

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

createApp(App)
	.use(router)
	.use(store, key)
	.use(VueGoogleMaps, {
		load: {
			key: apiKey,
		},
	})
	.mount('#app')
