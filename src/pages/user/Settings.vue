<script setup lang="ts">
import { store } from '../../store'
import BaseBtn from '../../components/base/BaseBtn.vue'
import BaseInput from '../../components/base/BaseInput.vue'
import ImageCarousel from '../../components/ImageCarousel.vue'

import {
	CheckCircleIcon,
	CheckIcon,
	XIcon,
	StarIcon,
	ChevronLeftIcon,
} from '@heroicons/vue/solid'

import { Ref, ref } from 'vue'
import * as yup from 'yup'

import router from '../../router'
import axios from 'axios'
import LoadingIndicator from '../../components/base/LoadingIndicator.vue'
import BaseBanner from '../../components/base/BaseBanner.vue'
import { PostUserRegisterRequest } from '../../api/user/register'
import { useForm, useField } from 'vee-validate'
import { SSL_OP_MICROSOFT_SESS_ID_BUG } from 'constants'
import { User } from '../../api/schema'
import UserCardAndBtnVue from '../../components/UserCardAndBtn.vue'
type Status = 'loading' | 'loaded' | 'error'

const schema = yup.object({
	newFirstName: yup.string().min(2, 'Minimum 2 tegn'),
	newLastName: yup.string().min(2, 'Minimum 2 tegn'),
	newEmail: yup.string().required('Epost er påkrevd').email('Ikke gyldig'),
	oldPassword: yup.string().required('Passord er påkrevd'),
	newPassword: yup
		.string()
		.required('Passord er påkrevd')
		.min(8, 'Minimum 8 tegn'),
	newPasswordConfirm: yup
		.string()
		.oneOf([yup.ref('newPassword'), null], 'Passorden er ulike'),
})

const { errors } = useForm({
	validationSchema: schema,
})

const { value: newFirstName } = useField<string>('newFirstName')
const { value: newLastName } = useField<string>('newLastName')
const { value: newEmail } = useField<string>('newEmail')
const { value: oldPassword } = useField<string>('oldPassword')
const { value: newPassword } = useField<string>('newPassword')
const { value: newPasswordConfirm } = useField<string>('newPasswordConfirm')

const editUser = ref(false)
const showChangePassword = ref(false)
const hasNotTypedOldPassword = ref(true)
const hasNotTypedNewPassword = ref(true)
const hasNotTypedConfirm = ref(true)

if (store.state.user) {
	newFirstName.value = store.state.user.firstName as string
	newLastName.value = store.state.user.lastName as string
	newEmail.value = store.state.user.email as string
}

async function updateUser() {
	if (!store.state.user) return

	let updatedUser = { ...store.state.user }

	updatedUser.profilePicture = undefined

	updatedUser.firstName = newFirstName.value
	updatedUser.lastName = newLastName.value
	updatedUser.email = newEmail.value

	try {
		await axios.put('/user', updatedUser)
		updatedUser.profilePicture = store.state.user.profilePicture
		store.state.user = updatedUser
		store.dispatch('successWithTimeout', {
			message: 'Brukerinformasjon er endret',
		})
		store.dispatch('edit', updatedUser)
	} catch (error: any) {
		store.dispatch('error', 'Noe gikk galt')
	}
}

async function changePassword() {
	try {
		await axios.put('/user/editPassword', {
			oldPassword: oldPassword.value,
			newPassword: newPassword.value,
		})

		store.dispatch('successWithTimeout', {
			message: 'Passord har blitt endret',
		})
		showChangePassword.value = false
	} catch (error: any) {
		store.dispatch('error', 'Passordet du skrev inn er ikke korrekt')
	}
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
		const picture = await axios.get('/user/getProfilePicture')

		let user = store.state.user
		user.profilePicture = picture.data
		await store.dispatch('edit', user)
		store.dispatch('successWithTimeout', { message: 'Nytt bilde lagret' })
		imagePreview.value = []
		imageFiles.value = []
	} catch (error: any) {
		uploadProfilePictureStatus.value = 'error'
		store.dispatch('error', error.message)
	}
}

async function sendVerificationEmail() {
	try {
		await axios.post('/verify/sendAgain')
		store.dispatch('successWithTimeout', { message: 'Ny e-post er sendt' })
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
	store.dispatch('successWithTimeout', { message: 'Tips vises igjen' })
}

function deleteUser() {
	//TODO: Implement
}

function cookie() {
	const seenSettingsCookie = ('; ' + document.cookie)
		.split(`; seenSettingsTutorial=`)
		.pop()
		?.split(';')[0]

	if (!seenSettingsCookie?.includes('true')) {
		store.dispatch(
			'info',
			"Dette er inntsillingssiden din. Her kan du oppdatere brukerdataen din, logge ut, slette brukeren din og laste opp profilbilde. Du kan også klikke knappen 'Vis alle tips igjen' for å få opp disse meldingen igjen Klikk X knappen for å lukke denne meldingen."
		)
		document.cookie = 'seenSettingsTutorial=true; max-age=31536000'
	}
}
cookie()
</script>

<template>
	<div v-if="store.state.user" class="grid gap-4 sm:w-96 mx-auto">
		<div class="flex gap-4">
			<router-link :to="`/user/${store.state.user.userId}`">
				<ChevronLeftIcon class="h-12 w-12" />
			</router-link>
			<h1>Innstillinger</h1>
		</div>
		<div class="flex gap-4">
			<div class="h-40 grid">
				<label class="grid w-fit">
					<img
						v-if="imagePreview[0]"
						class="w-32 h-32 object-cover rounded-full hover:cursor-pointer"
						:src="imagePreview[0]"
						data-testid="new-profile-picture"
						:alt="'Profilbilde'"
					/>
					<img
						v-else-if="store.state.user.profilePicture"
						:src="store.state.user.profilePicture"
						data-testid="profile-picture"
						:alt="'Profilbilde'"
						class="w-32 h-32 object-cover rounded-full hover:opacity-60 hover:cursor-pointer"
					/>
					<p
						v-if="!imagePreview[0]"
						class="text-xs hover:cursor-pointer text-center w-full"
						data-testid="change-picture-text"
					>
						Endre profilbilde
					</p>
					<input
						v-show="false"
						type="file"
						accept="image/jpeg"
						@input="event => uploadImage(event.target)"
						data-testid="change-picture-input"
					/>
				</label>

				<div class="grid grid-cols-2 w-full justify-items-center">
					<BaseBtn
						v-if="imagePreview[0]"
						color="green"
						class="w-fit"
						@click="uploadPicture"
						alt="Approve new profile picture"
						><CheckIcon class="w-6 h-6"
					/></BaseBtn>
					<BaseBtn
						color="red"
						class="w-fit"
						v-if="imagePreview[0]"
						alt="Reject new profile picture"
						@click="
							() => {
								imageFiles = []
								imagePreview = []
							}
						"
						><XIcon class="w-6 h-6"
					/></BaseBtn>
				</div>
			</div>
			<div class="flex flex-col gap-4">
				<h3>
					{{ store.state.user.firstName }}
					{{ store.state.user.lastName }}
				</h3>
				<div class="flex items-center">
					<h4 class="text-slate-600">
						@{{ store.state.user.username }}
					</h4>
					<CheckCircleIcon
						v-if="store.state.user.verified"
						class="h-5 w-5 text-blue-500"
					/>
				</div>

				<h4>{{ store.state.user.email }}</h4>
			</div>
		</div>

		<BaseBtn @click="editUser = !editUser"
			><p v-if="!editUser">Rediger brukerdata</p>
			<p v-else>Lukk</p></BaseBtn
		>
		<form
			v-if="editUser"
			class="grid gap-4 border rounded-xl border-slate-400 p-2"
			@submit.prevent="updateUser"
		>
			<BaseInput
				data-testid="newFirstName-input"
				v-model="newFirstName"
				label="Fornavn"
				type="text"
				:error="errors.newFirstName"
			/>
			<BaseInput
				data-testid="newLastName-input"
				v-model="newLastName"
				label="Etternavn"
				type="text"
				:error="errors.newLastName"
			/>
			<BaseInput
				data-testid="newEmail-input"
				v-model="newEmail"
				label="Epost"
				type="text"
				:error="errors.newEmail"
			/>

			<BaseBtn
				type="submit"
				:disabled="
					!!errors.newEmail ||
					!!errors.newFirstName ||
					!!errors.newLastName ||
					(newEmail == store.state.user.email &&
						newFirstName == store.state.user.firstName &&
						newLastName == store.state.user.lastName)
				"
				class="w-fit mx-auto"
				>Oppdater</BaseBtn
			>
		</form>

		<BaseBtn @click="showChangePassword = !showChangePassword"
			><p v-if="!showChangePassword">Endre passord</p>
			<p v-else>Lukk</p></BaseBtn
		>
		<form
			v-if="showChangePassword"
			class="grid gap-4 border border-slate-400 p-2"
			@submit.prevent="changePassword"
		>
			<BaseInput
				data-testid="newFirstName-input"
				v-model="oldPassword"
				label="Gammelt passord"
				@input="hasNotTypedOldPassword = false"
				type="password"
				:error="errors.oldPassword"
			/>
			<BaseInput
				data-testid="newLastName-input"
				v-model="newPassword"
				label="Nytt passord"
				type="password"
				@input="hasNotTypedNewPassword = false"
				:error="errors.newPassword"
			/>
			<BaseInput
				data-testid="newEmail-input"
				v-model="newPasswordConfirm"
				@input="hasNotTypedConfirm = false"
				label="Bekreft passord"
				type="password"
				:error="errors.newPasswordConfirm"
			/>

			<BaseBtn
				type="submit"
				:disabled="
					!!errors.newPasswordConfirm ||
					!!errors.newPassword ||
					!!errors.oldPassword ||
					hasNotTypedConfirm ||
					hasNotTypedNewPassword ||
					hasNotTypedOldPassword
				"
				class="w-fit mx-auto"
				>Endre</BaseBtn
			>
		</form>

		<span class="my-2"></span>

		<BaseBtn to="/faq" color="blue">FAQ</BaseBtn>

		<BaseBtn
			v-if="!store.state.user.verified"
			@click="sendVerificationEmail"
			color="blue"
			>Send ny verfikasjon på epost</BaseBtn
		>
		<BaseBtn @click="resetTips" color="blue">Vis alle tips igjen</BaseBtn>

		<span class="my-2"></span>

		<BaseBtn @click="logout" color="gray">Logg ut</BaseBtn>

		<!--<BaseBtn @click="deleteUser" color="red">Slett bruker</BaseBtn>-->
	</div>
	<div v-else>
		<p>No user</p>
	</div>
</template>
