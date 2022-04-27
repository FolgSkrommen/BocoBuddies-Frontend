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

interface ChatData {
	userId: string
	messages: Array<MessageDTO>
}

interface Props {
	chatData: ChatData
	modelValue: boolean
	chat: Chat
}

onMounted(() => {
	scrollToElement()
})

function scrollToElement(this: any) {
	const el = this.$refs.box
	if (el) {
		el.scrollIntoView({ behavior: 'smooth' })
	}
}

const emit = defineEmits(['update:modelValue'])

const confirm = () => {
	emit('update:modelValue', true)
}

const decline = () => {
	emit('update:modelValue', false)
}

const { chatData, modelValue, chat } = defineProps<Props>()

function styleType(received: boolean) {
	switch (received) {
		case true:
			return 'bg-gray-200 text-black '
		case false:
			return 'bg-blue text-white justify-self-end'
		default:
			return 'bg-blue text-white'
	}
}
</script>
<template>
	<div class="bg-gray-100 px-2 py-3 w-full h-full overflow-auto" id="box">
		<div class="grid" v-for="(message, i) in chatData.messages">
			<Message
				v-if="message.type === 'CHAT'"
				:id="i"
				:receive="!message.receive"
			>
				<div>{{ message.message }}</div>
			</Message>

			<div class="grid" v-else>
				<div
					class="w-2/3 rounded-lg border p-6 flex flex-col gap-3 text-center"
					:class="styleType(message.receive)"
				>
					<h1
						v-if="modelValue || message.type == 'ACCEPT'"
						class="text-2xl"
					>
						Avtalt lån
					</h1>
					<h1 v-else class="text-2xl">Forespørsel</h1>

					<h3>Fra: {{ message.start }}</h3>
					<h3>Til: {{ message.stop }}</h3>

					<div
						v-if="message.receive && !modelValue"
						class="flex gap-2"
					>
						<BaseBtn class="grow" @click="decline">Avslå</BaseBtn>

						<BaseBtn class="grow" @click="confirm">Bekreft</BaseBtn>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
