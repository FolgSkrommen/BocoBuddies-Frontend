<script setup lang="ts">
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { store } from '../store'
import BaseBtn from '../components/base/BaseBtn.vue'
import BaseInput from '../components/base/BaseInput.vue'
import { ref } from 'vue'
import router from '../router'
import { UserIcon } from '@heroicons/vue/solid'

const newEmail = ref('')
const newPassword = ref('')

if (store.state.user) {
	newEmail.value = store.state.user.email
}

function updateUser() {
	//TODO: Implement
}

async function logout() {
	await store.dispatch('logout')
	await router.push('/')
	console.log('logging out')
}

function deleteUser() {
	//TODO: Implement
}
</script>

<template>
	<div v-if="store.state.user" class="grid gap-4">
		<h1 class="text-xl font-bold">Innstillinger</h1>
		<div class="grid gap-1">
			<!--
				<img
				class="rounded-full min-w-1/2 min-h-1/2"
				:src="store.state.user.pictureUrl"
				:alt="store.state.user.email"
			/>
			-->

			<div class="flex gap-2 text-lg font-bold">
				<p>{{ store.state.user.firstName }}</p>
				<p>{{ store.state.user.lastName }}</p>
			</div>
		</div>
		<form class="grid gap-4" @submit.prevent="updateUser">
			<BaseInput label="Email" v-model="newEmail" />
			<BaseInput label="Password" v-model="newPassword" />
			<BaseBtn type="submit">Change user</BaseBtn>
		</form>
		<BaseBtn @click="logout" color="gray">Logout</BaseBtn>
		<BaseBtn @click="deleteUser" color="red">Delete user</BaseBtn>
	</div>
	<div v-else>
		<p>No user</p>
	</div>
</template>
