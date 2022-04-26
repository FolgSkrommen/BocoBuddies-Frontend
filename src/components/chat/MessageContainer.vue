<script setup lang="ts">
import Card from '../components/Card.vue'
import { computed, onMounted, PropType, ref } from 'vue'
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
	start?: string
	stop?: string
	active?: boolean
	returned?: boolean
}

interface Chat {
	chatId: number
	itemId: number
	chatName: string
}

interface Message {
	userId: string
	messages: Array<MessageDTO>
}

interface Props {
	chatData: Message
	modelValue: boolean
	chat: Chat
}

const emit = defineEmits(['update:modelValue'])

const confirm = () => {
	emit('update:modelValue', true)
}

const decline = () => {
	emit('update:modelValue', false)
}

const { chatData, modelValue, chat } = defineProps<Props>()
</script>
<template>
	<div
		class="bg-gray-100 border px-2 py-3 rounded w-full h-full overflow-auto"
		id="box"
	>
		<Message
			v-for="(message, i) in chatData.messages"
			:id="i"
			:receive="!message.receive"
		>
			<div v-if="message.type === 'CHAT'">
				<div>{{ message.message }}</div>
			</div>
			<div v-if="message.type === 'REQUEST'">
				<div
					class="bg-blue text-white rounded-md w-fit place-self-end text-center"
					v-if="!message.receive"
				>
					<h2 class="text-xl">Forespørsel</h2>
					<h3>{{ chat.itemId }}</h3>
					<h3>{{ message.start }} - {{ message.stop }}</h3>
					<div
						v-if="modelValue === undefined"
						class="grid gap-4 grid-cols-2"
					>
						<BaseBtn @click="decline">Avslå</BaseBtn>

						<BaseBtn @click="confirm">Bekreft</BaseBtn>
					</div>
				</div>
				<div
					class="bg-gray-200 border text-black px-4 py-3 rounded-lg my-5 w-fit self-auto text-center"
					v-else
				>
					<h2 class="text-xl">Forespørsel</h2>
					<h3>{{ chat.itemId }}</h3>
					<h3>{{ message.start }} - {{ message.stop }}</h3>
				</div>
			</div>
		</Message>
	</div>
</template>
