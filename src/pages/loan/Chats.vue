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
			if (chat.members) {
				console.log(status.value)
				for (const member of chat.members) {
					console.log('heisann')
					if (member.userId !== store.state.user?.userId) {
						console.log('Member: ' + member.username)
						chat.user = member
					}
				}
			}
		}

		for (const chat of chats.value) {
			try {
				console.log(chat)
				const res = await axios.get('/loan/chat?chatId=' + chat.chatId)
				console.log(res.data)
				chat.item = res.data.item
				chat.loan = res.data.loan
				console.log(chat.user)
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
			<div class="grid gap-4">
				<h1 data-testid="header">Lånesamtaler</h1>
				<Card v-for="chat in chats" :key="chat.chatId">
					<div class="flex justify-between p-2 w-full">
						<router-link :to="'/chat/' + chat.chatId" class="">
							<div class="flex gap-2">
								<img
									class="h-20 w-20 object-cover rounded-xl"
									v-if="chat.item"
									:src="chat.item.images[0]"
									:alt="chat.item.name"
								/>

								<div class="flex-col">
									<h3>
										{{ chat.item?.name }}
									</h3>
									<h4>
										{{ getLoanStatus(chat) }}
									</h4>
								</div>
							</div>
						</router-link>

						<h4 class="text-right text-xs">
							{{
								chat.user?.firstName + ' ' + chat.user.lastName
							}}
						</h4>
					</div>
				</Card>
			</div>
			<h2
				v-if="chats.length === 0"
				class="text-slate-400 w-fit mx-auto mt-28"
			>
				Du har ingen lånesamtaler
			</h2>
		</div>
	</div>
</template>
