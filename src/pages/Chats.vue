<script setup lang="ts">
import { ref } from 'vue'

const chats = ref([
	{
		chatName: 'Chat1',
		chatId: 1,
		lastMessage: {
			message: 'Yes sir!',
			date: new Date().toLocaleDateString(),
			receive: true,
		},
		item: {
			active: true,
			name: 'Bil',
		},
		user: {
			username: 'Adrian1',
		},
	},
	{
		chatName: 'Chat2',
		chatId: 2,
		lastMessage: {
			message: 'Yes sir!',
			date: new Date().toLocaleDateString(),
			receive: true,
		},
		item: {
			active: true,
			name: 'Brannbil',
		},
		user: {
			username: 'William123',
		},
	},
	{
		chatName: 'Chat3',
		chatId: 3,
		lastMessage: {
			message: 'Yes sir!',
			date: new Date().toLocaleDateString(),
			receive: true,
		},
		item: {
			active: true,
			name: 'Truse',
		},
		user: {
			username: 'Len123',
		},
	},
])

import Card from '../components/Card.vue'
</script>

<template>
	<div>
		<h1 class="text-4xl my-4">Samtaler</h1>
		<div class="grid gap-4">
			<Card v-for="chat in chats">
				<router-link :to="'/chat/' + chat.chatId">
					<div class="grid grid-cols-3">
						<div>
							{{ chat.item.name }}
						</div>
						<div class="col-span-2">
							<p>
								{{ chat.chatName }}
							</p>
							<p>
								{{ chat.lastMessage.message }} -
								{{ chat.lastMessage.date }}
							</p>
						</div>
					</div>
				</router-link>
			</Card>
		</div>
	</div>
</template>
