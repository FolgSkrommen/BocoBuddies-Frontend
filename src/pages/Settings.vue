<script setup lang="ts">
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
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
const errorMessage = ref()

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
	uploadProfilePictureStatus.value = 'sending'
	const formData = new FormData()
	formData.append('image', imageFiles.value[0])
	//TODO: Typescript for dette
	try {
		await axios.post('/user/uploadProfilePicture', formData)
		uploadProfilePictureStatus.value = 'success'
		const res = await axios.get('/user', {
			params: { user: store.state.user?.id },
		})
		await store.dispatch('edit', res.data)
		await router.push('/user')
	} catch (error) {
		uploadProfilePictureStatus.value = 'error'
		errorMessage.value = error
	}
}

function deleteUser() {
	//TODO: Implement
}
</script>

<template>
	<div v-if="store.state.user" class="grid gap-4">
		<BaseBanner
			v-if="uploadProfilePictureStatus === 'success'"
			type="success"
			message="Bildet er lastet opp"
		/>
		<h1 class="text-xl font-bold">Innstillinger</h1>
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
			<BaseBtn type="submit">Change user</BaseBtn>
		</form>
		<BaseBtn @click="logout" color="gray">Logout</BaseBtn>
		<BaseBtn @click="deleteUser" color="red">Delete user</BaseBtn>
		<BaseBtn
			v-if="!store.state.user.verified"
			@click="sendVerificationEmail"
			color="blue"
			>Send new verification email</BaseBtn
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
			>Upload</BaseBtn
		>
	</div>
	<div v-else>
		<p>No user</p>
	</div>
</template>
