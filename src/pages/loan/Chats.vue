<script setup lang="ts">
import { ref } from 'vue'
import Card from '../../components/Card.vue'
import axios from 'axios'
import LoadingIndicator from '../../components/base/LoadingIndicator.vue'
import BaseBanner from '../../components/base/BaseBanner.vue'

interface Chat {
	chatId: number
	itemId: number
	chatName: string
	item?: Item
}

interface Item {
	name: string
	description: string
	price: number
	priceUnit: string
	postalCode: string
	address: string
	images: string[]
	availableFrom: string
	availableTo: string
	categories: string[]
}

const chats = ref<Array<Chat>>([])

type Status = 'loading' | 'loaded' | 'error'

const status = ref<Status>()
const errorMessage = ref()
async function getChats() {
	status.value = 'loading'
	try {
		const res = await axios.get('/chat/getByUser/market')
		chats.value = res.data.chats
		console.log(res.data)
		chats.value.forEach(chat => {
			axios
				.get('/item', { params: { id: chat.itemId } })
				.then(response => {
					chat.item = response.data.item
				})
		})
		status.value = 'loaded'
	} catch (error) {
		status.value = 'error'
		errorMessage.value = error
	}
}

getChats()
</script>

<template>
	<div>
		<LoadingIndicator v-if="status === 'loading'" />
		<BaseBanner
			v-if="status === 'error'"
			type="error"
			:message="errorMessage"
		/>
		<div v-if="status === 'loaded'">
			<h1 class="text-4xl my-4">Samtaler</h1>
			<div class="grid gap-4">
				<Card v-for="chat in chats" :key="chat.chatId">
					<router-link :to="'/chat/' + chat.chatId">
						<div class="grid grid-cols-3">
							<img
								class="w-32 rounded-l-lg"
								v-if="chat.item"
								:src="chat.item.images[0]"
								:alt="chat.item.name"
							/>

							<div class="flex-col">
								<h1 class="text-4xl">
									{{ chat.item?.name }}
								</h1>
								<h2 class="text-xl">
									{{ chat.item?.description }}
								</h2>
							</div>
						</div>
					</router-link>
				</Card>
			</div>
		</div>
	</div>
</template>
