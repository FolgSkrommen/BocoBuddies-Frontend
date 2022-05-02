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

interface Props {
	messages: MessageInterface[]
}
//DO NOT REMOVE NEEDED FOR REFRESHING CHAT (TO ALWAY BE AT BOTTOM)
onMounted(() => {
	var myDiv = document.getElementById('box')
	if (myDiv) myDiv.scrollTop = myDiv.scrollHeight
})

const { messages } = defineProps<Props>()

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
				v-if="message.receive"
			>
				{{ message.date }} - {{ message.senderId }}
			</div>
			<div
				class="text-black text-lg place-self-start"
				data-testid="message-info"
				v-else
			>
				{{ message.date }} - {{ message.senderId }}
			</div>
		</div>
	</div>
</template>
