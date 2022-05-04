<script setup lang="ts">
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
import { Category, Item, User } from '../api/schema'
import { GetItemRequest, GetItemResponse } from '../api/item'
import { PostChatRequest, PostChatResponse } from '../api/chat'

const { params } = useRoute()
const router = useRouter()
const itemId = parseInt(params.id as string)
type Status = 'loading' | 'loaded' | 'error'

const status = ref<Status>()
const errorMessage = ref()

const item = ref<Item>()
const lender = ref<User>()
const category = ref<Category>()

async function getItem() {
	status.value = 'loading'
	const params: GetItemRequest = {
		itemId: itemId,
	}
	try {
		const res = await axios.get('/item', {
			params,
		})
		const data: GetItemResponse = res.data
		console.log(data.item)
		item.value = data.item
		console.log(item.value)
		lender.value = data.lender
		status.value = 'loaded'
	} catch (error) {
		status.value = 'error'
		errorMessage.value = error
	}
}

async function createChat() {
	if (!store.state.user) {
		router.push('/login')
		return
	}
	if (!item.value || !lender.value) return
	try {
		const body: PostChatRequest = {
			chatName: `${item.value.name}: ${lender.value.firstName} ${lender.value.lastName}`,
			itemId: itemId,
			members: [store.state.user.userId, lender.value.userId],
		}
		const res = await axios.post('/chat', body)
		const data = res.data as PostChatResponse
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
		<h1>{{ item.name }}</h1>
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
