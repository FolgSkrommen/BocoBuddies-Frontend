<script setup lang="ts">
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { store } from '../store'
import BaseBtn from '../components/base/BaseBtn.vue'
import BaseInput from '../components/base/BaseInput.vue'
import ImageCarousel from '../components/ImageCarousel.vue'
import BasePopup from '../components/base/BasePopup.vue'
import { onMounted, Ref, ref } from 'vue'
import router from '../router'
import axios from 'axios'

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

let imagePreview: Ref<string[]> = ref([])
let imageFiles: Ref<File[]> = ref([])
function uploadImage(input: any) {
	let count = input.files.length
	let index = 0
	imagePreview.value.push(URL.createObjectURL(input.files[index]))
	imageFiles.value = input.files
}

const showModal = ref(false)
async function uploadPicture() {
	const formData = new FormData()
	formData.append('image', imageFiles.value[0])
	await axios.post('/user/uploadProfilePicture', formData).then(response => {
		showModal.value = !showModal.value
	})
}

function closeModal() {
	showModal.value = !showModal.value
	location.reload()
}

let profilePicture = ''
onMounted(() => {
	axios.get('/user/getProfilePicture').then(response => {
		profilePicture = response.data
		console.log(profilePicture)
	})
})

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
		<input
			type="file"
			@input="event => uploadImage(event.target)"
			class="place-self-center"
		/>
		<ImageCarousel
			v-if="imagePreview.length > 0"
			:images="imagePreview"
			class="h-52 place-self-center"
		/>
		<BaseBtn class="m-4 place-self-center" @click="uploadPicture"
			>Upload</BaseBtn
		>
	</div>
	<div v-else>
		<p>No user</p>
	</div>
	<BasePopup v-show="showModal" @exit="closeModal"
		>Profilbilde ditt er oppdatert!</BasePopup
	>
</template>
