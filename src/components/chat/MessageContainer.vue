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
import Receipt from './Receipt.vue'
import BaseBtn from '../base/BaseBtn.vue'

interface MessageDTO {
	senderId?: string
	message?: string
	type: string
	date?: string
	receive: boolean
	chatId?: string
}

interface ChatData {
	userId: string
	messages: Array<MessageDTO>
}

type loanStatus =
	| 'PENDING'
	| 'ACCEPTED'
	| 'DECLINED'
	| 'COUNTER'
	| 'NOT_SENT'
	| 'UNDEFINED'

interface Props {
	chatData: ChatData
}
//DO NOT REMOVE NEEDED FOR REFRESHING CHAT (TO ALWAY BE AT BOTTOM)
onMounted(() => {
	var myDiv = document.getElementById('box')
	if (myDiv) myDiv.scrollTop = myDiv.scrollHeight
})

const { chatData } = defineProps<Props>()

function styleType(received: boolean) {
	switch (received) {
		case true:
			return 'bg-gray-400 text-black '
		case false:
			return 'bg-blue text-white justify-self-end'
		default:
			return 'bg-blue text-white'
	}
}
</script>
<template>
	<div
		class="border bg-gray-200 px-2 my-2 py-3 w-full h-full overflow-auto"
		id="box"
	>
		<div class="grid" v-for="(message, i) in chatData.messages">
			<Message
				v-if="message.type === 'CHAT'"
				:id="i"
				:receive="!message.receive"
			>
				<div data-testid="message">{{ message.message }}</div>
			</Message>
			<div class="text-black text-lg">
				{{ message.date }} - {{ message.senderId }}
			</div>
		</div>
	</div>
</template>
