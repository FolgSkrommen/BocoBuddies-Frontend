<script setup lang="ts">
import Card from '../components/Card.vue'
import { PropType, ref } from 'vue'
import BaseBtn from '../base/BaseBtn.vue'

interface IReceipt {
	itemId: number
	loanStart: String
	loanStop: String
	itemPrice: Number
	itemUnit: String
	address: String
}

interface Props {
	receipt: IReceipt
	receive: boolean
	modelValue: boolean
}

const emit = defineEmits(['update:modelValue'])

const confirm = () => {
	emit('update:modelValue', true)
}

const decline = () => {
	emit('update:modelValue', false)
}

const { receipt, receive, modelValue } = defineProps<Props>()
</script>
<template>
	<div class="grid" v-if="modelValue !== false">
		<div
			class="bg-blue border text-white px-4 py-3 rounded-lg my-5 w-fit place-self-end text-center"
			v-if="receive"
		>
			<h2 class="text-xl">Kvittering</h2>
			<h3>{{ receipt.username }}</h3>
			<h3>{{ receipt.itemName }}</h3>
			<h3>{{ receipt.loanStart }} - {{ receipt.loanStop }}</h3>
			<h3>{{ receipt.itemPrice }} per {{ receipt.itemUnit }}</h3>
			<h3>{{ receipt.address }}</h3>
			<div v-if="modelValue === undefined" class="grid gap-4 grid-cols-2">
				<div>
					<BaseBtn @click="decline">Avslå</BaseBtn>
				</div>
				<div>
					<BaseBtn @click="confirm">Bekreft</BaseBtn>
				</div>
			</div>
		</div>
		<div
			class="bg-gray-200 border text-black px-4 py-3 rounded-lg my-5 w-fit self-auto text-center"
			v-else
		>
			<h2 class="text-xl">Kvittering</h2>
			<h3>{{ receipt.username }}</h3>
			<h3>{{ receipt.itemName }}</h3>
			<h3>{{ receipt.loanStart }} - {{ receipt.loanStop }}</h3>
			<h3>{{ receipt.itemPrice }} per {{ receipt.itemUnit }}</h3>
			<h3>{{ receipt.address }}</h3>
		</div>
	</div>
</template>
