<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Card from '../components/Card.vue'
import axios from 'axios'
import { store, User } from '../store'
import { response } from 'express'

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

onMounted(() => {
	axios
		.get('/chat/getByUser')
		.then(res => {
			chats.value = res.data
			chats.value.forEach(chat => {
				axios
					.get('/item', { params: { id: chat.itemId } })
					.then(response => {
						chat.item = response.data.item
					})
			})
		})
		.catch(err => {
			//TODO proper error
			alert(err)
		})
})
</script>

<template>
	<div>
		<h1 class="text-4xl my-4">Samtaler</h1>
		<div class="grid gap-4">
			<Card v-for="chat in chats">
				<router-link :to="'/chat/' + chat.chatId">
					<div class="grid grid-cols-3">
						<img
							class="w-32 rounded-l-lg object-cover"
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
</template>
