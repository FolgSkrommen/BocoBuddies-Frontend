<script setup lang="ts">
import { store } from '../../store'
import BaseBtn from '../../components/base/BaseBtn.vue'
import BaseInput from '../../components/base/BaseInput.vue'
import ImageCarousel from '../../components/ImageCarousel.vue'
import BasePopup from '../../components/base/BasePopup.vue'
import { Ref, ref } from 'vue'
import router from '../../router'
import axios from 'axios'
import LoadingIndicator from '../../components/base/LoadingIndicator.vue'
import BaseBanner from '../../components/base/BaseBanner.vue'
import { PostUserRegisterRequest } from '../../api/user/register'
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
			params: { user: store.state.user.userId, useAuth: false },
		})
		await store.dispatch('edit', res.data)
		imagePreview = ref([])
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

function resetTips() {
	let cookies = document.cookie.split(';')

	for (let i = 0; i < cookies.length; i++) {
		let cookie = cookies[i]
		let eqPos = cookie.indexOf('=')
		let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
		document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
	}
	store.dispatch('info', 'Alle tips vil nå vises igjen')
}

function deleteUser() {
	//TODO: Implement
}

const seenHomeCookie = ('; ' + document.cookie)
	.split(`; seenSettingsTutorial=`)
	.pop()
	.split(';')[0]

if (!seenHomeCookie.includes('true')) {
	store.dispatch(
		'info',
		"Dette er inntsillingssiden din. Her kan du oppdatere brukerdataen din, logge ut, slette brukeren din og laste opp profilbilde. Du kan også klikke knappen 'Vis alle tips igjen' for å få opp disse meldingen igjen Klikk X knappen for å lukke denne meldingen."
	)
	const seenHomeTutorial = (document.cookie =
		'seenSettingsTutorial=true; max-age=31536000')
}

let showUploadPicture = ref<boolean>(false)
</script>

<template>
	<div v-if="store.state.user" class="grid gap-4">
		<BasePopup v-if="showUploadPicture" @exit="showUploadPicture = false">
			<div class="flex justify-center">
				<div class="rounded-lg shadow-xl bg-gray-50">
					<div class="m-4">
						<div
							class="grid gap-4 place-items-center"
							v-if="imagePreview.length > 0"
						>
							<h3 class="">
								Forhåndsvisning av ditt nye profilbilde:
							</h3>
							<img
								class="w-32 h-32 object-cover rounded-full"
								:src="imagePreview[0]"
								alt=""
							/>
						</div>
						<label class="inline-block mb-2 text-gray-500"
							>Last opp profilbilde(jpg, png, jpeg)</label
						>
						<div class="flex items-center justify-center w-full">
							<label
								class="flex flex-col w-full h-20 border-4 border-dashed hover:bg-gray-100 hover:border-gray-300"
							>
								<div
									class="flex flex-col items-center justify-center pt-6"
								>
									<p
										class="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600"
									>
										Velg et bilde
									</p>
								</div>
								<input
									type="file"
									accept="image/*"
									@input="event => uploadImage(event.target)"
									class="opacity-0"
								/>
							</label>
						</div>
					</div>
					<div class="flex p-2 space-x-4">
						<BaseBtn
							class="m-4 place-self-center w-full"
							@click="uploadPicture"
							>Last opp</BaseBtn
						>
					</div>
				</div>
			</div>
		</BasePopup>
		<h1>Innstillinger</h1>
		<div class="grid gap-1">
			<div
				class="group w-32 h-42 hover:cursor-pointer"
				@click="showUploadPicture = true"
			>
				<img
					v-if="store.state.user.profilePicture"
					:src="store.state.user.profilePicture"
					alt=""
					class="w-32 h-32 object-cover rounded-full group-hover:hidden"
				/>
				<img
					v-if="store.state.user.profilePicture"
					src="https://media.istockphoto.com/vectors/black-plus-sign-positive-symbol-vector-id688550958?k=20&m=688550958&s=612x612&w=0&h=wvzUqT3u3feYygOXg3GB9pYBbqIsyu_xpvfTX-6HOd0="
					alt=""
					class="w-32 h-32 object-cover rounded-full hidden group-hover:block group-hover:cursor-pointer"
				/>
				<label class="text-xs hover:cursor-pointer"
					>Oppdater profilebilde</label
				>
			</div>

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
		<BaseBtn to="/faq" color="blue">FAQ</BaseBtn>

		<BaseBtn @click="logout" color="gray">Logg ut</BaseBtn>
		<BaseBtn @click="deleteUser" color="red">Slett bruker</BaseBtn>
		<BaseBtn
			v-if="!store.state.user.verified"
			@click="sendVerificationEmail"
			color="blue"
			>Send ny verfikasjon på epost</BaseBtn
		>
		<BaseBtn @click="resetTips" color="blue">Vis alle tips igjen</BaseBtn>
	</div>
	<div v-else>
		<p>No user</p>
	</div>
</template>
