<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { store } from '../../store'
import MessageContainer from '../../components/chat/MessageContainerLoan.vue'
import BaseInput from '../../components/base/BaseInput.vue'
import { DatePicker } from 'v-calendar'
import 'v-calendar/dist/style.css'
import BaseBtn from '../../components/base/BaseBtn.vue'

import Stomp, { Client } from 'webstomp-client'
import { useRoute } from 'vue-router'
import axios from 'axios'
import BasePopup from '../../components/base/BasePopup.vue'
import { Chat, Item, Loan, Message, User } from '../../api/schema'
import {
	PostLoanRequest,
	PostLoanResponse,
	PutLoanRequest,
} from '../../api/loan'
import { GetChatResponse } from '../../api/chat'
import { GetMessageResponse } from '../../api/message'
import BaseLabel from '../../components/base/BaseLabel.vue'
import BaseBanner from '../../components/base/BaseBanner.vue'
import RateUserPopup from '../../components/RateUserPopup.vue'
import UserCard from '../../components/UserCard.vue'

const route = useRoute()

type loanStatusCode =
	| 'PENDING'
	| 'ACCEPTED'
	| 'DECLINED'
	| 'COUNTER'
	| 'NOT_SENT'
	| 'RETURNED'
	| 'UNDEFINED'
	| 'REVIEWED'

//WEBSOCKET
const stompClient = ref<Client>()
let socket: any
function connect() {
	socket = new WebSocket('ws://localhost:8001/ws')
	stompClient.value = Stomp.over(socket)
	stompClient.value.connect({}, onConnected, onError)
}
const messages = ref<Message[]>([])
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
	if (!stompClient.value || !store.state.user || !chat.value) return
	console.log(!stompClient.value || !store.state.user || !chat.value)
	let chatMessage: Message = {
		senderId: store.state.user.userId,
		message: currentMessage.value,
		type: 'CHAT',
		date: new Date().toISOString(),
		receive: false,
		chatId: chat.value.chatId,
	}
	try {
		const data = axios.post('/message', chatMessage)

		stompClient.value.send(
			'/app/chat/sendMessage',
			JSON.stringify(chatMessage)
		)

		messages.value.push(chatMessage)
	} catch (error: any) {
		status.value = 'error'
		store.dispatch('error', error.message)
	}
	currentMessage.value = ''

	event.preventDefault()
}

/**
 * When sending request via WS
 */
async function sendLoanRequestWS() {
	console.log(range.value)
	if (
		!stompClient.value ||
		!store.state.user ||
		!chat.value?.chatId ||
		!range.value ||
		!chat.value.item
	)
		return

	const body: PostLoanRequest = {
		chatId: chat.value.chatId,
		itemId: chat.value.item.itemId,
		loaner: store.state.user.userId,
		start: range.value.start.toISOString(),
		end: range.value.end.toISOString(),
		price: price.value,
		active: false,
		returned: false,
		creationDate: new Date().toISOString(),
	}
	try {
		console.log(body)
		const res = await axios.post('/loan', body)
		loan.value = res.data as PostLoanResponse
		body.loanId = loan.value.loanId
		stompClient.value.send(
			'/app/chat/sendLoanRequest',
			JSON.stringify(body)
		)

		let loanRequestMessage: Message = {
			type: 'REQUEST',
			receive: false,
			senderId: res.data.loaner.toString(),
			start: range.value.start.toISOString(),
			stop: range.value.end.toISOString(),
			price: price.value,
		}
		messages.value.push(loanRequestMessage)
	} catch (error: any) {
		status.value = 'error'
		store.dispatch('error', error.message)
	}
}

async function sendLoanAccept() {
	if (
		!stompClient.value ||
		!chat.value ||
		!loan.value ||
		!store.state.user ||
		!chat.value.item
	)
		return

	let loanRequest: PutLoanRequest = {
		active: true,
		chatId: loan.value?.chatId,
		creationDate: new Date().toISOString(),
		end: new Date().toISOString(),
		start: new Date().toISOString(),
		loanId: loan.value.loanId,
		returned: loanStatus.value === 'RETURNED',
		price: price.value,
		loaner: store.state.user.userId,
		itemId: loan.value.itemId,
	}
	console.log(loanRequest)
	try {
		const res = await axios.put('/loan', loanRequest)

		console.log(res.data)

		stompClient.value.send(
			'/app/chat/acceptLoan',
			JSON.stringify(loanRequest)
		)
		console.log(chat.value.item.itemId, loan.value?.loanId)
		if (loanStatus.value !== 'RETURNED') loanStatus.value = 'ACCEPTED'

		loanPending.value = true
	} catch (error: any) {
		status.value = 'error'
		store.dispatch('error', error.message)
	}
}

async function sendLoanDecline() {
	if (
		!stompClient.value ||
		!chat.value ||
		!store.state.user ||
		!chat.value.item
	)
		return
	try {
		const res = axios.delete('/loan?loanId=' + loan.value?.loanId)

		let loanAnswer: Loan = {
			chatId: chat.value.chatId,
			itemId: chat.value.item.itemId,
			active: false,
			returned: false,
			start: new Date().toISOString(),
			end: new Date().toISOString(),
			price: 0,
			loaner: store.state.user.userId,
			creationDate: new Date().toISOString(),
		}

		stompClient.value.send(
			'/app/chat/acceptLoan',
			JSON.stringify(loanAnswer)
		)
	} catch (error: any) {
		status.value = 'error'
		store.dispatch('error', error.message)
	}
}

/**
 * Called when loan accepted
 * @param payload
 */
async function onLoanAccept(payload: any) {
	if (!store.state.user) return

	console.log(payload)
	let accept = JSON.parse(payload.body)

	let msg: Message = {
		senderId: accept.loaner,
		type: 'ACCEPT',
		receive: true,
		start: accept.start,
		stop: accept.end,
		returned: accept.returned,
		active: accept.active,
		price: accept.price,
	}

	if (msg.senderId != store.state.user.userId) {
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
			messages.value = messages.value.filter(
				({ type }) => type !== 'REQUEST'
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
	let request = JSON.parse(payload.body)
	if (!store.state.user || !chat.value || !chat.value.item) return

	let msg: Message = {
		senderId: request.loaner,
		type: 'REQUEST',
		receive: true,
		start: request.start,
		stop: request.end,
		returned: request.returned,
		active: request.active,
		price: request.price,
	}

	//Adds the received request to message array if receiver is not sender
	if (msg.senderId != store.state.user.userId) {
		console.log('LOOK HERE: ' + msg)
		if (loan.value) {
			console.log(request.loanId)
			loan.value.loanId = request.loanId
			loan.value.loaner = request.loaner
			loan.value.start = request.start
			loan.value.end = request.end
			loan.value.returned = request.returned
			loan.value.active = request.active
		} else if (chat.value.chatId) {
			loan.value = {
				chatId: chat.value.chatId,
				start: request.start,
				end: request.end,
				loanId: request.loanId,
				active: request.active,
				returned: request.returned,
				price: request.price,
				creationDate: request.creationDate,
				itemId: chat.value.item.itemId,
				loaner: request.loaner,
			}
		}
		loanPending.value = true
		loanStatus.value = 'PENDING'
		messages.value.push(msg)
	}
	reRenderChat()
}

/**
 * When receiving a message
 * @param payload
 */
function onMessageReceived(payload: any) {
	if (!store.state.user) return

	let message = JSON.parse(payload.body)

	let msg: Message = {
		senderId: message.senderId,
		message: message.message,
		type: 'CHAT',
		date: message.date,
		receive: true,
		chatId: chat.value?.chatId,
	}
	if (msg.senderId != store.state.user.userId) {
		messages.value.push(msg)
	} else {
		console.log(msg.senderId)
		console.log(store.state.user.userId)
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
		chat.value = res.data as GetChatResponse
	} catch (error: any) {
		status.value = 'error'
		store.dispatch('error', error.message)
	}

	try {
		console.log('/message?chatId=' + chat.value?.chatId)
		const res = await axios.get('/message?chatId=' + chat.value?.chatId)
		const data = res.data as GetMessageResponse
		messages.value = data.messages
		messages.value.forEach(m => {
			if (!store.state.user) return
			m.receive = m.senderId != store.state.user.userId
			m.type = 'CHAT'
		})
		messages.value.reverse()
	} catch (error: any) {
		status.value = 'error'
		store.dispatch('error', error.message)
	}

	try {
		if (!chat.value?.item) return
		const res = await axios.get('/item', {
			params: {
				itemId: chat.value.item.itemId,
			},
		})

		item.value = res.data.item
		lender.value = res.data.lender
	} catch (error: any) {
		status.value = 'error'
		store.dispatch('error', error.message)
	}

	try {
		const res = await axios.get('/loan/chat?chatId=' + chat.value?.chatId)
		user.value = res.data.user
		console.log(res.data)
		if (!chat.value || !chat.value.item) return

		if (chat.value) {
			loan.value = {
				chatId: chat.value.chatId,
				start: res.data.loan.start,
				end: res.data.loan.end,
				loanId: res.data.loan.loanId,
				active: res.data.loan.active,
				returned: res.data.loan.returned,
				creationDate: res.data.value?.creationDate,
				price: res.data.loan.price,
				itemId: chat.value.item.itemId,
				loaner: res.data.loan.loaner,
			}
		}

		if (loan.value && store.state.user) {
			let msg: Message = {
				senderId: res.data.user.userId.toString(),
				type: 'REQUEST',
				receive:
					res.data.user.userId.toString() != store.state.user.userId,
				start: res.data.loan.start,
				stop: res.data.loan.end,
				date: res.data.value?.creationDate,
				returned: loan.value?.returned,
				active: loan.value?.active,
				price: loan.value?.price,
			}

			if (msg.active && !msg.returned) msg.type = 'ACCEPT'
			if (msg.active && msg.returned) msg.type = 'RETURNED'
			messages.value.push(msg)
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

	if (loan.value?.returned) {
		try {
			console.log('Here')
			const res = await axios.get('/review/hasReviewed', {
				params: {
					loanId: loan.value?.loanId,
				},
			})
			console.log(res.data)
			hasReviewed.value = res.data
		} catch (error) {}
	}

	await connect()
	await reRenderChat()
})

function sendLoanReturned() {
	loanStatus.value = 'RETURNED'
	sendLoanAccept()
}

function sendLoanRequest() {
	if (!range.value) return
	if (range.value?.end < range.value?.start) {
		status.value = 'error'
		store.dispatch('error', 'Sluttdato kan ikke vær før startdato')
		return
	}

	if (price.value < 0) {
		status.value = 'error'
		store.dispatch('error', 'Pris kan ikke være negativ')
		return
	}

	if (!item.value) return

	if (
		range.value?.end.toISOString() > item.value?.availableTo ||
		range.value?.end.toISOString() < item.value?.availableFrom
	) {
		status.value = 'error'
		store.dispatch('error', 'Hold sluttdato innenfor oppgitt intervall')
		return
	}

	if (
		range.value?.start.toISOString() < item.value?.availableFrom ||
		range.value?.start.toISOString() > item.value?.availableTo
	) {
		status.value = 'error'
		store.dispatch('error', 'Hold startdato innenfor oppgitt intervall')
		return
	}

	showLoginModal.value = !showLoginModal.value
	//TODO: add checks if from date is later than to etc
	try {
		sendLoanRequestWS()
		loanPending.value = true
	} catch (error: any) {
		status.value = 'error'
		store.dispatch('error', error.message)
	}
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

function getUserToReview() {
	if (!store.state.user) return
	if (store.state.user.userId === user.value?.userId) {
		return lender.value
	} else {
		return user.value
	}
}

function userReviewed() {
	loanStatus.value = 'REVIEWED'
	showRateUserPopup.value = false
}

const item = ref<Item>()
const user = ref<User>()
const lender = ref<User>()
const loan = ref<Loan>()
const status = ref<Status>()
type Status = 'loading' | 'loaded' | 'error'
const loanStatus = ref<loanStatusCode>('UNDEFINED')
const currentMessage = ref<string>('')
const loanPending = ref(false)
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
const hasReviewed = ref<boolean>(false)
console.log(lender)
function reRenderChat() {
	render.value++
}
</script>
<template>
	<div class="h-96 flex-col w-full">
		<RateUserPopup
			v-if="lender && loan && getUserToReview()"
			v-show="showRateUserPopup"
			@exit="showRateUserPopup = false"
			:user="getUserToReview()"
			:loan="loan"
			@confirm="userReviewed()"
		></RateUserPopup>

		<div class="flex gap-2">
			<router-link class="place-sel" to="/chats"> Back </router-link>
			<img class="w-12 rounded" v-if="item" :src="item.images[0]" />
			<h1 v-if="item?.name">
				{{ item.name }}
				{{ item.price }}kr / {{ item.priceUnit }}
			</h1>
			<h1 v-else>Chat</h1>
		</div>

		<MessageContainer
			class="grow"
			v-if="messages && chat && item"
			:messages="messages"
			:chat="chat"
			:key="render"
			:item="item"
			v-model="loanStatus"
			data-testid="message-container"
			@update:modelValue="handleLoanRequest"
		/>

		<form
			class="my-2"
			v-on:submit.prevent="sendMessage"
			data-testid="message-form"
		>
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
						lender?.userId !== store.state.user?.userId &&
						loanStatus === 'NOT_SENT'
					"
					class="grow bg-green-600"
					:disabled="loanPending || loanStatus !== 'NOT_SENT'"
					data-testid="rent-button"
					@click="showLoginModal = true"
					>Forespør</BaseBtn
				>
				<BaseBtn
					v-if="loanStatus === 'RETURNED' && !hasReviewed"
					@click="toggleShowRating"
					data-testid="feedback-button"
					class="grow bg-purple-500"
					>Gi tilbakemelding</BaseBtn
				>
				<BaseBtn
					v-if="
						lender?.userId === store.state.user?.userId &&
						loanStatus === 'ACCEPTED'
					"
					@click="sendLoanReturned"
					data-testid="feedback-button"
					class="grow bg-purple-500"
					>Levert tilbake?</BaseBtn
				>
			</div>
		</form>

		<UserCard
			v-if="getUserToReview()"
			:user="getUserToReview()"
			color="green"
			show-rating
		/>
	</div>

	<BasePopup
		v-show="showLoginModal"
		@exit="showLoginModal = false"
		data-testid="base-popup"
	>
		<DatePicker
			class="place-self-center"
			v-model="range"
			mode="dateTime"
			is-range
			locale="no"
			is24hr
		/>
		<BaseLabel modelValue="Pris"></BaseLabel>
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
