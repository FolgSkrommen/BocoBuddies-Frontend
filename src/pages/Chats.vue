<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface Chat {
	chatId: number
	itemId: number
	chatName: string
}

const chats = ref<Array<Chat>>([])

onMounted(() => {
	axios
		.get('/chat/getByUser')
		.then(res => {
			console.log(res.data)
			chats.value = res.data
		})
		.catch(err => {
			//TODO proper error
			console.log(err)
		})
})

import Card from '../components/Card.vue'
import axios from 'axios'
import { store, User } from '../store'
</script>

<template>
	<div>
		<h1 class="text-4xl my-4">Samtaler</h1>
		<div class="grid gap-4">
			<Card v-for="chat in chats">
				<router-link :to="'/chat/' + chat.chatId">
					<div class="grid grid-cols-3">
						<div>
							{{ chat.itemId }}
						</div>
						<div class="col-span-2">
							<p>
								{{ chat.chatName }}
							</p>
							<p>
								{{ chat.chatId }}
							</p>
						</div>
					</div>
				</router-link>
			</Card>
		</div>
	</div>
</template>
