<script setup lang="ts">
import Card from '../components/Card.vue'
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
	console.log(users)
	let name = 'Usikkert'
	if (!users) return name
	users.forEach(user => {
		console.log(id)
		console.log(user.userId)
		if (user.userId === id) name = user.firstName
	})
	return name
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
				class="text-black text-lg place-self-end"
				data-testid="message-info"
				v-if="!message.receive"
			>
				{{ getProperDateTime(message.date) }} -
				{{ getUserName(message.senderId) }}
			</div>
			<div
				class="text-black text-lg place-self-start"
				data-testid="message-info"
				v-else
			>
				{{ getUserName(message.senderId) }} -
				{{ getProperDateTime(message.date) }}
			</div>
		</div>
	</div>
</template>
