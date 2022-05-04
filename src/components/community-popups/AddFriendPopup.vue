<script setup lang="ts">
import axios, { AxiosError } from 'axios'
import { ref } from 'vue'
import BasePopup from '../base/BasePopup.vue'
import SearchbarAndButton from '../SearchbarAndButton.vue'
import UserCard from '../UserCard.vue'
import BaseBtn from '../base/BaseBtn.vue'
import LoadingIndicator from '../base/LoadingIndicator.vue'
import BaseBanner from '../base/BaseBanner.vue'
import { User } from '../../api/schema'
import UserCardAndBtn from '../UserCardAndBtn.vue'
import { PostUserFriendsRequest } from '../../api/user/friends'

const emit = defineEmits(['exit'])

const searchString = ref<string>('')
const amountPerPage: number = 20
const page = ref<number>(1)
const loadMoreBool = ref<boolean>(false)

const friendResults = ref<User[]>([])

type Status = 'loading' | 'loaded' | 'error'
const status = ref<Status>()
const errorMessage = ref()

async function searchForFriends() {
	status.value = 'loading'
	try {
		const res = await axios.get('/user/search', {
			params: {
				searchString: searchString.value,
				page: page.value,
				amount: amountPerPage,
			},
		})
		const data = res.data as User[]
		data.length === 0 || data.length < amountPerPage
			? (loadMoreBool.value = false)
			: (loadMoreBool.value = true)
		friendResults.value = friendResults.value.concat(data)
		status.value = 'loaded'
	} catch (error) {
		status.value = 'error'
		if (axios.isAxiosError(error)) {
			errorMessage.value = error.message
		}
	}
}
searchForFriends()
function newSearch() {
	friendResults.value = []
	searchForFriends()
}

function loadMoreResults() {
	page.value++
	searchForFriends()
}

async function addUser(user: User) {
	status.value = 'loading'
	try {
		const params: PostUserFriendsRequest = { userId: user.userId }
		const res = await axios.post('/user/friends', null, { params })
		const data = res.data as boolean
		if (data) {
			newSearch()
			return
		}
		status.value = 'error'
		errorMessage.value = 'Did not manage to add friend'
	} catch (error) {
		status.value = 'error'
		if (axios.isAxiosError(error)) {
			errorMessage.value = error.message
		}
	}
}
</script>
<template>
	<!--NB if popup getting too wide, max-w-full as class in BasePopup-->
	<BasePopup @exit="emit('exit')">
		<h1>Legg til BoCo-buddy</h1>
		<SearchbarAndButton
			v-model="searchString"
			@search="newSearch"
			:error="errorMessage"
		></SearchbarAndButton>
		<LoadingIndicator v-if="status === 'loading'" />

		<div class="grid gap-4">
			<UserCardAndBtn
				v-for="user in friendResults"
				:user="user"
				btnTxt="Legg til"
				:btnDsbld="false"
				@button-clicked="addUser"
				:to="'/user/' + user.userId"
			></UserCardAndBtn>
			<BaseBtn @click="loadMoreResults" v-if="loadMoreBool"
				>Last inn flere</BaseBtn
			>
		</div>
	</BasePopup>
</template>
