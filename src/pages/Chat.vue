<script setup lang="ts">
import Card from '../components/Card.vue'
import { computed, onBeforeMount, onMounted, Ref, ref } from 'vue'
import { store, User } from '../store'
import MessageContainer from '../components/chat/MessageContainer.vue'
import BaseInput from '../components/base/BaseInput.vue'
import BaseBtn from '../components/base/BaseBtn.vue'
import BaseModal from '../components/base/BaseModal.vue'
import SockJS from 'sockjs-client/dist/sockjs'
import Stomp, { Client } from 'webstomp-client'

import router from '../router'
import { useRoute } from 'vue-router'
import axios from 'axios'
const route = useRoute()

const chatData = ref({
	userId: '',
	messages: [],
})
const chat = ref<Chat>()

interface Receipt {}

interface Chat {
	chatId: number
	itemId: number
	chatName: string
}

enum Type {
	CHAT = 'CHAT',
	JOIN = 'JOIN',
}

interface MessageDTO {
	senderId: string | undefined
	message: string
	type: string
	date: string
	receive: boolean
	chatId: string | undefined
}

interface Message {
	userId: string
	messages: Array<MessageDTO>
}

interface sendMessage {}

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

function onConnected() {
	stompClient.value?.send(
		'/app/chat/addUser',
		JSON.stringify({ senderId: currentUserId, type: 'JOIN' })
	)
	console.log('got here')
	stompClient.value?.subscribe('/chat/' + groupId, onMessageReceived)
}

function onError(err: any) {
	console.log('Could not connect to Websocket server')
	console.log(err)
}

function sendMessage(event: any) {
	if (stompClient.value) {
		let chatMessage: MessageDTO = {
			senderId: chatData.value?.userId,
			message: currentMessage.value,
			type: 'CHAT',
			date: new Date().toDateString(),
			receive: false,
			chatId: chat.value?.chatId.toString(),
		}

		console.log(JSON.stringify(chatMessage))

		stompClient.value.send(
			'/app/chat/sendMessage',
			JSON.stringify(chatMessage)
		)

		chatData.value.messages.push(chatMessage)
		currentMessage.value = ''
	}
	event.preventDefault()
}

function sendReceipt(event: any) {
	if (stompClient.value) {
		let chatMessage: MessageDTO = {
			senderId: '',
			message: currentMessage.value,
			type: 'REQUEST_LOAN',
			date: new Date().toDateString(),
			receive: false,
			chatId: chat.value?.chatId.toString(),
		}

		console.log(JSON.stringify(chatMessage))

		stompClient.value.send(
			'/app/chat.sendMessage',
			JSON.stringify(chatMessage)
		)

		//chatData.value?.messages.push(chatMessage)
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
	} else if (message.type === 'REQUEST') {
		//TODO add rent/loan here
	} else {
		let msg: MessageDTO = {
			senderId: message.senderId,
			message: message.message,
			type: '',
			date: message.date,
			receive: true,
			chatId: chat.value?.chatId.toString(),
		}
		if (msg.senderId != chatData.value.userId) {
			console.log(payload)
			chatData.value?.messages.push(msg)
		} else {
			console.log(msg.senderId)
			console.log(chatData.value.userId)
		}
	}
}

onBeforeMount(async () => {
	await axios
		.get('/chat?chatId=' + route.params.id)
		.then(res => {
			chat.value = res.data
		})
		.catch(err => {
			//TODO handle error
			console.log(err)
		})

	await axios
		.get('/message?chatId=' + chat.value?.chatId)
		.then(res => {
			console.log(res.data)
			chatData.value = res.data
			chatData.value.messages.forEach(m => {
				m.receive = m.senderId != chatData.value.userId
			})
			for (let i = 0; i < chatData.value.messages.length; i++) {
				chatData.value.messages
			}
		})
		.catch(err => {
			console.log(err)
		})

	console.log(chatData.value?.messages)
	await connect()
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

let dateAndTime: DateAndTime = {
	fromDate: '',
	fromTime: '',
	toDate: '',
	toTime: '',
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
		<h1 class="text-center text-4xl" v-if="chat">{{ chat.chatName }}</h1>
		<h2 class="text-center text-xl">{{ chatData.userId }}</h2>

		<MessageContainer
			:chatData="chatData"
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
