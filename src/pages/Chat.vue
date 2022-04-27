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
	chatId: number
	loanId?: number
	item?: number
	loaner?: number
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
			chatId: chat.value?.chatId,
			item: chat.value?.itemId,
			loaner: parseInt(chatData.value?.userId),
			start: range.value.start.toISOString(),
			end: range.value.end.toISOString(),
		}
		console.log(chatData.value?.userId)
		await axios
			.post('/loan', loanRequest)
			.then(res => {
				console.log(res.data)
				loanRequest = res.data
				loan.value = res.data

				let test = loanRequest
				if (stompClient.value && range.value && chat.value?.chatId) {
					test.chatId = chat.value?.chatId
					console.log(test)

					stompClient.value.send(
						'/app/chat/sendLoanRequest',
						JSON.stringify(test)
					)

					loanRequest = res.data
					console.log(loanRequest)

					let loanRequestMessage: MessageDTO = {
						type: 'REQUEST',
						receive: false,
						senderId: res.data.loaner.toString(),
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
		if (chat.value?.itemId && loan.value?.loanId) {
			console.log(loan.value)

			let loanRequest: Loan = {
				active: true,
				chatId: loan.value?.chatId,
				creationDate: loan.value?.creationDate,
				end: loan.value?.end,
				loanId: loan.value?.loanId,
				returned: false,
				start: loan.value?.start,
			}

			console.log(loanRequest)
			await axios
				.put('/loan', loanRequest)
				.then(res => {
					console.log(res)
				})
				.catch(err => {
					alert(err)
				})

			stompClient.value.send(
				'/app/chat/sendLoanRequest',
				JSON.stringify(loanRequest)
			)
		}
		console.log(chat.value?.itemId, loan.value?.loanId)
		loanStatus.value = false
		loanPending.value = true
	}
}

/**
 * Called when loan accepted
 * @param payload
 */
async function onLoanAccept(payload: any) {
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
	if (!msg.active && loan.value?.loanId) {
		loanStatus.value = false
		loanPending.value = false
		axios
			.delete('/loan?loanId=' + loan.value?.loanId)
			.then(res => {
				alert('Successfully denied loan!')
			})
			.catch(err => {
				alert(err)
			})
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
		if (loan.value) {
			console.log(request.loanId)
			loan.value.loanId = request.loanId
			loan.value.loaner = request.loaner
			loan.value.start = request.start
			loan.value.end = request.end
			loan.value.returned = request.returned
			loan.value.active = request.active
		} else if (chat.value?.chatId) {
			loan.value = {
				chatId: chat.value?.chatId,
				start: request.start,
				end: request.end,
				loanId: request.loanId,
				active: request.active,
				returned: request.returned,
			}
		}
		loanPending.value = true
		loanStatus.value = false
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
			console.log(res.data)
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
		.get('/loan?chatId=' + chat.value?.chatId)
		.then(res => {
			console.log(res.data)
			user.value = res.data.user
			item.value = res.data.item
			if (chat.value?.chatId) {
				loan.value = {
					chatId: chat.value?.chatId,
					start: res.data.loan.startTime,
					end: res.data.loan.endTime,
					loanId: res.data.loan.loanId,
					active: res.data.loan.active,
					returned: res.data.loan.returned,
				}
			}

			if (loan.value) {
				console.log('Log has value')
				console.log(res.data.loan)
				console.log(res.data.loan.startTime)
				console.log(res.data.loan.endTime)
				let msg: MessageDTO = {
					senderId: res.data.user.id.toString(),
					type: 'REQUEST',
					receive:
						res.data.user.id.toString() != chatData.value?.userId,
					start: res.data.loan.startTime,
					stop: res.data.loan.endTime,
					date: loan.value?.creationDate,
					returned: loan.value?.returned,
					active: loan.value?.active,
				}

				console.log(msg)
				chatData.value?.messages.push(msg)
				//Sorts chat by date
				chatData.value?.messages.sort(function (a, b) {
					if (a.date && b.date)
						return a.date > b.date ? -1 : a.date < b.date ? 1 : 0

					return -1
				})
				loanPending.value = true
				if (loan.value?.active) loanStatus.value = loan.value?.active

				console.log(chatData.value?.messages)
			}
		})
		.catch(err => {
			loanPending.value = false
			loanStatus.value = false
			alert(err)
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
			@update:modelValue="handleLoanRequest"
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
