<script setup lang="ts">
import axios from 'axios'
import { computed, ref, watch } from 'vue'
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
import UserCard from '../../components/UserCard.vue'

const { params } = useRoute()
const id = parseInt(params.id as string)

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
	} catch (error: any) {
		getUserStatus.value = 'error'
		store.dispatch('error', error.message)
	}
}

async function getBuddies() {
	if (!store.state.user) return
	try {
		const res = await axios.get('/user/friends', {
			params: { userId: user.value?.userId },
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
	} catch (error) {}
}

const isOwnProfile = computed(() => {
	return user.value?.userId === store.state.user?.userId
})
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
				<h2>{{ user.firstName }} {{ user.lastName }}</h2>
				<div class="flex items-center text-xl">
					<p class="text-slate-500">@{{ user.username }}</p>
					<CheckCircleIcon
						v-if="user.verified"
						class="h-5 w-5 text-blue-500"
					/>
				</div>
				<!-- User rating -->
				<div class="flex items-center gap-2">
					<StarIcon class="w-5 h-5 text-yellow-500" />
					<p class="text-sm font-bold text-slate-900">
						{{ user.rating }}
					</p>
				</div>
			</div>
		</div>

		<!--Seeing your own profile page-->

		<BaseBtn
			v-if="store.state.user && isOwnProfile"
			class="w-full flex gap-1 justify-center items-center"
			to="/settings"
			>Instillinger</BaseBtn
		>
		<button
			v-if="user.friend == false && !isOwnProfile"
			@click="addUser()"
			class="w-full flex gap-2 items-center justify-center"
		>
			<UserAddIcon class="w-6" /> Legg til buddy
		</button>

		<div class="flex gap-2 w-full">
			<button
				class="flex-1"
				:class="
					stateTag === tag
						? 'bg-blue-600 text-white'
						: 'bg-slate-300 text-slate-900'
				"
				@click="stateTag = tag"
				v-for="tag in State"
			>
				{{ tag }}
			</button>
		</div>

		<div class="flex flex-col w-full gap-2">
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
								class="text-slate-500 w-8"
							/>
						</div>
						<p class="w-full text-left text-lg p-1">
							<slot v-if="review.description">
								{{ review.description }}
							</slot>
							<slot v-else class="text-slate-500">
								No comment
							</slot>
						</p>
					</div>

					<div class="flex">
						<div class="flex flex-col">
							<p>{{ review.user.firstName }}</p>
							<p>{{ review.user.lastName }}</p>
						</div>

						<img
							class="w-16 h-16 rounded-full object-cover"
							:src="review.user.profilePicture"
						/>
					</div>
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
