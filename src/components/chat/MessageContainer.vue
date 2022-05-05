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

function getProfilePicture(id: number) {
	let user: User = {
		userId: 0,
		firstName: '',
		lastName: '',
		username: '',
		verified: false,
		trusted: false,
		rating: 0,
	}
	if (!users) return ''
	users.forEach(u => {
		if (u.userId === id) user = u
	})
	return user.profilePicture
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
				<div v-if="message.date">
					{{ getProperDateTime(message.date) }}
				</div>
				<div class="grid grid-cols-2 w-16 h-16 gap-2 min-w-[64px]">
					<img
						v-if="message.senderId"
						class="rounded-full object-cover w-8 h-8"
						:src="getProfilePicture(message.senderId)"
					/>
				</div>
			</div>
			<div
				class="text-black text-lg place-self-start"
				data-testid="message-info"
				v-else
			>
				<div v-if="message.date">
					{{ getProperDateTime(message.date) }}
				</div>
				<div class="grid grid-cols-2 w-16 h-16 gap-2 min-w-[64px]">
					<img
						v-if="message.senderId"
						class="rounded-full object-cover w-8 h-8"
						:src="getProfilePicture(message.senderId)"
					/>
				</div>
			</div>
		</div>
	</div>
</template>
