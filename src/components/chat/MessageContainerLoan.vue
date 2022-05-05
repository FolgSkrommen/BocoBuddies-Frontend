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
	| 'REVIEWED'

interface Props {
	messages: MessageInterface[]
	modelValue: loanStatus
	chat: Chat
	item: Item
}
//DO NOT REMOVE NEEDED FOR REFRESHING CHAT (TO ALWAYS BE AT BOTTOM)
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

const { messages, modelValue, chat, item } = defineProps<Props>()

function getProperDateTime(dateTime: string) {
	let time = dateTime.substring(11, 16)
	let date = dateTime.substring(0, 10)
	return date + ' - ' + time
}

function getPriceUnit(unit: string) {
	if (unit === 'DAY') return 'Dag'
	if (unit === 'HOUR') return 'Time'
	if (unit === 'MONTH') return 'Måned'
	if (unit === 'WEEK') return 'Uke'
	if (unit === 'YEAR') return 'År'
}

function isValidHttpUrl(string: string) {
	let url

	try {
		url = new URL(string)
	} catch (_) {
		return false
	}

	return url.protocol === 'http:' || url.protocol === 'https:'
}

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
</script>
<template>
	<div
		class="border bg-slate-200 px-2 my-2 py-3 w-full h-full overflow-auto"
		id="box"
	>
		<div class="grid" v-for="(message, i) in messages" :key="i">
			<Message
				v-if="message.type === 'CHAT'"
				:id="i"
				:receive="!message.receive"
			>
				<a
					v-if="message.message && isValidHttpUrl(message.message)"
					:href="message.message"
					class="text-decoration-line: underline white"
				>
					<div data-testid="message">{{ message.message }}</div>
				</a>
				<div data-testid="message" v-else>{{ message.message }}</div>
			</Message>

			<!--Kvittering-->
			<div
				v-else
				class="w-2/3 rounded-xl border p-6 flex flex-col gap-3 text-center"
				:class="styleType(message.receive)"
			>
				<div
					v-if="
						modelValue === 'ACCEPTED' || message.type === 'ACCEPT'
					"
				>
					<h3 class="text-2xl" data-testid="accept-h">Avtalt lån</h3>
					<h3 class="text-xl" data-testid="accept-h">Ikke Levert</h3>
				</div>

				<h3
					v-else-if="
						modelValue === 'RETURNED' ||
						modelValue === 'REVIEWED' ||
						message.type === 'RETURNED'
					"
					data-testid="returned-h"
				>
					Lån tilbakelevert
				</h3>
				<h3 v-else class="text-2xl" data-testid="request-h">
					Forespørsel
				</h3>

				<!--Tidsintervall-->
				<div>
					<h4 v-if="message.start">
						Fra: {{ getProperDateTime(message.start) }}
					</h4>
					<h4 v-if="message.stop">
						Til: {{ getProperDateTime(message.stop) }}
					</h4>
				</div>

				<!--Adresse-->
				<div>
					<h3>{{ item.address }}, {{ item.postalCode }}</h3>
				</div>

				<!--Pris-->
				<div>
					<h3>
						{{ message.price }} kr /
						{{ getPriceUnit(item.priceUnit) }}
					</h3>
				</div>

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
</template>
