<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../store'

const router = useRouter()
const data = ref<PostContactRequest>({
	email: '',
	firstName: '',
	lastName: '',
	message: '',
})

if (store.state.user) {
	data.value.email = store.state.user.email as string
	data.value.firstName = store.state.user.firstName as string
	data.value.lastName = store.state.user.lastName as string
}

async function handleSubmit() {
	try {
		await axios.post('/contact', data.value)
		router.push('/')
	} catch (error: any) {
		store.dispatch('error', error.message)
	}
}
</script>

<template>
	<form @submit.prevent="handleSubmit" class="grid gap-4">
		<div class="grid gap-4 grid-cols-2">
			<div class="grid">
				<label>Fornavn</label>
				<input required v-model="data.firstName" type="text" />
			</div>
			<div class="grid">
				<label>Etternavn</label>
				<input required v-model="data.lastName" type="text" />
			</div>
		</div>
		<div class="grid">
			<label>E-post</label>
			<input required v-model="data.email" type="email" />
		</div>
		<div class="grid">
			<label>Melding</label>
			<textarea required v-model="data.message" rows="6"></textarea>
		</div>
		<button type="submit" class="place-self-end">Send</button>
	</form>
</template>
