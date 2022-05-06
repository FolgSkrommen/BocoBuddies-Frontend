<script setup lang="ts">
import { computed, ref } from 'vue'
import axios, { AxiosError } from 'axios'
import BasePopup from '../base/BasePopup.vue'
import BaseBtn from '../base/BaseBtn.vue'
import SearchbarAndButton from '../SearchbarAndButton.vue'
import LoadingIndicator from '../base/LoadingIndicator.vue'
import { User } from '../../api/schema'
import UserCardAndBtn from '../UserCardAndBtn.vue'
import BaseInput from '../base/BaseInput.vue'
import { useRouter } from 'vue-router'

const emit = defineEmits(['exit', 'created-gc'])
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
		const res = await axios.get('/user/search/friends', {
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
async function newSearch() {
	friendResults.value = []
	await searchForFriends()
	//Check if new results are in friendInGC, and remove them from friendResults if true
	friendResults.value = friendResults.value.filter(el1 => {
		return !friendInGC.value.find(rm => rm.userId === el1.userId)
	})
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
	friendResults.value.push(user)
	const index = friendInGC.value.indexOf(user, 0)
	if (index > -1) {
		friendInGC.value.splice(index, 1)
	}
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
			emit('created-gc')
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
		<h1>Ny gruppechat med</h1>
		<BaseInput
			v-model="groupName"
			label="Gruppenavn"
			data-testid="input"
		></BaseInput>

		<!--GCPopup component here-->
		<SearchbarAndButton
			v-model="searchString"
			@search="newSearch"
			:error="errorMessage"
			label="Finn venner"
			data-testid="searchbar"
		></SearchbarAndButton>

		<LoadingIndicator v-if="status === 'loading'" data-testid="loading" />

		<div class="grid gap-4">
			<UserCardAndBtn
				v-for="friend in friendInGC"
				:user="friend"
				:btnDsbld="false"
				btnTxt="Fjern"
				@button-clicked="removeFromGCList"
				data-testid="user-btn"
				class="border-solid bg-gray-200 rounded-xl p-3"
			></UserCardAndBtn>
			<UserCardAndBtn
				v-for="friend in friendResults"
				:user="friend"
				:btnDsbld="false"
				btnTxt="Legg til"
				@button-clicked="addToGCList"
				data-testid="add-btn"
			></UserCardAndBtn>

			<BaseBtn
				@click="loadMoreResults"
				v-if="loadMoreBool"
				data-testid="load-btn"
				>Last inn flere</BaseBtn
			>
		</div>
		<BaseBtn @click="createGC" :disabled="notValid" data-testid="create-btn"
			>Lag gruppechat</BaseBtn
		>
	</BasePopup>
</template>
