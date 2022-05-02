<script setup lang="ts">
import axios, { AxiosError } from 'axios'
import { ref } from 'vue'
import { User } from '../api/schema'
import BasePopup from '../base/BasePopup.vue'
import SearchbarAndButton from '../SearchbarAndButton.vue'
import UserCard from '../UserCard.vue'
import BaseBtn from '../base/BaseBtn.vue'
import LoadingIndicator from '../base/LoadingIndicator.vue'
import BaseBanner from '../base/BaseBanner.vue'

const emit = defineEmits(['exit'])

const searchString = ref<string>('')
const amount: number = 20
const page = ref<number>(1)

const friendResults = ref<User[]>([])

type Status = 'loading' | 'loaded' | 'error'
const status = ref<Status>()
const errorMessage = ref()

function testing() {
	console.log('TestING')
}

async function searchForFriends() {
	status.value = 'loading'
	try {
		const res = await axios.get('/user/search', {
			params: {
				searchString: searchString.value,
				page: page.value,
				amount: amount,
			},
		})
		const data = res.data as User[]
		friendResults.value = friendResults.value.concat(data)
		status.value = 'loaded'
	} catch (error) {
		status.value = 'error'
		if (axios.isAxiosError(error)) {
			errorMessage.value = error.message
		}
	}
}

function newSearch() {
	friendResults.value = []
	searchForFriends()
}

function loadMoreResults() {
	page.value++
	searchForFriends
}
</script>
<template>
	<!--NB if popup getting too wide, max-w-full as class in BasePopup-->
	<BasePopup @exit="emit('exit')">
		<h1 class="text-2xl font-bold">Legg til BoCo-buddy</h1>
		<SearchbarAndButton
			v-model="searchString"
			@search="newSearch"
			:error="errorMessage"
		></SearchbarAndButton>
		<LoadingIndicator v-if="status === 'loading'" />

		<div class="grid gap-4">
			<UserCard v-for="friend in friendResults" :user="friend" />
			<BaseBtn @click="loadMoreResults">Last inn flere</BaseBtn>
		</div>
	</BasePopup>
</template>
