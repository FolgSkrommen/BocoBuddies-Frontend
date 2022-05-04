<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { store } from '../../store'
import LoadingIndicator from '../../components/base/LoadingIndicator.vue'
import { CheckCircleIcon, StarIcon, UserAddIcon } from '@heroicons/vue/solid'
import BaseBtn from '../../components/base/BaseBtn.vue'
import { User, Review } from '../../api/schema'
import { GetUserRequest } from '../../api/user'
import { PostUserFriendsRequest } from '../../api/user/friends'

const { params } = useRoute()
const id = parseInt(params.id as string)

const user = ref<User>()

type GetStatus = 'loading' | 'loaded' | 'error'
const getUserStatus = ref<GetStatus>()

async function getUser() {
	getUserStatus.value = 'loading'

	try {
		const params: GetUserRequest = {
			user: id,
		}
		const userRes = await axios.get('/user', {
			params,
		})
		const data = userRes.data as User
		console.log(userRes.data)
		user.value = data
		getUserStatus.value = 'loaded'
		console
	} catch (error: any) {
		getUserStatus.value = 'error'
		store.dispatch('error', error.message)
	}
}
if (store.state.user && id && id !== store.state.user.userId) {
	getUser()
} else {
	user.value = store.state.user
	getUserStatus.value = 'loaded'
}

const seenHomeCookie = ('; ' + document.cookie)
	.split(`; seenUserTutorial=`)
	.pop()
	.split(';')[0]

if (!seenHomeCookie.includes('true')) {
	store.dispatch(
		'info',
		'Dette er profil siden din. her kan du åpne FAQen, åpne instillingsfanen din og se din egen rating. Klikk X knappen for å lukke denne meldingen.'
	)
	const seenHomeTutorial = (document.cookie =
		'seenUserTutorial=true; max-age=31536000')
}

async function addUser() {
	try {
		const params: PostUserFriendsRequest = { userId: id }
		const res = await axios.post('/user/friends', null, { params })
		const data = res.data as boolean
	} catch (error) {}
}
</script>

<template>
	<LoadingIndicator v-if="getUserStatus === 'loading'" />
	<div
		v-if="getUserStatus === 'loaded' && user"
		class="grid gap-2 place-items-center text-center max-w-xl mx-auto"
	>
		<div class="flex gap-4 justify-start w-full">
			<!-- Profile picture or initals-->
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

			<!-- User name and lastname-->
			<div class="flex flex-col gap-2">
				<h2 class="font-bold">
					{{ user.firstName }} {{ user.lastName }}
				</h2>
				<div class="flex items-center text-xl">
					@{{ user.username }}
					<CheckCircleIcon
						v-if="user.verified"
						class="h-5 w-5 text-blue-500"
					/>
				</div>
				<!-- User rating -->
				<div
					class="flex items-center border w-fit p-1 bg-white border-gray-500 rounded"
				>
					<StarIcon class="w-5 h-5 text-yellow-500" />
					<p
						class="ml-2 text-sm font-bold text-slate-900 dark:text-white"
					>
						{{ user.rating }}
					</p>
				</div>
			</div>
		</div>

		<!--Seeing your own profile page-->
		<div
			v-if="store.state.user && user.userId === store.state.user.userId"
			class="grid gap-4"
		>
			<div class="flex gap-2">
				<BaseBtn class="flex-1" to="/settings">Instillinger</BaseBtn>
				<BaseBtn class="flex-1" to="/faq">FAQ</BaseBtn>
			</div>

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
				<p>{{ user.address }} {{ user.postalCode }}</p>
			</div>
			<div v-if="user.phoneNumber">
				<p class="font-bold">Telefonnummer</p>
				<p>{{ user.phoneNumber }}</p>
			</div>
		</div>

		<!--Seeing another users profile page-->
		<div v-else class="grid gap-2">
			<button
				v-if="!user.friend"
				@click="addUser()"
				class="w-full flex gap-2 items-center justify-center"
			>
				<UserAddIcon class="w-6" /> Legg til buddy
			</button>
			<div class="flex gap-2">
				<router-link :to="{ name: 'feedback' }" class="flex-1"
					>Tilbakemeldinger</router-link
				>
				<router-link to="/faq" class="flex-1"
					>Tilbakemeldinger</router-link
				>
				<router-link to="/faq" class="flex-1">Buddies</router-link>
			</div>

			<div v-for="review in reviews">{{ review.description }}</div>

			<router-view :user="user" class="router-view" />
		</div>
	</div>
</template>
