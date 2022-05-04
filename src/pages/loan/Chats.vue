<script setup lang="ts">
import { ref } from 'vue'
import Card from '../../components/Card.vue'
import axios from 'axios'
import LoadingIndicator from '../../components/base/LoadingIndicator.vue'
import BaseBanner from '../../components/base/BaseBanner.vue'
import { Chat, User } from '../../api/schema'
import { GetChatByUserMarketResponse } from '../../api/chat/getByUser/market'
import { store } from '../../store'

const chats = ref<Array<Chat>>([])

type Status = 'loading' | 'loaded' | 'error'

const status = ref<Status>()
async function getChats() {
	status.value = 'loading'
	try {
		const res = await axios.get('/chat/getByUser/market')
		const data = res.data as GetChatByUserMarketResponse
		chats.value = data

		for (const chat of chats.value) {
			try {
				const res = await axios.get('/loan/chat?chatId=' + chat.chatId)
				console.log(res.data)
				chat.item = res.data.item
				chat.loan = res.data.loan
			} catch (err: any) {
				const res = await axios.get('/item', {
					params: { itemId: chat.item?.itemId },
				})
				chat.item = res.data.item
			}
		}
		console.log(chats.value)
		status.value = 'loaded'
	} catch (error: any) {
		status.value = 'error'
		store.dispatch('error', error.message)
	}
}

function getLoanStatus(chat: Chat) {
	if (!chat.loan) return 'Ingen forespørsel'
	if (chat.loan.active && !chat.loan.returned) return 'Utlånt / Avtalt lån'
	if (chat.loan.active && chat.loan.returned) return 'Returnert'
	if (!chat.loan.active && !chat.loan.returned) return 'Forespurt'
}

getChats()
</script>

<template>
	<div>
		<LoadingIndicator v-if="status === 'loading'" data-testid="loader" />
		<div v-if="status === 'loaded'">
			<h1 data-testid="header">Samtaler</h1>
			<div class="grid gap-4">
				<Card v-for="chat in chats" :key="chat.chatId">
					<router-link :to="'/chat/' + chat.chatId">
						<div class="grid grid-cols-3">
							<img
								class="h-20 w-20 object-cover rounded-lg"
								v-if="chat.item"
								:src="chat.item.images[0]"
								:alt="chat.item.name"
							/>

							<div class="flex-col">
								<h3>
									{{ chat.item?.name }}
								</h3>
							</div>

							<div class="flex-col">
								<h2>
									{{ getLoanStatus(chat) }}
								</h2>
							</div>
						</div>
					</router-link>
				</Card>
			</div>
		</div>
	</div>
</template>
