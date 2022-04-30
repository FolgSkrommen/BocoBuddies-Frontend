<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { store } from '../store'
import LoadingIndicator from '../components/base/LoadingIndicator.vue'
import BaseBanner from '../components/base/BaseBanner.vue'
import { CheckCircleIcon } from '@heroicons/vue/solid'

const { params } = useRoute()
const id = parseInt(params.id as string)

const errorMessage = ref()

interface User {
	id: number
	firstName: string
	lastName: string
	username: string
	email: string
	address: string
	postalcode: string
	phonenumber: string
	profilePicture?: string
	verified: boolean
	trusted: boolean
}

const user = ref<User>()

type GetStatus = 'loading' | 'loaded' | 'error'
const getUserStatus = ref<GetStatus>()
async function getUser() {
	getUserStatus.value = 'loading'
	try {
		const userRes = await axios.get('/user', {
			method: 'GET',
			params: {
				user: id,
			},
		})
		const imageRes = await axios.get('/user/getProfilePicture', {
			method: 'GET',
			params: {
				id,
			},
		})
		const data = userRes.data as User
		user.value = data
		console.log(data)
		getUserStatus.value = 'loaded'
	} catch (error) {
		getUserStatus.value = 'error'
		errorMessage.value = error
	}
}

getUser()
</script>
<template>
	<BaseBanner
		v-if="getUserStatus === 'error'"
		type="error"
		:message="errorMessage"
	/>
	<LoadingIndicator v-if="getUserStatus === 'loading'" />
	<div
		v-if="getUserStatus === 'loaded' && user"
		class="grid gap-4 place-items-center text-center"
	>
		<img
			v-if="user.profilePicture"
			:src="user.profilePicture"
			alt=""
			class="w-32 h-32 object-cover rounded-full"
		/>
		<span
			v-else
			class="w-32 h-32 object-cover rounded-full bg-slate-900 text-white grid place-items-center text-4xl"
		>
			{{ user.username[0].toUpperCase() }}
			{{ user.lastName[0].toUpperCase() }}
		</span>
		<p class="text-4xl font-bold">
			{{ user.firstName }} {{ user.lastName }}
		</p>
		<p>@{{ user.username }}</p>
		<CheckCircleIcon class="h-8 w-8 text-blue" v-if="user.trusted" />
		<div
			v-if="store.state.user && user.id === store.state.user.id"
			class="grid gap-4"
		>
			<div>
				<p class="font-bold">E-post</p>
				<p>{{ user.email }}</p>
				<div v-if="!user.verified" class="text-red-600">
					E-post er ikke verifisert enda, sjekk e-post og trykk på
					linken for å bruke appen
				</div>
			</div>
			<div v-if="user.address">
				<p class="font-bold">Adresse</p>
				<p>{{ user.address }} {{ user.postalcode }}</p>
			</div>
			<div v-if="user.phonenumber">
				<p class="font-bold">Telefonnummer</p>
				<p>{{ user.phonenumber }}</p>
			</div>
		</div>
	</div>
</template>
