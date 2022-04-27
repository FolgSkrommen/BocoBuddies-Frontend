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
	console.log(range.value)
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
				creationDate: new Date().toISOString(),
				end: new Date().toISOString(),
				loanId: loan.value?.loanId,
				returned: false,
				start: new Date().toISOString(),
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
				'/app/chat/acceptLoan',
				JSON.stringify(loanRequest)
			)
		}
		console.log(chat.value?.itemId, loan.value?.loanId)
		loanStatus.value = false
		loanPending.value = true
	}
}

async function sendLoanDecline() {
	await axios
		.delete('/loan?loanId=' + loan.value?.loanId)
		.then(res => {})
		.catch(err => {
			alert(err)
		})

	console.log(stompClient.value, range.value, chat.value?.chatId)
	if (stompClient.value && chat.value?.chatId) {
		let loanAnswer: Loan = {
			chatId: chat.value?.chatId,
			item: chat.value?.itemId,
			active: false,
			returned: false,
			start: new Date().toISOString(),
			end: new Date().toISOString(),
		}

		stompClient.value.send(
			'/app/chat/acceptLoan',
			JSON.stringify(loanAnswer)
		)
	}
	console.log('Not loaned true')
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

	if (msg.senderId != chatData.value?.userId) {
		//If loan is accepted
		if (msg.active && !msg.returned) {
			console.log('Loan accepted')
			loanStatus.value = true
		}

		//If loan is denied
		console.log(msg.active, msg.returned)
		if (!msg.active && !msg.returned) {
			console.log('Loan denied')
			loanStatus.value = false
			loanPending.value = false
			if (chatData.value)
				chatData.value.messages = chatData.value?.messages.filter(
					function (item, index, arr) {
						return item.type !== 'REQUEST'
					}
				)
		}
	}
	reRenderChat()
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
		console.log('LOOK HERE: ' + msg)
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
	reRenderChat()
}

/**
 * When receiving a message
 * @param payload
 */
function onMessageReceived(payload: any) {
	let message = JSON.parse(payload.body)

	let msg: MessageDTO = {
		senderId: message.senderId,
		message: message.message,
		type: 'CHAT',
		date: message.date,
		receive: true,
		chatId: chat.value?.chatId.toString(),
	}
	if (msg.senderId != chatData.value?.userId) {
		chatData.value?.messages.push(msg)
	} else {
		console.log(msg.senderId)
		console.log(chatData.value?.userId)
	}
	reRenderChat()
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

	if (chat.value?.itemId) {
		await axios
			.get('/item', {
				params: {
					id: chat.value?.itemId,
				},
			})
			.then(response => {
				item.value = response.data.item
				lender.value = response.data.lender
			})
			.catch(error => {})
	}
	//TODO /loan/chat?chatId=
	await axios
		.get('/loan/chat?chatId=' + chat.value?.chatId)
		.then(res => {
			user.value = res.data.user
			if (chat.value?.chatId) {
				loan.value = {
					chatId: chat.value?.chatId,
					start: res.data.loan.startDate,
					end: res.data.loan.endDate,
					loanId: res.data.loan.loanId,
					active: res.data.loan.active,
					returned: res.data.loan.returned,
				}
			}

			if (loan.value) {
				let msg: MessageDTO = {
					senderId: res.data.user.userId.toString(),
					type: 'REQUEST',
					receive:
						res.data.user.userId.toString() !=
						chatData.value?.userId,
					start: res.data.loan.startDate,
					stop: res.data.loan.endDate,
					date: loan.value?.creationDate,
					returned: loan.value?.returned,
					active: loan.value?.active,
				}

				if (msg.active && !msg.returned) msg.type = 'ACCEPT'

				chatData.value?.messages.push(msg)
				//Sorts chat by date
				console.log(chatData.value?.messages)
				chatData.value?.messages.sort(function (a, b) {
					if (a.date && b.date)
						return a.date > b.date ? -1 : a.date < b.date ? 1 : 0

					return -1
				})
				console.log(chatData.value?.messages)
				loanPending.value = true
				if (loan.value?.active) loanStatus.value = loan.value?.active
			}
		})
		.catch(err => {
			loanPending.value = false
			loanStatus.value = false
		})

	await connect()
	reRenderChat()
})

function sendLoanRequest() {
	showLoginModal.value = !showLoginModal.value
	if (!range.value) return
	//TODO: add checks if from date is later than to etc
	sendLoanRequestWS()
	loanPending.value = true
}
function handleLoanRequest() {
	if (loanStatus.value) {
		console.log('Loaned')
		sendLoanAccept()
	} else {
		loanStatus.value = false
		loanPending.value = false
		sendLoanDecline()
	}
}

const item = ref<Item>()
const user = ref<User>()
const lender = ref<User>()
const loan = ref<Loan>()

const currentMessage = ref<string>('')
const loanStatus = ref(false)
const loanPending = ref(false)
const chatData = ref<Message>()
const chat = ref<Chat>()

const showLoginModal = ref(false)

interface Range {
	start: Date
	end: Date
}
const range = ref<Range>()
const render = ref<number>(0)

function reRenderChat() {
	window.scrollTo(0, document.body.scrollHeight)
}
</script>
<template>
	<div class="h-full flex-col w-full">
		<div class="flex gap-2">
			<RouterLink class="place-sel" to="/chats"> Back </RouterLink>
			<img class="w-12 rounded" v-if="item" :src="item.images[0]" />
			<h1 class="text-center text-4xl" v-if="item?.name">
				{{ item.name }}
			</h1>
			<h1 class="text-center text-4xl" v-else>Chat</h1>
		</div>

		<MessageContainer
			class="grow"
			v-if="chatData && chat"
			:chatData="chatData"
			:chat="chat"
			:key="render"
			v-model="loanStatus"
			data-testid="message-container"
			@update:modelValue="handleLoanRequest"
		/>

		<form class="my-2" v-on:submit.prevent="sendMessage">
			<div class="flex gap-2 content-center min-h-fit">
				<base-input
					class="grow"
					v-model="currentMessage"
					data-testid="message-input"
				/>
				<base-btn
					class="h-full"
					type="submit"
					:disabled="currentMessage.length < 1"
					data-testid="submit-button"
					@click="sendMessage"
					>Send</base-btn
				>
			</div>

			<div class="flex my-4">
				<BaseBtn
					v-if="lender?.userId != store.state.user?.id && !loanStatus"
					class="grow bg-green-600"
					:disabled="loanPending || loanStatus"
					data-testid="rent-button"
					@click="showLoginModal = true"
					>Forespør</BaseBtn
				>
				<BaseBtn
					v-if="
						lender?.userId != store.state.user?.id &&
						loanStatus &&
						loanPending
					"
					data-testid="feedback-button"
					class="grow bg-purple-500"
					>Gi tilbakemelding</BaseBtn
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
