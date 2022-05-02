<script setup lang="ts">
import Card from '../../components/Card.vue'
import { computed, onBeforeMount, Ref, ref, watch } from 'vue'
import { store } from '../../store'
import MessageContainer from '../../components/chat/MessageContainerLoan.vue'
import BaseInput from '../../components/base/BaseInput.vue'
import { DatePicker } from 'v-calendar'
import 'v-calendar/dist/style.css'
import BaseBtn from '../../components/base/BaseBtn.vue'

//@ts-ignore
import SockJS from 'sockjs-client/dist/sockjs'
import Stomp, { Client } from 'webstomp-client'
import { useRoute } from 'vue-router'
import axios from 'axios'
import BasePopup from '../../components/base/BasePopup.vue'
import RateUserPopup from '../../components/RateUserPopup.vue'
import { User } from '../../api/schema'

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
	price?: number
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
	price: number
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

type loanStatusCode =
	| 'PENDING'
	| 'ACCEPTED'
	| 'DECLINED'
	| 'COUNTER'
	| 'NOT_SENT'
	| 'RETURNED'
	| 'UNDEFINED'

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

async function sendMessage(event: any) {
	if (!stompClient.value) return

	let chatMessage: MessageDTO = {
		senderId: chatData.value?.userId,
		message: currentMessage.value,
		type: 'CHAT',
		date: new Date().toISOString(),
		receive: false,
		chatId: chat.value?.chatId.toString(),
	}
	try {
		//const res = await axios.post("/message", chatMessage)

		stompClient.value.send(
			'/app/chat/sendMessage',
			JSON.stringify(chatMessage)
		)

		chatData.value?.messages.push(chatMessage)
	} catch (error) {}
	currentMessage.value = ''

	event.preventDefault()
}

/**
 * When sending request via WS
 */
async function sendLoanRequestWS() {
	console.log(range.value)
	if (!stompClient.value) return
	if (!chatData.value?.userId || !chat.value?.chatId || !range.value) return

	let loanRequest: Loan = {
		chatId: chat.value?.chatId,
		item: chat.value?.itemId,
		loaner: parseInt(chatData.value?.userId),
		start: range.value.start.toISOString(),
		end: range.value.end.toISOString(),
		price: price.value,
	}
	console.log(chatData.value?.userId)
	try {
		const res = await axios.post('/loan', loanRequest)

		console.log(res.data)
		loanRequest = res.data
		loan.value = res.data

		let test = loanRequest
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
			price: price.value,
		}
		chatData.value?.messages.push(loanRequestMessage)
	} catch (error) {
		//TODO add error
	}
}

async function sendLoanAccept() {
	if (!stompClient.value) return
	if (!chat.value?.itemId || !loan.value?.loanId) return

	let loanRequest: Loan = {
		active: true,
		chatId: loan.value?.chatId,
		creationDate: new Date().toISOString(),
		end: new Date().toISOString(),
		loanId: loan.value?.loanId,
		returned: loanStatus.value === 'RETURNED',
		start: new Date().toISOString(),
		price: price.value,
	}
	console.log(loanRequest)
	try {
		const res = await axios.put('/loan', loanRequest)

		console.log(res.data)

		stompClient.value.send(
			'/app/chat/acceptLoan',
			JSON.stringify(loanRequest)
		)

		console.log(chat.value?.itemId, loan.value?.loanId)
		if (loanStatus.value !== 'RETURNED') loanStatus.value = 'ACCEPTED'

		loanPending.value = true
	} catch (error) {
		//TODO add error
	}
}

async function sendLoanCounterOffer() {}

async function sendLoanDecline() {
	if (!stompClient.value) return
	if (!chat.value?.chatId) return
	try {
		const res = axios.delete('/loan?loanId=' + loan.value?.loanId)

		let loanAnswer: Loan = {
			chatId: chat.value?.chatId,
			item: chat.value?.itemId,
			active: false,
			returned: false,
			start: new Date().toISOString(),
			end: new Date().toISOString(),
			price: 0,
		}

		stompClient.value.send(
			'/app/chat/acceptLoan',
			JSON.stringify(loanAnswer)
		)
	} catch (error) {
		//TODO add error
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
		price: accept.price,
	}

	if (msg.senderId != chatData.value?.userId) {
		//If loan is accepted
		if (msg.active && !msg.returned) {
			console.log('Loan accepted')
			loanStatus.value = 'ACCEPTED'
		}

		//If loan is denied
		console.log(msg.active, msg.returned)
		if (!msg.active && !msg.returned) {
			console.log('Loan denied')
			loanStatus.value = 'NOT_SENT'
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
		price: request.price,
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
				price: request.price,
			}
		}
		loanPending.value = true
		loanStatus.value = 'PENDING'
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
	loanStatus.value = 'UNDEFINED'
	try {
		const res = await axios.get('/chat?chatId=' + route.params.id)
		chat.value = res.data
	} catch (error) {
		//TODO add error
		alert(error)
	}

	try {
		const res = await axios.get('/message?chatId=' + chat.value?.chatId)
		chatData.value = res.data
		chatData.value?.messages.forEach(m => {
			m.receive = m.senderId != chatData.value?.userId
			m.type = 'CHAT'
		})
		chatData.value?.messages.reverse()
	} catch (error) {
		alert(error)
	}

	try {
		if (!chat.value?.itemId) return
		const res = await axios.get('/item', {
			params: {
				id: chat.value?.itemId,
			},
		})

		item.value = res.data.item
		lender.value = res.data.lender
	} catch (error) {}

	try {
		const res = await axios.get('/loan/chat?chatId=' + chat.value?.chatId)
		user.value = res.data.user
		console.log(res.data)

		if (chat.value?.chatId) {
			loan.value = {
				chatId: chat.value?.chatId,
				start: res.data.loan.startDate,
				end: res.data.loan.endDate,
				loanId: res.data.loan.loanId,
				active: res.data.loan.active,
				returned: res.data.loan.returned,
				creationDate: res.data.value?.creationDate,
				price: res.data.loan.price,
			}
		}

		if (loan.value) {
			let msg: MessageDTO = {
				senderId: res.data.user.userId.toString(),
				type: 'REQUEST',
				receive:
					res.data.user.userId.toString() != chatData.value?.userId,
				start: res.data.loan.startDate,
				stop: res.data.loan.endDate,
				date: res.data.value?.creationDate,
				returned: loan.value?.returned,
				active: loan.value?.active,
				price: loan.value?.price,
			}

			if (msg.active && !msg.returned) msg.type = 'ACCEPT'
			if (msg.active && msg.returned) msg.type = 'RETURNED'
			chatData.value?.messages.push(msg)
			//Sorts chat by date
			console.log(loan.value)
			/*
      Not working
      chatData.value?.messages.sort(function (a, b) {
				if (a.date && b.date)
					return a.date > b.date ? -1 : a.date < b.date ? 1 : 0

				return -1
			})
       */
			console.log(chatData.value?.messages)
			loanPending.value = true
			loanStatus.value = 'PENDING'
			if (loan.value?.active) loanStatus.value = 'ACCEPTED'
			if (loan.value?.returned && loan.value?.active)
				loanStatus.value = 'RETURNED'
		}
	} catch (error) {
		loanPending.value = false
		loanStatus.value = 'NOT_SENT'
	}

	await connect()
	await reRenderChat()
})

function sendLoanReturned() {
	loanStatus.value = 'RETURNED'
	sendLoanAccept()
}

function sendLoanRequest() {
	showLoginModal.value = !showLoginModal.value
	if (!range.value) return
	//TODO: add checks if from date is later than to etc
	sendLoanRequestWS()
	loanPending.value = true
}
function handleLoanRequest() {
	if (loanStatus.value === 'ACCEPTED') {
		console.log('Loaned')
		sendLoanAccept()
	} else if (loanStatus.value === 'DECLINED') {
		loanPending.value = false
		sendLoanDecline()
	} else if (loanStatus.value === 'COUNTER') {
	}
}

function toggleShowRating() {
	showRateUserPopup.value = true
}

const item = ref<Item>()
const user = ref<User>()
const lender = ref<User>()
const loan = ref<Loan>()

const loanStatus = ref<loanStatusCode>('UNDEFINED')
const currentMessage = ref<string>('')
const loanPending = ref(false)
const chatData = ref<Message>()
const chat = ref<Chat>()

const showLoginModal = ref(false)

interface LoanRangePrice {
	start: Date
	end: Date
}
const range = ref<LoanRangePrice>()
const render = ref<number>(0)
const showRateUserPopup = ref<boolean>(false)
const price = ref<number>(0)
function reRenderChat() {
	render.value++
}
</script>
<template>
	<div class="h-96 flex-col w-full">
		<div class="flex gap-2">
			<RouterLink class="place-sel" to="/chats"> Back </RouterLink>
			<img class="w-12 rounded" v-if="item" :src="item.images[0]" />
			<h1 class="text-center text-4xl" v-if="item?.name">
				{{ item.name }}
				{{ item.price }}kr / {{ item.priceUnit }}
			</h1>
			<h1 class="text-center text-4xl" v-else>Chat</h1>
		</div>

		<MessageContainer
			class="grow"
			v-if="chatData && chat && item"
			:chatData="chatData"
			:chat="chat"
			:key="render"
			:item="item"
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
					v-if="
						lender?.id != store.state.user?.id &&
						loanStatus === 'NOT_SENT'
					"
					class="grow bg-green-600"
					:disabled="loanPending || loanStatus === 'PENDING'"
					data-testid="rent-button"
					@click="showLoginModal = true"
					>Forespør</BaseBtn
				>
				<BaseBtn
					v-if="loanStatus === 'RETURNED'"
					@click="toggleShowRating"
					data-testid="feedback-button"
					class="grow bg-purple-500"
					>Gi tilbakemelding</BaseBtn
				>
				<BaseBtn
					v-if="
						lender?.id === store.state.user?.id &&
						loanStatus === 'ACCEPTED'
					"
					@click="sendLoanReturned"
					data-testid="feedback-button"
					class="grow bg-purple-500"
					>Levert tilbake</BaseBtn
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
		<BaseInput v-model="price"></BaseInput>
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
