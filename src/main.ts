import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import router from './router'
import { store, key } from './store'
import axios from 'axios'

//axios.defaults.baseURL = import.meta.env.VITE_IP
axios.defaults.baseURL = 'http://localhost:8001'
axios.defaults.headers.post = { 'Content-Type': 'application/json' }

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

createApp(App).use(router).use(store, key).mount('#app')
