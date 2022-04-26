<script setup lang="ts">
import Card from '../components/Card.vue'
import { computed, onBeforeMount, onMounted, Ref, ref, watch } from 'vue'
import { store } from '../store'
import MessageContainer from '../components/chat/MessageContainer.vue'
import BaseInput from '../components/base/BaseInput.vue'
import { DatePicker } from 'v-calendar'
import 'v-calendar/dist/style.css'
import BaseBtn from '../components/base/BaseBtn.vue'

//@ts-ignore
import SockJS from 'sockjs-client/dist/sockjs'
import Stomp, { Client } from 'webstomp-client'
import { useRoute } from 'vue-router'
import axios from 'axios'
import BasePopup from '../components/base/BasePopup.vue'
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
	end: string
	active?: boolean
	returned?: boolean
	creationDate?: string
}

interface Item {
	name: string
	description: string
	price: number
	priceUnit: string
	postalCode: string
	address: string
	images: string[]
	availableFrom: string
	availableTo: string
	categories: string[]
}

interface User {
	userId: number
	firstName: string
	lastName: string
	username: string
	rating: number
	pictureUrl: string
	trusted: boolean
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
async function sendLoanRequestWS() {
	if (chatData.value?.userId && chat.value?.chatId && range.value) {
		let loanRequest: Loan = {
			loanId: chat.value?.chatId,
			item: chat.value?.itemId,
			loaner: parseInt(chatData.value?.userId),
			start: range.value.start.toISOString(),
			end: range.value.end.toISOString(),
		}

		await axios
			.post('/loan', loanRequest)
			.then(res => {
				loanRequest = res.data
				loan.value = res.data
				let test = loanRequest
				if (stompClient.value && range.value) {
					test.loaner = 6
					stompClient.value.send(
						'/app/chat/sendLoanRequest',
						JSON.stringify(test)
					)
					loanRequest = res.data
					console.log(loanRequest)
					let loanRequestMessage: MessageDTO = {
						type: 'REQUEST',
						receive: false,
						senderId: loanRequest.loaner.toString(),
						start: range.value.start.toISOString(),
						stop: range.value.end.toISOString(),
					}
					chatData.value?.messages.push(loanRequestMessage)
				}
			})
			.catch(err => {
				alert(err)
			})
	}
}

async function sendLoanAccept() {
	if (stompClient.value) {
		if (loanId.value !== -1 && chat.value?.itemId && loan.value?.loanId) {
			let loanAccept: Loan = {
				loanId: loan.value?.loanId,
				item: chat.value?.itemId,
				loaner: 0,
				start: '',
				end: '',
				returned: false,
				active: true,
			}

			await axios
				.put('/loan', loanAccept)
				.then(res => {
					loanAccept = res.data
				})
				.catch(err => {
					alert(err)
				})

			stompClient.value.send(
				'/app/chat/sendLoanRequest',
				JSON.stringify(loanAccept)
			)
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
		stop: accept.end,
		returned: accept.returned,
		active: accept.active,
	}

	//If loan is accepted
	if (msg.active && !msg.returned) {
		loanStatus.value = true
	}

	//If loan is denied
	if (!msg.active) {
		loanStatus.value = false
		loanPending.value = false
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
		stop: request.end,
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

	await axios
		.get('/loan')
		.then(res => {
			user.value = res.data.user
			item.value = res.data.item
			loan.value = res.data.loan
			if (loan.value) {
				let msg: MessageDTO = {
					senderId: loan.value?.loaner.toString(),
					type: 'REQUEST',
					receive:
						loan.value?.loaner.toString() != chatData.value?.userId,
					start: loan.value?.start,
					stop: loan.value?.end,
					date: loan.value?.creationDate,
					returned: loan.value?.returned,
					active: loan.value?.active,
				}
				chatData.value?.messages.push(msg)
				//Sorts chat by date
				chatData.value?.messages.sort(function (a, b) {
					if (a.date && b.date)
						return a.date > b.date ? -1 : a.date < b.date ? 1 : 0

					return -1
				})
			}
		})
		.catch(err => {})
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

function sendLoanRequest() {
	if (!range.value) return
	//TODO: add checks if from date is later than to etc
	sendLoanRequestWS()
}
function handleLoanRequest() {
	if (loanStatus.value) {
		console.log('Loaned')
		sendLoanAccept()
	} else {
		console.log('Not loaned true')
	}
}

const username = ref<string>('Brukernavn')

const item = ref<Item>()
const user = ref<User>()
const loan = ref<Loan>()

const currentMessage = ref<string>('')
const loanStatus = ref(false)
const loanPending = ref(false)
const loanId = ref(-1)
const chatData = ref<Message>()
const chat = ref<Chat>()

const showLoginModal = ref(false)

interface Range {
	start: Date
	end: Date
}
const range = ref<Range>()
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
					v-if="loanStatus === false"
					:disabled="loanPending || loanStatus"
					data-testid="rent-button"
					@click="showLoginModal = true"
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

	<BasePopup v-show="showLoginModal" @exit="showLoginModal = false">
		<DatePicker
			class="place-self-center"
			v-model="range"
			mode="dateTime"
			is-range
			locale="no"
			is24hr
		/>
		<div class="flex justify-between">
			<BaseBtn @click="showLoginModal = false" color="gray"
				>Avbryt</BaseBtn
			>
			<BaseBtn @click="sendLoanRequest" :disabled="!range"
				>Avtal lån</BaseBtn
			>
		</div>
	</BasePopup>
</template>
