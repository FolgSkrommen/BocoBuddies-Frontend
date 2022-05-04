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
import { FriendChat, User } from '../../api/schema'
import {
	GetChatSearchRequest,
	GetChatSearchResponse,
} from '../../api/chat/search'
import UserCardAndBtn from '../UserCardAndBtn.vue'
import ChatCard from '../ChatCard.vue'

const emit = defineEmits(['exit'])

type Status = 'loading' | 'loaded' | 'error'
const status = ref<Status>()
const errorMessage = ref()

const searchString = ref('')
const currentPage = ref<number>(1)
const amountPerPage: number = 20
const loadMoreBool = ref<boolean>(false)

const gcToggle = ref(false)

const chatResults = ref<FriendChat[]>([])

async function getFriends() {
	if (!store.state.user)
		throw Error('You must be logged in to search for friends')
	status.value = 'loading'
	try {
		const params: GetChatSearchRequest = {
			searchString: searchString.value,
			page: currentPage.value,
			amount: amountPerPage,
		}
		const res = await axios.get('/chat/search', { params })
		const data: GetChatSearchResponse = res.data
		data.length === 0 || data.length < amountPerPage
			? (loadMoreBool.value = false)
			: (loadMoreBool.value = true)

		chatResults.value = data

		status.value = 'loaded'
	} catch (error) {
		status.value = 'error'
		errorMessage.value = error
	}
}
getFriends()
function searchForFriend() {
	chatResults.value = []
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
		<h1>Ny melding til</h1>
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
			<div v-for="chatResult in chatResults">
				<ChatCard
					:friendChat="chatResult"
					:to="'/community/chat/' + chatResult.chatId"
				>
					<BaseBtn :to="'/community/chat/' + chatResult.chatId"
						>Naviger</BaseBtn
					>
				</ChatCard>
			</div>
			<BaseBtn @click="loadMoreFriends" v-if="loadMoreBool"
				>Last inn flere</BaseBtn
			>
		</div>
	</BasePopup>
</template>
