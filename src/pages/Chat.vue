<script setup lang="ts">
import Card from '../components/Card.vue'
import { computed, ref } from 'vue'
import { store, User } from '../store'
import MessageContainer from '../components/chat/MessageContainer.vue'
import BaseInput from '../components/Base/BaseInput.vue'
import BaseBtn from '../components/Base/BaseBtn.vue'
import BaseModal from '../components/Base/BaseModal.vue'
import component from '*.vue'
import { WebSocket } from 'vite'
import WebSocket = WebSocket.WebSocket
const messages = ref([
	{
		message: 'Kan jeg låne?',
		date: new Date(),
		receive: false,
	},
	{
		message: 'Yes sir!',
		date: new Date(),
		receive: true,
	},
	{
		message: 'GGWP',
		date: new Date(),
		receive: false,
	},
])

const websock = ref<WebSocket>()
let message = ref<string>('')
function initWebSocket() {
	// WebSocket is different from ordinary requests in terms of protocol, WS is equivalent to http, WSS is equivalent to HTTPS
	websock.value = new WebSocket('ws://localhost:8081/websocket/DPS007')
	websock.value.onopen = webSocketOnOpen
	websock.value.onerror = webSocketOnError
	websock.value.onmessage = webSocketOnMessage
	websock.value.onclose = webSocketClose
}

function webSocketOnOpen() {
	console.log('Websocket successful')
}

function webSocketOnError() {
	console.log('Websocket connection error')
}

function webSocketOnMessage(e: any) {
	let da = JSON.parse(e.data)
	console.log(da)
	message.value = da
}

function webSocketClose(e: any) {
	console.log('Connection closed (' + e.code + ')')
}

function toggleLoan() {
	showLoanModal.value = !showLoanModal.value
}

function sendLoanRequest() {
	if (
		dateAndTime.toDate !== '' &&
		dateAndTime.fromDate !== '' &&
		dateAndTime.toTime !== '' &&
		dateAndTime.fromTime !== ''
	) {
		console.log(dateAndTime)
		//TODO add checks if from date is later than to etc
		toggleLoan()
	} else {
		alert('Add exception handling')
	}
}

function cancelLoanRequest() {
	dateAndTime = {
		fromDate: '',
		fromTime: '',
		toDate: '',
		toTime: '',
	}
	toggleLoan()
}

function onSubmit() {
	alert(currentMessage.value)
	currentMessage.value = ''
}
interface DateAndTime {
	fromDate: string
	fromTime: string
	toDate: string
	toTime: string
}
/*
let dateAndTime: DateAndTime = {
  fromDate: new Date().toISOString().split('T')[0],
  fromTime: "12:00",
  toDate: new Date().toISOString().split('T')[0],
  toTime: "13:00"
}
* */

let dateAndTime: DateAndTime = {
	fromDate: '',
	fromTime: '',
	toDate: '',
	toTime: '',
}

function getReceive(id: number) {
	return id === store?.state?.user?.id
}

const showLoanModal = ref(false)
const username = ref('Brukernavn')
const item = ref('Gjenstand')
const currentMessage = ref('')
const loanStatus = ref(undefined)
</script>
<template>
	<div>
		<h1 class="text-center text-4xl">{{ username }}</h1>
		<h2 class="text-center text-xl">{{ item }}</h2>

		<MessageContainer
			:messages="messages"
			v-model="loanStatus"
			data-testid="message-container"
		>
		</MessageContainer>
		<form v-on:submit.prevent="onSubmit">
			<div class="grid grid-cols-6">
				<div class="col-span-5">
					<base-input
						v-model="currentMessage"
						data-testid="message-input"
					></base-input>
				</div>
				<base-btn type="submit" data-testid="submit-button"
					>Send</base-btn
				>
			</div>
		</form>

		<div class="grid">
			<BaseBtn
				class="place-self-center m-4"
				@click="toggleLoan"
				v-if="loanStatus === undefined"
				data-testid="rent-button"
				>Lån</BaseBtn
			>
		</div>
		<!-- Popup or modal for when requesting loan -->
		<BaseModal
			v-model="showLoanModal"
			title="Title"
			data-testid="loan-modal"
		>
			<template v-slot:header> Når vil du leie gjenstanden? </template>
			<template v-slot:body>
				<BaseInput
					type="date"
					label="Fra (dato)"
					v-model="dateAndTime.fromDate"
				></BaseInput>
				<BaseInput
					type="time"
					label="Fra (tidspunkt)"
					v-model="dateAndTime.fromTime"
				></BaseInput>

				<BaseInput
					type="date"
					label="Til"
					v-model="dateAndTime.toDate"
				></BaseInput>
				<BaseInput
					type="time"
					label="Til (tidspunkt)"
					v-model="dateAndTime.toTime"
				></BaseInput>
			</template>
			<template v-slot:footer>
				<div class="grid gap-4 grid-cols-2">
					<BaseBtn @click="cancelLoanRequest">Avbryt</BaseBtn>
					<BaseBtn @click="sendLoanRequest">Send</BaseBtn>
				</div>
			</template>
		</BaseModal>

		<div
			class="grid"
			v-if="loanStatus === true"
			data-testid="feedback-button"
		>
			<BaseBtn class="place-self-center m-4">Gi tilbakemelding</BaseBtn>
		</div>
	</div>
</template>
