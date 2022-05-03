<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { store } from '../store'
import LoadingIndicator from '../components/base/LoadingIndicator.vue'
import BaseBanner from '../components/base/BaseBanner.vue'
import { CheckCircleIcon, StarIcon } from '@heroicons/vue/solid'
import BaseBtn from '../components/base/BaseBtn.vue'
import { User, Review } from '../api/schema'
import { GetUserRequest } from '../api/user'

const { params } = useRoute()
const id = parseInt(params.id as string)

const errorMessage = ref()

const user = ref<User>()

const reviews = ref<Review[]>()

async function getReviews() {
	try {
		const reviewsRes = await axios.get('/review/getByUser', {
			params: {
				userId: user.value?.userId,
				isReciever: true,
			},
		})
		const data = reviewsRes.data as Review[]
		reviews.value = data
	} catch (error) {
		getUserStatus.value = 'error'
		errorMessage.value = error
	}
}

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
		user.value = data
		getUserStatus.value = 'loaded'
	} catch (error) {
		getUserStatus.value = 'error'
		errorMessage.value = error
	}
}
if (store.state.user && id && id !== store.state.user.userId) {
	getUser()
} else {
	user.value = store.state.user
	getUserStatus.value = 'loaded'
}
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
		<!--Username at top-->
		<div class="flex items-center text-2xl font-bold">
			@{{ user.username }}
			<CheckCircleIcon class="h-5 w-5 text-blue-500" />
		</div>

		<div class="flex gap-4">
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
			<div>
				<p class="text-4xl font-bold">
					{{ user.firstName }} {{ user.lastName }}
				</p>

				<!-- User rating -->
				<div
					class="flex items-center border w-fit p-1 border-gray-500 rounded"
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
				<BaseBtn to="/settings" class="grow">Instillinger</BaseBtn>
				<BaseBtn to="/faq" class="grow">FAQ</BaseBtn>
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
		<div v-else class="w-full">
			<div class="flex gap-2 justify-items-stretch">
				<BaseBtn to="/settings" class="">Gjenstander</BaseBtn>
				<BaseBtn to="/faq" class="" @click="getReviews"
					>Tilbakemeldinger</BaseBtn
				>
				<BaseBtn to="/faq" class="">Buddies</BaseBtn>
			</div>

			<div v-for="review in reviews">{{ review.description }}</div>
		</div>
	</div>
</template>
