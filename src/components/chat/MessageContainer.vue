<script setup lang="ts">
import {
	computed,
	onMounted,
	onRenderTracked,
	onRenderTriggered,
	PropType,
	ref,
} from 'vue'
import Message from './Message.vue'
import BaseBtn from '../base/BaseBtn.vue'
import { Message as MessageInterface } from '../../api/schema'
import { User as User } from '../../api/schema'

interface Props {
	messages: MessageInterface[]
	users: User[]
}
//DO NOT REMOVE NEEDED FOR REFRESHING CHAT (TO ALWAY BE AT BOTTOM)
onMounted(() => {
	var myDiv = document.getElementById('box')
	if (myDiv) myDiv.scrollTop = myDiv.scrollHeight
})

const { messages, users } = defineProps<Props>()

function styleType(received: boolean) {
	switch (received) {
		case true:
			return 'bg-slate-400 text-black '
		case false:
			return 'bg-blue-500 text-white justify-self-end'
		default:
			return 'bg-blue-500 text-white'
	}
}

function getProperDateTime(dateTime: string) {
	let time = dateTime.substring(11, 16)
	let date = dateTime.substring(0, 10)
	if (new Date().toISOString().substring(0, 10) === date) return time
	return time
}

function getUserName(id: number) {
	let user: User = {
		userId: 0,
		firstName: '',
		lastName: '',
		username: '',
		verified: false,
		trusted: false,
		rating: 0,
	}
	if (!users) return undefined
	users.forEach(u => {
		if (u.userId === id) user = u
	})
	return user
}
</script>
<template>
	<div
		class="border bg-slate-200 px-2 my-2 py-3 w-full h-full overflow-auto"
		id="box"
		data-testid="chat"
	>
		<div class="grid" v-for="(message, i) in messages">
			<Message
				v-if="message.type === 'CHAT'"
				:id="i"
				:receive="!message.receive"
			>
				<div data-testid="message">{{ message.message }}</div>
			</Message>
			<div
				class="text-black text-m place-self-end"
				data-testid="message-info"
				v-if="!message.receive"
			>
				{{ getProperDateTime(message.date) }}
				<div class="grid grid-cols-2 w-16 h-16 gap-2 min-w-[64px]">
					<img
						class="rounded-full object-cover"
						:src="getUserName(message.senderId).profilePicture"
					/>
				</div>
			</div>
			<div
				class="text-black text-lg place-self-start"
				data-testid="message-info"
				v-else
			>
				{{ getProperDateTime(message.date) }}
				<div class="grid grid-cols-2 w-16 h-16 gap-2 min-w-[64px]">
					<img
						class="rounded-full object-cover"
						:src="getUserName(message.senderId).profilePicture"
					/>
				</div>
			</div>
		</div>
	</div>
</template>
