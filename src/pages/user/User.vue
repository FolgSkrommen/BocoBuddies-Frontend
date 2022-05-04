<script setup lang="ts">
import axios from 'axios'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { store } from '../../store'
import LoadingIndicator from '../../components/base/LoadingIndicator.vue'
import { CheckCircleIcon, StarIcon, UserAddIcon } from '@heroicons/vue/solid'
import { CogIcon } from '@heroicons/vue/outline'
import BaseBtn from '../../components/base/BaseBtn.vue'
import { User, Review } from '../../api/schema'
import { GetUserRequest } from '../../api/user'
import { PostUserFriendsRequest } from '../../api/user/friends'
import Card from '../../components/Card.vue'

const { params } = useRoute()
const id = parseInt(params.id as string)

type GetStatus = 'loading' | 'loaded' | 'error'
const getUserStatus = ref<GetStatus>()

const user = ref<User>()

//Enums
enum State {
	REVIEWS,
	BUDDIES,
}
const stateTag = ref<State>(State.REVIEWS)

watch(stateTag, () => {})

const reviews = ref<Review[]>()
getReviews()

const buddies = ref<User[]>()

async function getUser() {
	getUserStatus.value = 'loading'

	try {
		const params: GetUserRequest = {
			user: id,
			useAuth: true,
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

async function getReviews() {
	try {
		const reviewsRes = await axios.get('/review/getByUser', {
			params: {
				userId: id,
				isReceiver: true,
			},
		})
		const data = reviewsRes.data as Review[]
		console.log(data)
		reviews.value = data
	} catch (error: any) {
		getUserStatus.value = 'error'
		store.dispatch('error', error.message)
	}
}

async function getBuddies() {
	try {
		const reviewsRes = await axios.get('/review/getByUser', {
			params: {
				userId: id,
				isReceiver: true,
			},
		})
		const data = reviewsRes.data as Review[]
		console.log(data)
		reviews.value = data
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

		<BaseBtn
			v-if="store.state.user && user.userId === store.state.user.userId"
			class="w-full flex gap-1 justify-center items-center"
			to="/settings"
			>Instillinger</BaseBtn
		>
		<button
			v-if="user.friend == false"
			@click="addUser()"
			class="w-full flex gap-2 items-center justify-center"
		>
			<UserAddIcon class="w-6" /> Legg til buddy
		</button>

		<div class="flex gap-2 w-full">
			<BaseBtn class="flex-1" @click="getReviews"
				>Tilbakemeldinger</BaseBtn
			>
			<BaseBtn to="/faq" class="flex-1">Buddies</BaseBtn>
		</div>

		<div class="flex flex-col w-full">
			<Card
				v-if="stateTag == State.REVIEWS"
				v-for="review in reviews"
				class="grow"
			>
				<div class="w-full flex">
					<StarIcon
						v-for="i in review.rating"
						class="text-yellow-500 w-8"
					/>
					<StarIcon
						v-for="i in 5 - review.rating"
						class="text-slate-500 w-8"
					/>
				</div>
				<p class="w-full text-left text-lg p-1">
					<slot v-if="review.description">
						{{ review.description }}
					</slot>
					<slot v-else class="text-slate-500"> No comment </slot>
				</p>
			</Card>

			<Card
				v-if="stateTag == State.BUDDIES"
				v-for="buddy in buddies"
				class="grow"
			>
				<p class="w-full text-left text-lg p-1">
					<slot v-if="review.description">
						{{ review.description }}
					</slot>
					<slot v-else class="text-slate-500"> No comment </slot>
				</p>
			</Card>
		</div>
	</div>
</template>
