<script setup lang="ts">
import { ref } from 'vue'
import UserCard from '../components/UserCard.vue'
import LoadingIndicator from '../components/base/LoadingIndicator.vue'
import BaseBanner from '../components/base/BaseBanner.vue'
import axios from 'axios'
import FloatingBtn from '../components/base/FloatingBtn.vue'

type GetStatus = 'loading' | 'loaded' | 'error'
const errorMessage = ref()

enum View {
	FRIENDS = 'Friends',
	CHATS = 'Chats',
}
const view = ref<View>(View.FRIENDS)

interface User {
	userId: number
	firstName: string
	lastName: string
	username: string
	rating: number
	pictureUrl: string
	profilePicture?: string
	trusted: boolean
}

interface UserResponse {
	id: number
	firstName: string
	lastName: string
	username: string
	email: string
	address: string
	postalCode: string
	phoneNumber: string
	pictureUrl: string
	profilePicture?: string
	verified: boolean
	trusted: boolean
}
const users = ref<User[]>([])

const getFriendsStatus = ref<GetStatus>()
async function getFriends() {
	getFriendsStatus.value = 'loading'
	try {
		//TODO: Call
		const friends: User[] = [
			{
				userId: 1,
				firstName: 'John',
				lastName: 'Doe',
				username: 'john.doe',
				rating: 1,
				pictureUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
				trusted: true,
			},
			{
				userId: 2,
				firstName: 'Jane',
				lastName: 'Doe',
				username: 'jane.doe',
				rating: 4.5,
				pictureUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
				trusted: true,
			},
			{
				userId: 3,
				firstName: 'John',
				lastName: 'Smith',
				username: 'john.smith',
				rating: 3,
				pictureUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
				trusted: true,
			},
			{
				userId: 4,
				firstName: 'Jane',
				lastName: 'Smith',
				username: 'jane.smith',
				rating: 4.5,
				pictureUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
				trusted: true,
			},
			{
				userId: 5,
				firstName: 'John',
				lastName: 'Doe',
				username: 'john.doe',
				rating: 4.5,
				pictureUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
				trusted: true,
			},
		]
		users.value = friends
		getFriendsStatus.value = 'loaded'
	} catch (error) {
		errorMessage.value = error
		getFriendsStatus.value = 'error'
	}
}

getFriends()
</script>

<template>
	<div class="grid gap-4">
		<div class="flex gap-4">
			<button
				v-for="tag in View"
				class="px-2 py-1 rounded-lg"
				:class="
					view === tag
						? 'bg-blue text-white'
						: 'bg-slate-300 text-slate-900'
				"
				@click="view = tag"
			>
				{{ tag }}
			</button>
		</div>
		<BaseBanner
			v-if="getFriendsStatus === 'error'"
			type="error"
			:message="errorMessage"
		/>
		<LoadingIndicator v-if="getFriendsStatus === 'loading'" />
		<div v-if="view === 'Friends'">
			<div class="grid gap-4">
				<UserCard v-for="user in users" :user="user" />
			</div>
		</div>
		<div v-if="view === 'Chats'"></div>
	</div>
</template>
