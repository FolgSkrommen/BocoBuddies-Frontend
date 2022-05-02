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
import { Chat, Item, Message as MessageInterface } from '../../api/schema'

type loanStatus =
	| 'PENDING'
	| 'ACCEPTED'
	| 'DECLINED'
	| 'COUNTER'
	| 'NOT_SENT'
	| 'UNDEFINED'
	| 'RETURNED'

interface Props {
	messages: MessageInterface[]
	modelValue: loanStatus
	chat: Chat
	item: Item
}
//DO NOT REMOVE NEEDED FOR REFRESHING CHAT (TO ALWAY BE AT BOTTOM)
onMounted(() => {
	var myDiv = document.getElementById('box')
	if (myDiv) myDiv.scrollTop = myDiv.scrollHeight
})

const emit = defineEmits(['update:modelValue'])

const confirm = () => {
	emit('update:modelValue', 'ACCEPTED')
}

const decline = () => {
	emit('update:modelValue', 'DECLINED')
}

const negotiate = () => {
	emit('update:modelValue', 'RETURNED')
}

const { messages, modelValue, chat, item } = defineProps<Props>()

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
		<div class="grid" v-for="(message, i) in messages">
			<Message
				v-if="message.type === 'CHAT'"
				:id="i"
				:receive="!message.receive"
			>
				<div data-testid="message">{{ message.message }}</div>
			</Message>

			<div class="grid" v-else>
				<div
					class="w-2/3 rounded-lg border p-6 flex flex-col gap-3 text-center"
					:class="styleType(message.receive)"
				>
					<h1
						v-if="
							modelValue === 'ACCEPTED' ||
							message.type === 'ACCEPT'
						"
						class="text-2xl"
						data-testid="accept-h"
					>
						Avtalt lån
					</h1>
					<h1
						v-if="
							modelValue === 'RETURNED' ||
							message.type === 'RETURNED'
						"
						class="text-2xl"
						data-testid="returned-h"
					>
						Lån tilbakelevert
					</h1>
					<h1 v-else class="text-2xl" data-testid="request-h">
						Forespørsel
					</h1>

					<h3>Fra: {{ message.start }}</h3>
					<h3>Til: {{ message.stop }}</h3>
					<h3>Price: {{ message.price }}kr / {{ item.priceUnit }}</h3>

					<div
						v-if="message.receive && modelValue === 'PENDING'"
						class="flex gap-2"
					>
						<BaseBtn
							class="grow"
							@click="decline"
							data-testid="decline-btn"
							>Avslå</BaseBtn
						>
						<BaseBtn
							class="grow"
							@click="confirm"
							data-testid="confirm-btn"
							>Bekreft</BaseBtn
						>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
