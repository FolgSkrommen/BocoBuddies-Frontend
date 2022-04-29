<script setup lang="ts">
import { ref } from 'vue'
import BasePopup from '../components/base/BasePopup.vue'
import SearchbarAndButton from './SearchbarAndButton.vue'
import UserCard from '../components/UserCard.vue'
import BaseBtn from './base/BaseBtn.vue'
import LoadingIndicator from '../components/base/LoadingIndicator.vue'

export interface User {
	userId: number
	firstName: string
	lastName: string
	username: string
	rating: number
	pictureUrl: string
	trusted: boolean
}

const emit = defineEmits(['exit'])

type Status = 'loading' | 'loaded' | 'error'
const status = ref<Status>()
const errorMessage = ref()

const searchString = ref('')

const gcToggle = ref(false)

const friendResults = ref<User[]>([])

function getFriends() {
	console.log('Getting friends...')
}
getFriends()
function searchForFriend() {
	console.log('Searching for friends...')
}
function loadMoreFriends() {
	console.log('Loading more friends...')
}
</script>

<template>
	<BasePopup @exit="emit('exit')">
		<h1 class="text-2xl font-bold">Ny melding til</h1>
		<BaseBtn @click="gcToggle = true">Gruppechat</BaseBtn>
		<!--GCPopup component here-->
		<SearchbarAndButton
			v-model="searchString"
			@search="searchForFriend"
			:error="errorMessage"
		></SearchbarAndButton>

		<LoadingIndicator v-if="status === 'loading'" />

		<div class="grid gap-4">
			<UserCard v-for="friend in friendResults" :user="friend" />
			<BaseBtn @click="loadMoreFriends">Last inn flere</BaseBtn>
		</div>
	</BasePopup>
</template>
