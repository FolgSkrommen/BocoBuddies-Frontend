<script setup lang="ts">
import { ref } from 'vue'
import BasePopup from '../base/BasePopup.vue'
import BaseBtn from '../base/BaseBtn.vue'
import SearchbarAndButton from '../SearchbarAndButton.vue'
import LoadingIndicator from '../base/LoadingIndicator.vue'
import UserCard from '../UserCard.vue'
import NewGCPopup from './NewGCPopup.vue'
import axios from 'axios'
import { store } from '../../store'
import { FriendChat } from '../../api/schema'

const emit = defineEmits(['exit'])

type Status = 'loading' | 'loaded' | 'error'
const status = ref<Status>()
const errorMessage = ref()

const searchString = ref('')
const currentPage = ref<number>(0)
const amountPerPage: number = 20

const gcToggle = ref(false)

const chatResults = ref<FriendChat[]>([])

async function getFriends() {
	console.log('Getting friends...')
	if (!store.state.user)
		throw Error('You must be logged in to search for friends')
	status.value = 'loading'
	try {
		const res = await axios.get('/chat/search', {
			params: {
				searchString: searchString.value,
				page: currentPage,
				amount: amountPerPage,
			},
		})
		const data: Response[] = res.data
		console.log(data)
		status.value = 'loaded'
	} catch (error) {
		status.value = 'error'
		errorMessage.value = error
	}
}
getFriends()
function searchForFriend() {
	console.log('Searching for friends...')
	getFriends()
}
function loadMoreFriends() {
	console.log('Loading more friends...')
	currentPage.value++
	getFriends()
}
</script>

<template>
	<BasePopup @exit="emit('exit')">
		<h1 class="text-2xl font-bold">Ny melding til</h1>
		<BaseBtn @click="gcToggle = true">Gruppechat</BaseBtn>
		<NewGCPopup @exit="gcToggle = false" v-show="gcToggle"></NewGCPopup>
		<!--GCPopup component here-->
		<SearchbarAndButton
			v-model="searchString"
			@search="searchForFriend"
			:error="errorMessage"
		></SearchbarAndButton>

		<LoadingIndicator v-if="status === 'loading'" />

		<div class="grid gap-4">
			<!--<UserCard v-for="chat.members in chatResults" :user="chat.members" />-->
			<BaseBtn @click="loadMoreFriends">Last inn flere</BaseBtn>
		</div>
	</BasePopup>
</template>
