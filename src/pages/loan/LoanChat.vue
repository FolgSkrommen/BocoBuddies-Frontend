<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { store } from '../../store'
import MessageContainer from '../../components/chat/MessageContainerLoan.vue'
import BaseInput from '../../components/base/BaseInput.vue'
import { DatePicker } from 'v-calendar'
import 'v-calendar/dist/style.css'
import BaseBtn from '../../components/base/BaseBtn.vue'

import { ChevronLeftIcon } from '@heroicons/vue/outline'

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
import RateUserPopup from '../../components/RateUserPopup.vue'
import LoadingIndicator from '../../components/base/LoadingIndicator.vue'

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
	const ip = axios.defaults.baseURL?.split('//')[1]
	console.log(ip)
	socket = new WebSocket('ws://' + ip + '/ws')
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

	let chatMessage: Message = {
		senderId: store.state.user.userId,
		message: currentMessage.value,
		type: 'CHAT',
		date: getDateAndTime(),
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
	if (!event) return
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
		item: chat.value.item.itemId,
		loaner: store.state.user.userId,
		start: range.value.start.toISOString(),
		end: range.value.end.toISOString(),
		price: price.value,
		active: false,
		returned: false,
		creationDate: getDateAndTime(),
	}
	try {
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
			date: res.data.date,
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
		creationDate: getDateAndTime(),
		end: loan.value.end,
		start: loan.value.start,
		loanId: loan.value.loanId,
		returned: loanStatus.value === 'RETURNED',
		price: price.value,
		loaner: store.state.user.userId,
		itemId: loan.value.itemId,
	}
	console.log('HERE!!!')

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
			start: loan.value ? loan.value.start : '',
			end: loan.value ? loan.value.end : '',
			price: 0,
			loaner: store.state.user.userId,
			creationDate: getDateAndTime(),
		}

		stompClient.value.send(
			'/app/chat/acceptLoan',
			JSON.stringify(loanAnswer)
		)
		messages.value = messages.value.filter(({ type }) => type !== 'REQUEST')
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

	console.log(accept)
	let msg: Message = {
		senderId: accept.loaner,
		type: 'ACCEPT',
		receive: true,
		date: accept.date,
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
		if (msg.active && msg.returned) {
			console.log(messages.value)

			loanStatus.value = 'RETURNED'
			await getLoan(false)
			loanStatus.value = 'RETURNED'
			console.log(msg)

			console.log(messages.value)
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
		date: request.date,
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
	console.log(payload)
	console.log(payload.body)
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
		if (!chat.value?.members || !store.state.user) return
		user.value = chat.value?.members[0]
		if (chat.value?.members[0].userId === store.state.user.userId)
			user.value = chat.value?.members[1]

		console.log(chat.value?.item)
	} catch (error: any) {
		status.value = 'error'
		await store.dispatch('error', error.message)
	}

	try {
		console.log('/message?chatId=' + chat.value?.chatId)
		const res = await axios.get('/message?chatId=' + chat.value?.chatId)
		const data = res.data as GetMessageResponse
		console.log(res.data)
		messages.value = data.messages
		messages.value.forEach(m => {
			if (!store.state.user) return
			m.receive = m.senderId != store.state.user.userId
			m.type = 'CHAT'
		})
		messages.value.reverse()
	} catch (error: any) {
		status.value = 'error'
		await store.dispatch('error', error.message)
	}
	console.log(messages.value)
	try {
		if (!chat.value?.item) return
		const res = await axios.get('/item', {
			params: {
				itemId: chat.value.item.itemId,
			},
		})
		console.log(res.data)
		item.value = res.data.item
		if (item.value) price.value = item.value.price
		lender.value = res.data.lender
	} catch (error: any) {
		status.value = 'error'
		await store.dispatch('error', error.message)
	}
	console.log(messages.value)
	await getLoan(true)
	console.log(messages.value)
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
	console.log(messages.value)
	await reRenderChat()
	console.log(messages.value)
	status.value = 'loaded'
})

async function getLoan(doPush: boolean) {
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
			console.log(messages.value)
			if (doPush) messages.value.push(msg)
			console.log(messages.value)
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
}

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

function getUserToReviewCheck() {
	if (!store.state.user) return false
	if (!user.value) return false
}

function getUserToReview() {
	if (!store.state.user) return

	if (!user.value && lender.value?.userId !== store.state.user.userId)
		return lender.value
	if (!user.value) return

	if (store.state.user.userId === user.value.userId) {
		return lender.value
	} else {
		return user.value
	}
}

function userReviewed() {
	loanStatus.value = 'REVIEWED'
	showRateUserPopup.value = false
}

function getPriceUnit(unit: string) {
	if (unit === 'DAY') return 'Dag'
	if (unit === 'HOUR') return 'Time'
	if (unit === 'MONTH') return 'Måned'
	if (unit === 'WEEK') return 'Uke'
	if (unit === 'YEAR') return 'År'
}

function getDateAndTime() {
	let tzoffset = new Date().getTimezoneOffset() * 60000 //offset in milliseconds
	return new Date(Date.now() - tzoffset).toISOString().slice(0, -1)
}

function cookie() {
	const seenChatCookie = ('; ' + document.cookie)
		.split(`; seenChatTutorial=`)
		.pop()
		?.split(';')[0]

	if (!seenChatCookie?.includes('true')) {
		store.dispatch(
			'info',
			'Hei. Dette er plattformen for å låne en gjenstand. Den som vil låne må forespørre et lån. Her setter hen pris og tidsrom for lånet' +
				'. Dette må bli godkjent av den som låner ut, før lånet er bindende. Hvis noe er uklart les FAQ'
		)
		document.cookie = 'seenChatTutorial=true; max-age=31536000'
	}
}
cookie()

let seenTutorial = ref<boolean>(false)
const item = ref<Item>()
const user = ref<User>()
const lender = ref<User>()
const loan = ref<Loan>()
const status = ref<Status>('loading')
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
	<LoadingIndicator v-if="status === 'loading'" data-testid="loading" />
	<div class="h-[70vh] flex-col w-full chatHeight" v-else>
		<RateUserPopup
			v-if="lender && loan && getUserToReview() !== undefined"
			v-show="showRateUserPopup"
			@exit="showRateUserPopup = false"
			:user="getUserToReview()"
			:loan="loan"
			@confirm="userReviewed()"
		></RateUserPopup>

		<div class="flex justify-between items-center gap-5">
			<div class="flex gap-4">
				<router-link
					to="/chats"
					data-bs-toggle="tooltip"
					data-bs-placement="bottom"
					title="Tilbake til lånesamtaler"
				>
					<ChevronLeftIcon class="h-12 w-12" />
				</router-link>
				<router-link
					v-if="item"
					:to="'/item/' + item.itemId"
					class="flex gap-4"
				>
					<img
						class="w-12 h-12 object-cover rounded"
						v-if="item"
						:src="item.images[0]"
						:alt="item.name"
					/>
					<div v-if="item">
						<p class="font-bold">{{ item.name }}</p>
						{{ item.price }}kr / {{ getPriceUnit(item.priceUnit) }}
					</div>
				</router-link>
			</div>

			<router-link
				class="flex gap-1 content-center"
				:to="'/user/' + getUserToReview()?.userId"
			>
				<h4 class="flex-1 truncate text-right">
					{{ getUserToReview()?.firstName }}<br />
					{{ getUserToReview()?.lastName }}
				</h4>

				<img
					class="w-12 h-12 object-cover rounded self-center"
					v-if="item"
					:src="getUserToReview()?.profilePicture"
					:alt="
						getUserToReview()?.firstName +
						' ' +
						getUserToReview()?.lastName
					"
				/>
			</router-link>
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
			<div class="flex gap-4 content-center min-h-fit">
				<base-input
					class="grow"
					v-model="currentMessage"
					data-testid="message-input"
					placeholder="Aa"
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
						(loanStatus === 'PENDING' || loanStatus === 'NOT_SENT')
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
					class="grow"
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
	</div>

	<BasePopup
		@exit="showLoginModal = false"
		v-if="
			chat &&
			chat.item &&
			chat.item.availableFrom &&
			chat.item.availableTo &&
			showLoginModal
		"
		data-testid="base-popup"
		class="overflow-y-auto max-h-screen"
	>
		<DatePicker
			v-if="chat.item"
			class="place-self-center"
			v-model="range"
			mode="dateTime"
			is-range
			locale="no"
			is24hr
			:min-date="
				new Date(chat.item.availableFrom) < new Date(getDateAndTime())
					? new Date(getDateAndTime())
					: new Date(chat.item.availableFrom)
			"
			:max-date="new Date(chat.item.availableTo)"
		/>
		<BaseLabel
			v-if="item && item.price"
			:modelValue="
				'(Pris satt av utleier: ' +
				item.price +
				' / ' +
				getPriceUnit(item.priceUnit) +
				')'
			"
		></BaseLabel>
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
<style scoped>
.chatHeight {
	height: calc(100vh - 280px);
}
</style>
