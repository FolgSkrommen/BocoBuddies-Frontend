<script setup lang="ts">
import Card from '../components/Card.vue'
import { computed, onMounted, PropType, ref } from 'vue'
import Message from './Message.vue'
import Receipt from './Receipt.vue'
import BaseBtn from '../base/BaseBtn.vue'

interface IMessage {
	message: String
	date: Date
	receive: boolean
}

interface Props {
	messages: IMessage[]
	modelValue: boolean
}

const receipt = ref({
	username: 'Bruker',
	itemName: 'Fiskestang',
	loanStart: new Date().toDateString(),
	loanStop: new Date().toDateString(),
	itemPrice: 1000,
	itemUnit: 'dag',
	address: 'Adresse',
})

const { messages, modelValue } = defineProps<Props>()
</script>
<template>
	<div
		class="bg-F7F9FC-100 border px-4 py-3 rounded md:container mx-auto h-full min-h-screen"
	>
		<Message
			v-for="(message, i) in messages"
			:id="i"
			:receive="message.receive"
		>
			<div>{{ message.message }}</div>
		</Message>
		<receipt :receipt="receipt" v-model="modelValue"></receipt>
		<receipt
			:receipt="receipt"
			:receive="true"
			v-model="modelValue"
		></receipt>
	</div>
</template>
