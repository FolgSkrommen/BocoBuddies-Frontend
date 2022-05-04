<script setup lang="ts">
const formData: PostContactRequest = {
	email: '',
	firstName: '',
	lastName: '',
	message: '',
}

function handleSubmit() {}
</script>

<template>
	<form @submit.prevent="handleSubmit" class="grid gap-4">
		<div class="grid gap-4 grid-cols-2">
			<div class="grid">
				<label>Fornavn</label>
				<input required v-model="formData.firstName" type="text" />
			</div>
			<div class="grid">
				<label>Etternavn</label>
				<input required v-model="formData.lastName" type="text" />
			</div>
		</div>
		<div class="grid">
			<label>E-post</label>
			<input required v-model="formData.email" type="email" />
		</div>
		<div class="grid">
			<label>Etternavn</label>
			<textarea required v-model="formData.message" rows="6"></textarea>
		</div>
		<button type="submit" class="place-self-end">Send</button>
	</form>
</template>
