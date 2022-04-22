<script setup lang="ts">
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import NavBar from './components/NavBar.vue'
import axios from 'axios'
import { store } from './store'

axios.defaults.baseURL = 'http://localhost:8001'
axios.defaults.headers.post = { 'Content-Type': 'application/json' }

const userString = localStorage.getItem('userData')
if (userString) {
	const userData = JSON.parse(userString)
	store.commit('SET_USER_DATA', userData)
}
</script>

<template>
	<div>
		<NavBar />
		<div class="container mx-auto p-4">
			<router-view></router-view>
		</div>
	</div>
</template>
