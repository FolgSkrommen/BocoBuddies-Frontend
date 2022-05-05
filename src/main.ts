import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import router from './router'
import { store, key } from './store'
import axios from 'axios'
import VueGoogleMaps from '@fawmi/vue-google-maps'

//axios.defaults.baseURL = import.meta.env.VITE_IP
axios.defaults.baseURL = 'http://10.24.26.184:8001'
axios.defaults.headers.post = { 'Content-Type': 'application/json' }

const userString = localStorage.getItem('userData')
if (userString) {
	const userData = JSON.parse(userString)
	store.commit('SET_USER_DATA', userData)
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
