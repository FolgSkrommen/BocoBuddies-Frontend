<script setup lang="ts">
import { store } from '../store'
import BaseBtn from '../components/base/BaseBtn.vue'
import BaseInput from '../components/base/BaseInput.vue'
import ImageCarousel from '../components/ImageCarousel.vue'
import BasePopup from '../components/base/BasePopup.vue'
import { Ref, ref } from 'vue'
import router from '../router'
import axios from 'axios'
import LoadingIndicator from '../components/base/LoadingIndicator.vue'
import BaseBanner from '../components/base/BaseBanner.vue'
import { PostUserRegisterRequest } from '../api/user/register'
type Status = 'loading' | 'loaded' | 'error'

const newEmail = ref('')
const newPassword = ref('')

if (store.state.user) {
	newEmail.value = store.state.user.email as string
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

type UploadStatus = 'sending' | 'success' | 'error'
const uploadProfilePictureStatus = ref<UploadStatus>()
async function uploadPicture() {
	if (!store.state.user) return
	uploadProfilePictureStatus.value = 'sending'
	const formData = new FormData()
	formData.append('image', imageFiles.value[0])
	//TODO: Typescript for dette
	try {
		await axios.post('/user/uploadProfilePicture', formData)
		uploadProfilePictureStatus.value = 'success'
		const res = await axios.get('/user', {
			params: { user: store.state.user.userId },
		})
		await store.dispatch('edit', res.data)
		await router.push('/user')
	} catch (error: any) {
		uploadProfilePictureStatus.value = 'error'
		store.dispatch('error', error.message)
	}
}

async function sendVerificationEmail() {
	try {
		const res = await axios.post('/verify/sendVerificationEmail')
	} catch (error) {
		console.log(error)
	}
}

function deleteUser() {
	//TODO: Implement
}
</script>

<template>
	<div v-if="store.state.user" class="grid gap-4">
		<h1>Innstillinger</h1>
		<div class="grid gap-1">
			<img
				v-if="store.state.user.profilePicture"
				:src="store.state.user.profilePicture"
				alt=""
				class="w-32 h-32 object-cover rounded-full"
			/>

			<div class="flex gap-2 text-lg font-bold">
				<p>{{ store.state.user.firstName }}</p>
				<p>{{ store.state.user.lastName }}</p>
			</div>
		</div>
		<form class="grid gap-4" @submit.prevent="updateUser">
			<BaseInput label="Email" v-model="newEmail" />
			<BaseInput label="Password" v-model="newPassword" />
			<BaseBtn type="submit">Oppdater brukerdata</BaseBtn>
		</form>
		<BaseBtn @click="logout" color="gray">Logg ut</BaseBtn>
		<BaseBtn @click="deleteUser" color="red">Slett bruker</BaseBtn>
		<BaseBtn
			v-if="!store.state.user.verified"
			@click="sendVerificationEmail"
			color="blue"
			>Send ny verfikasjon på epost</BaseBtn
		>
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
			>Last opp</BaseBtn
		>
	</div>
	<div v-else>
		<p>No user</p>
	</div>
</template>
