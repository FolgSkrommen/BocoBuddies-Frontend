<script setup lang="ts">
import { stat } from 'fs'
import Card from '../components/Card.vue'
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { useStore } from '../store'
import BaseBtn from '../components/Base/BaseBtn.vue'
import BaseInput from '../components/Base/BaseInput.vue'
import { ref } from 'vue'

const { state } = useStore()
const newEmail = ref('')
const newPassword = ref('')
if (state.user) {
	newEmail.value = state.user.email
}

function updateUser() {
	//TODO: Implement
}

function logout() {
	//TODO: Implement
}

function deleteUser() {
	//TODO: Implement
}
</script>

<template>
	<div v-if="state.user" class="grid gap-4">
		<h1 class="text-xl font-bold">Innstillinger</h1>
		<div class="grid">
			<img
				class="rounded-full"
				:src="state.user.pictureUrl"
				:alt="state.user.email"
			/>
			<div class="flex gap-2 text-lg font-bold">
				<p>{{ state.user.firstName }}</p>
				<p>{{ state.user.lastName }}</p>
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
