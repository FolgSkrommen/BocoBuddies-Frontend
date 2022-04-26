<script setup lang="ts">
import Card from '../components/Card.vue'
import { computed, onBeforeMount, onMounted, Ref, ref, watch } from 'vue'
import { store, User } from '../store'
import MessageContainer from '../components/chat/MessageContainer.vue'
import BaseInput from '../components/base/BaseInput.vue'
import BaseBtn from '../components/base/BaseBtn.vue'
import BaseModal from '../components/base/BaseModal.vue'
//@ts-ignore
import SockJS from 'sockjs-client/dist/sockjs'
import Stomp, { Client } from 'webstomp-client'
import { useRoute } from 'vue-router'
import axios from 'axios'
const route = useRoute()

interface Chat {
	chatId: number
	itemId: number
	chatName: string
}

interface Item {}

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

interface Message {
	userId: string
	messages: Array<MessageDTO>
}

interface Loan {
	loanId: number
	item: number
	loaner: number
	start: string
	stop: string
	active?: boolean
	returned?: boolean
}

//WEBSOCKET
const stompClient = ref<Client>()
let socket: any
function connect() {
	socket = new SockJS('http://localhost:8001/ws')
	stompClient.value = Stomp.over(socket)
	stompClient.value.connect({}, onConnected, onError)
}

/**
 * Listens to two ws channels. One for receiving loan, one for receiving message
 */
function onConnected() {
	let groupId = route.params.id

	stompClient.value?.subscribe(
		'/chat/' + groupId + '/requestLoan',
		onRequestReceived
	)
	stompClient.value?.subscribe(
		'/chat/' + groupId + '/message',
		onMessageReceived
	)
	stompClient.value?.subscribe(
		'/chat/' + groupId + '/acceptLoan',
		onLoanAccept
	)
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

		stompClient.value.send(
			'/app/chat/sendMessage',
			JSON.stringify(chatMessage)
		)

		chatData.value?.messages.push(chatMessage)
		currentMessage.value = ''
	}
	event.preventDefault()
}

/**
 * When sending request via WS
 */
function sendLoanRequestWS() {
	if (stompClient.value) {
		if (chatData.value?.userId && chat.value?.chatId) {
			let loanRequest: Loan = {
				loanId: chat.value?.chatId,
				item: chat.value?.itemId,
				loaner: parseInt(chatData.value?.userId),
				start:
					dateAndTime.fromDate +
					'T' +
					dateAndTime.fromTime +
					':00.000Z',
				stop:
					dateAndTime.toDate + 'T' + dateAndTime.toTime + ':00.000Z',
			}
			stompClient.value.send(
				'/app/chat/sendLoanRequest',
				JSON.stringify(loanRequest)
			)
			let loanRequestMessage: MessageDTO = {
				type: 'REQUEST',
				receive: false,
				senderId: loanRequest.loaner.toString(),
				start:
					dateAndTime.fromDate +
					'T' +
					dateAndTime.fromTime +
					':00.000Z',
				stop:
					dateAndTime.toDate + 'T' + dateAndTime.toTime + ':00.000Z',
			}
			chatData.value?.messages.push(loanRequestMessage)
		}
	}
}

function sendLoanAccept() {
	if (stompClient.value) {
		let loanAccept: Loan = {
			loanId: 0,
			item: 0,
			loaner: 0,
			start: '',
			stop: '',
			returned: false,
			active: true,
		}
		//Axios call
	}
}

/**
 * Called when loan accepted
 * @param payload
 */
function onLoanAccept(payload: any) {
	console.log(payload)
	let accept = JSON.parse(payload.body)

	let msg: MessageDTO = {
		senderId: accept.loaner,
		type: 'ACCEPT',
		receive: true,
		start: accept.start,
		stop: accept.stop,
		returned: accept.returned,
		active: accept.active,
	}
}

/**
 * Called when request is received from ws
 * @param payload
 */
function onRequestReceived(payload: any) {
	console.log(payload)
	let request = JSON.parse(payload.body)
	let msg: MessageDTO = {
		senderId: request.loaner,
		type: 'REQUEST',
		receive: true,
		start: request.start,
		stop: request.stop,
		returned: request.returned,
		active: request.active,
	}
	console.log(msg)
	//Adds the received request to message array if receiver is not sender
	if (msg.senderId != chatData.value?.userId) {
		console.log(msg.senderId)
		console.log(chatData.value?.userId)
		chatData.value?.messages.push(msg)
	} else {
		console.log(msg.senderId)
		console.log(chatData.value?.userId)
	}
}

/**
 * When receiving a message
 * @param payload
 */
function onMessageReceived(payload: any) {
	let message = JSON.parse(payload.body)
	console.log(payload)
	let msg: MessageDTO = {
		senderId: message.senderId,
		message: message.message,
		type: 'CHAT',
		date: message.date,
		receive: true,
		chatId: chat.value?.chatId.toString(),
	}
	if (msg.senderId != chatData.value?.userId) {
		console.log(payload)
		chatData.value?.messages.push(msg)
	} else {
		console.log(msg.senderId)
		console.log(chatData.value?.userId)
	}
}

/**
 * Fetches data before view is mounted
 */
onBeforeMount(async () => {
	await axios
		.get('/chat?chatId=' + route.params.id)
		.then(res => {
			chat.value = res.data
		})
		.catch(err => {
			alert(err)
			console.log(err)
		})

	await axios
		.get('/message?chatId=' + chat.value?.chatId)
		.then(res => {
			chatData.value = res.data
			chatData.value?.messages.forEach(m => {
				m.receive = m.senderId != chatData.value?.userId
				m.type = 'CHAT'
			})
			chatData.value?.messages.reverse()
		})
		.catch(err => {
			//TODO handle error
			confirm(err)
			console.log(err)
		})

	/**console.log(chat.value?.itemId)
	if (chat.value?.itemId) {
		await axios
			.get('/item/' + chat.value?.itemId)
			.then(response => {
				console.log(response)
			})
			.catch(error => {
				alert(error)
			})
	}*/

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
		sendLoanRequestWS()
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

function handleLoanRequest() {
	if (loanStatus.value) {
		console.log('Loaned')
		sendLoanAccept()
	} else {
		console.log('Not loaned true')
	}
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
const loanStatus = ref(false)
const chatData = ref<Message>()
const chat = ref<Chat>()
</script>
<template>
	<div class="h-96 flex-col w-full">
		<h1 class="text-center text-4xl" v-if="chat">{{ chat.chatName }}</h1>
		<h2 class="text-center text-xl" v-if="chatData">
			{{ chatData.userId }}
		</h2>

		<MessageContainer
			class="grow"
			v-if="chatData && chat"
			:chatData="chatData"
			:chat="chat"
			v-model="loanStatus"
			data-testid="message-container"
			@update="handleLoanRequest"
		/>

		<form class="my-2" v-on:submit.prevent="sendMessage">
			<base-input
				class=""
				v-model="currentMessage"
				data-testid="message-input"
			/>

			<div class="flex gap-2 my-4">
				<BaseBtn
					class="grow bg-green-600"
					@click="toggleLoan"
					v-if="loanStatus === false"
					data-testid="rent-button"
					>Forespør</BaseBtn
				>

				<BaseBtn
					v-else
					data-testid="feedback-button"
					class="grow bg-purple-500"
					>Gi tilbakemelding</BaseBtn
				>
				<base-btn
					class="grow"
					type="submit"
					:disabled="currentMessage.length < 1"
					data-testid="submit-button"
					@click="sendMessage"
					>Send</base-btn
				>
			</div>
		</form>
	</div>

	<!-- Popup or modal for when requesting loan -->
	<BaseModal v-model="showLoanModal" title="Title" data-testid="loan-modal">
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
</template>
