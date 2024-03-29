<script setup lang="ts">
import axios from 'axios'
import { computed, ref, watch } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import { store } from '../../store'
import LoadingIndicator from '../../components/base/LoadingIndicator.vue'
import {
	CheckCircleIcon,
	RefreshIcon,
	StarIcon,
	UserAddIcon,
} from '@heroicons/vue/solid'
import { CogIcon } from '@heroicons/vue/outline'
import BaseBtn from '../../components/base/BaseBtn.vue'
import { User, Review } from '../../api/schema'
import { GetUserRequest } from '../../api/user'
import { PostUserFriendsRequest } from '../../api/user/friends'
import Card from '../../components/Card.vue'
import UserCard from '../../components/UserCard.vue'
import router from '../../router'

const { params } = useRoute()
let id: number = parseInt(params.id as string)

type GetStatus = 'loading' | 'loaded' | 'error'
const getUserStatus = ref<GetStatus>()

const user = ref<User>()

//Enums
enum State {
	REVIEWS = 'Tilbakemeldinger',
	BUDDIES = 'Buddies',
}
const stateTag = ref<State>(State.REVIEWS)

watch(stateTag, () => {
	if (stateTag.value == State.BUDDIES) {
		getBuddies()
	} else {
		getReviews()
	}
})

const reviews = ref<Review[]>()
getReviews()

const buddies = ref<User[]>()

const addUserToggle = ref<boolean>(false)

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
		let data = userRes.data as User

		data.rating = data.rating
		user.value = data
		getUserStatus.value = 'loaded'
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
		reviews.value = data

		let avg = 0
		for (let review of reviews.value) {
			if (review) avg += review.rating
		}
		if (reviews.value?.length !== 0) avg = avg / reviews.value?.length

		if (!store.state.user) return
		store.state.user.rating = avg
	} catch (error: any) {
		getUserStatus.value = 'error'
		store.dispatch('error', error.message)
	}
}

async function getBuddies() {
	if (!store.state.user) return
	try {
		const res = await axios.get('/user/friends', {
			params: { userId: id },
		})
		buddies.value = res.data as User[]
	} catch (error: any) {
		store.dispatch('error', error.message)
	}
}

if (store.state.user && id && id !== store.state.user.userId) {
	getUser()
} else {
	user.value = store.state.user
	getUserStatus.value = 'loaded'
}

function cookie() {
	const seenUserCookie = ('; ' + document.cookie)
		.split(`; seenUserTutorial=`)
		.pop()
		?.split(';')[0]

	if (!seenUserCookie?.includes('true')) {
		store.dispatch(
			'info',
			'Dette er profil siden din. her kan du åpne FAQen, åpne instillingsfanen din og se din egen rating. Klikk X knappen for å lukke denne meldingen.'
		)
		document.cookie = 'seenUserTutorial=true; max-age=31536000'
	}
}
cookie()

async function addUser() {
	try {
		const params: PostUserFriendsRequest = { userId: id }
		const res = await axios.post('/user/friends', null, { params })
		const data = res.data as boolean
		addUserToggle.value = true
	} catch (error) {}
}

const isOwnProfile = computed(() => {
	return user.value?.userId === store.state.user?.userId
})

onBeforeRouteUpdate((to, from) => {
	id = parseInt(to.params.id as string)

	buddies.value = []
	reviews.value = []
	getUser()
	getBuddies()
	getReviews()
})
</script>

<template>
	<LoadingIndicator v-if="getUserStatus === 'loading'" />
	<div
		v-if="getUserStatus === 'loaded' && user"
		class="grid gap-4 text-center sm:w-96 mx-auto"
	>
		<div class="flex gap-4 justify-start w-full">
			<!-- Profile picture or initals-->
			<img
				v-if="user.profilePicture"
				:src="user.profilePicture"
				:alt="user.username"
				class="w-32 h-32 object-cover rounded-full"
				data-testid="profile-picture"
			/>
			<span
				v-else
				class="w-32 h-32 object-cover rounded-full bg-slate-900 text-white grid place-items-center text-4xl"
				data-testid="username"
			>
				{{ user.username[0].toUpperCase() }}
				{{ user.lastName[0].toUpperCase() }}
			</span>

			<!-- User name and lastname-->
			<div class="flex flex-col gap-4">
				<h3 class="font-bold" data-testid="name">
					{{ user.firstName }} {{ user.lastName }}
				</h3>
				<div class="flex items-center">
					<h4 class="text-slate-600">@{{ user.username }}</h4>
					<CheckCircleIcon
						v-if="user.trusted"
						class="h-5 w-5 text-blue-500"
					/>
				</div>
				<!-- User rating -->
				<div class="flex items-center gap-4">
					<StarIcon class="w-5 h-5 text-yellow-500" />
					<p class="text-sm font-bold text-slate-900">
						{{ Math.round(user.rating * 10) / 10 }}
					</p>
				</div>
			</div>
		</div>

		<!--Seeing your own profile page-->

		<BaseBtn
			v-if="store.state.user && isOwnProfile"
			class="w-full flex gap-1 justify-center items-center"
			to="/settings"
			data-testid="settings-btn"
			>Innstillinger</BaseBtn
		>
		<button
			v-if="user.friend == false && !isOwnProfile"
			@click="addUser()"
			class="w-full flex gap-4 items-center justify-center"
			data-testid="add-friend-btn"
			:disabled="addUserToggle == true"
		>
			<div v-if="addUserToggle">Forespørsel sendt!</div>
			<div class="flex gap-4" v-else>
				<UserAddIcon class="w-6" /> Legg til buddy
			</div>
		</button>

		<div class="flex gap-4 w-full">
			<button
				class="flex-1"
				:class="
					stateTag === tag
						? 'bg-blue-600 text-white'
						: 'bg-slate-600 text-white'
				"
				@click="stateTag = tag"
				v-for="tag in State"
			>
				{{ tag }}
			</button>
		</div>

		<h2
			v-if="stateTag == State.REVIEWS && reviews?.length == 0"
			class="text-slate-600 w-fit mx-auto mt-28"
		>
			Brukeren har ingen tilbakemeldinger
		</h2>

		<h2
			v-if="stateTag == State.BUDDIES && buddies?.length == 0"
			class="text-slate-600 w-fit mx-auto mt-28"
		>
			Brukeren har ingen buddies
		</h2>

		<div class="flex flex-col w-full gap-4">
			<Card
				v-if="stateTag == State.REVIEWS"
				v-for="review in reviews"
				class="grow"
			>
				<div class="flex justify-between p-2">
					<div>
						<div class="w-full flex">
							<StarIcon
								v-for="i in review.rating"
								class="text-yellow-500 w-8"
							/>
							<StarIcon
								v-for="i in 5 - review.rating"
								class="text-slate-600 w-8"
							/>
						</div>
						<p class="w-full text-left text-lg p-1">
							<slot v-if="review.description">
								{{ review.description }}
							</slot>
							<slot v-else class="text-slate-600">
								No comment
							</slot>
						</p>
					</div>

					<router-link
						:to="`/user/${review.user.userId}`"
						class="flex"
					>
						<div class="flex flex-col">
							<p>{{ review.user.firstName }}</p>
							<p>{{ review.user.lastName }}</p>
						</div>

						<img
							class="w-16 h-16 rounded-full object-cover"
							:src="review.user.profilePicture"
							:alt="review.user.username"
						/>
					</router-link>
				</div>
			</Card>

			<UserCard
				v-if="stateTag == State.BUDDIES"
				v-for="buddy in buddies"
				:user="buddy"
				:to="'/user/' + buddy.userId"
			>
				<BaseBtn color="red" v-if="isOwnProfile" @click=""
					>Fjern</BaseBtn
				>
			</UserCard>
		</div>
	</div>
</template>
