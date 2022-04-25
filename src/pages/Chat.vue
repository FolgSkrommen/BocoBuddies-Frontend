<script setup lang="ts">
import Card from '../components/Card.vue'
import { computed, onMounted, ref } from 'vue'
import { store, User } from '../store'
import MessageContainer from '../components/chat/MessageContainer.vue'
import BaseInput from '../components/base/BaseInput.vue'
import BaseBtn from '../components/base/BaseBtn.vue'
import BaseModal from '../components/base/BaseModal.vue'
import SockJS from 'sockjs-client/dist/sockjs'
import Stomp, { Client } from 'webstomp-client'

import { WebSocket } from 'vite'
import router from '../router'
import { useRoute } from 'vue-router'
const route = useRoute()

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

enum Type {
	CHAT = 'CHAT',
	JOIN = 'JOIN',
}

interface Message {
	senderId: string
	sender: string
	recipientId: string
	chatId: string
	content: string
	type: string
}

//WEBSOCKET
const stompClient = ref<Client>()
let connected = ref<boolean>(false)
let socket: any
function connect() {
	socket = new SockJS('http://localhost:8001/ws')
	console.log('Created sock')
	stompClient.value = Stomp.over(socket)
	console.log('Stomped over sock')
	stompClient.value.connect({}, onConnected, onError)
}
let currentUserId = '1'
let groupId = route.params.id
let sessionId = ''
let url: string = ''
function onConnected() {
	// Subscribe to the Public Topic
	console.log(stompClient.value?.ws._transport.url)
	stompClient.value?.send(
		'/app/chat.addUser',
		JSON.stringify({ senderId: currentUserId, type: 'JOIN' })
	)
	stompClient.value?.subscribe(
		'/chat/' + groupId + '/user/' + currentUserId,
		onMessageReceived
	)
}

function onError() {
	console.log('Could not connect to Websocket server')
}

function sendMessage(event: any) {
	if (stompClient.value) {
		let chatMessage: Message = {
			senderId: '0',
			recipientId: currentMessage.value,
			sender: username.value,
			content: currentMessage.value,
			type: 'CHAT',
			chatId: '1',
		}
		console.log(JSON.stringify(chatMessage))
		stompClient.value.send(
			'/app/chat.sendMessage',
			JSON.stringify(chatMessage)
		)
		messages.value.push({
			message: currentMessage.value,
			date: new Date(),
			receive: false,
		})
		currentMessage.value = ''
	}
	event.preventDefault()
}

function onMessageReceived(payload: any) {
	console.log('Received!!')
	let message = JSON.parse(payload.body)
	console.log(payload)
	if (message.type === 'JOIN') {
		//alert(message.sender + ' joined')
	} else if (message.type === 'LEAVE') {
		//alert(message.sender + ' left!')
	} else {
		messages.value.push({
			message: message.content,
			date: new Date(),
			receive: true,
		})
	}
}

onMounted(() => {
	//connect()
})

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
	currentUserId = currentMessage.value
	connect()
	//alert(currentMessage.value)
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
//TODO add receiver to websocket
const showLoanModal = ref(false)
const username = ref<string>('Brukernavn')
const item = ref('Gjenstand')
const currentMessage = ref<string>('')
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
		<form v-on:submit.prevent="sendMessage">
			<div class="grid grid-cols-6">
				<div class="col-span-5">
					<base-input
						v-model="currentMessage"
						data-testid="message-input"
					></base-input>
				</div>
				<base-btn
					type="submit"
					data-testid="submit-button"
					@click="sendMessage"
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
			<BaseBtn class="place-self-center m-4" @click="onSubmit"
				>test</BaseBtn
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
