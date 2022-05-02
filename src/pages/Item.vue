<script setup lang="ts">
import Card from '../components/Card.vue'
import { StarIcon, CheckCircleIcon } from '@heroicons/vue/solid'
import BaseBtn from '../components/base/BaseBtn.vue'
import ItemInfo from '../components/ItemInfo.vue'
import 'v-calendar/dist/style.css'
import UserCard from '../components/UserCard.vue'
import { ref } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import { store } from '../store'
import LoadingIndicator from '../components/base/LoadingIndicator.vue'
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { Item, User } from '../api/schema'

const { params } = useRoute()
const router = useRouter()
const id = parseInt(params.id as string)

interface ItemResponse {
	item: Item
	lender: User
}

type Status = 'loading' | 'loaded' | 'error'

const status = ref<Status>()
const errorMessage = ref()

const item = ref<Item>()
const lender = ref<User>()

interface ItemResponse {
	item: Item
	lender: User
}

async function getItem() {
	status.value = 'loading'
	try {
		const res = await axios.get('/item', {
			method: 'GET',
			params: {
				id,
			},
		})
		const data: ItemResponse = res.data
		console.log(data)
		item.value = data.item
		lender.value = data.lender
		status.value = 'loaded'
	} catch (error) {
		status.value = 'error'
		errorMessage.value = error
	}
}

interface ChatParameters {
	chatName: string
	itemId: number
	members: number[]
}
async function createChat() {
	if (!store.state.user) {
		router.push('/login')
		return
	}
	if (!item.value || !lender.value) return
	interface ChatResponse {
		chatId: number
		chatName: string
		itemId: number
		members: number[]
	}
	try {
		const res = await axios.post('/chat', {
			chatName: `${item.value.name}: ${lender.value.firstName} ${lender.value.lastName}`,
			itemId: id,
			members: [store.state.user.id, lender.value.id],
		} as ChatParameters)
		const data = res.data as ChatResponse
		router.push(`/chat/${data.chatId}`)
	} catch (error) {
		console.log(error)
	}
}

getItem()
</script>

<template>
	<LoadingIndicator v-if="status === 'loading'" />
	<div v-if="status === 'loaded' && item && lender" class="grid gap-4">
		<h1 class="text-4xl font-bold">{{ item.name }}</h1>
		<ItemInfo :item="item" />
		<UserCard :user="lender" show-rating />
		<BaseBtn
			@click="createChat"
			v-if="lender.username !== store.state.user?.username"
			>Send melding</BaseBtn
		>
	</div>
	<p v-if="status === 'error'">{{ errorMessage }}</p>
</template>
