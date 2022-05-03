<script setup lang="ts">
import { computed, ref } from 'vue'
import axios, { AxiosError } from 'axios'
import BasePopup from '../base/BasePopup.vue'
import BaseBtn from '../base/BaseBtn.vue'
import SearchbarAndButton from '../SearchbarAndButton.vue'
import LoadingIndicator from '../base/LoadingIndicator.vue'
import UserCard from '../UserCard.vue'
import { User } from '../../api/schema'
import UserCardAndBtn from '../UserCardAndBtn.vue'
import BaseInput from '../base/BaseInput.vue'
import { useRouter } from 'vue-router'

const emit = defineEmits(['exit'])
const router = useRouter()

type Status = 'loading' | 'loaded' | 'error'
const status = ref<Status>()
const errorMessage = ref()

const searchString = ref('')
const amountPerPage: number = 20
const page = ref<number>(1)
const loadMoreBool = ref<boolean>(false)

const groupName = ref<string>('')
const friendResults = ref<User[]>([])
const friendInGC = ref<User[]>([])

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
function addToGCList(user: User) {
	friendInGC.value.push(user)
	const index = friendResults.value.indexOf(user, 0)
	if (index > -1) {
		friendResults.value.splice(index, 1)
	}
}
function removeFromGCList(user: User) {
	console.log('Removing user ' + user)
	friendResults.value.push(user)
	const index = friendInGC.value.indexOf(user, 0)
	if (index > -1) {
		friendInGC.value.splice(index, 1)
	}
}
function test() {
	console.log('TEST')
}
async function createGC() {
	status.value = 'loading'
	try {
		const gcUserIds: number[] = []
		friendInGC.value.forEach(e => {
			gcUserIds.push(e.userId)
		})
		const body = {
			chatName: groupName.value,
			members: gcUserIds,
		}
		const res = await axios.post('/chat', body)
		const data = res.data as boolean
		if (data) {
			status.value = 'loaded'
			router.push('/community')
			return
		}
		status.value = 'error'
		errorMessage.value = 'Creating group chat did not work'
	} catch (error) {
		status.value = 'error'
		if (axios.isAxiosError(error)) {
			errorMessage.value = error.message
		}
	}
}
const notValid = computed(() => !groupName.value || friendInGC.value.length < 2)
</script>

<template>
	<BasePopup @exit="emit('exit')">
		<h1 class="text-2xl font-bold">Ny gruppechat med</h1>

		<BaseInput v-model="groupName" label="Gruppenavn"></BaseInput>

		<SearchbarAndButton
			v-model="searchString"
			@search="newSearch"
			:error="errorMessage"
			label="Finn venner"
		></SearchbarAndButton>

		<LoadingIndicator v-if="status === 'loading'" />

		<div class="grid gap-4">
			<UserCardAndBtn
				v-for="friend in friendInGC"
				:user="friend"
				:btnDsbld="false"
				btnTxt="Fjern"
				@button-clicked="removeFromGCList"
				class="border-solid bg-gray-500 rounded p-3"
			></UserCardAndBtn>
			<UserCardAndBtn
				v-for="friend in friendResults"
				:user="friend"
				:btnDsbld="false"
				btnTxt="Legg til"
				@button-clicked="addToGCList"
			></UserCardAndBtn>

			<BaseBtn @click="loadMoreResults" v-if="loadMoreBool"
				>Last inn flere</BaseBtn
			>
		</div>
		<BaseBtn @click="createGC" :disabled="notValid">Lag gruppechat</BaseBtn>
	</BasePopup>
</template>
