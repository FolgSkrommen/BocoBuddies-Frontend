<script setup lang="ts">
import Card from '../../components/Card.vue'
import { computed, onBeforeMount, Ref, ref, watch } from 'vue'
import { store } from '../../store'
import MessageContainer from '../../components/chat/MessageContainer.vue'
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
}

interface Message {
	userId: string
	messages: Array<MessageDTO>
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
		'/chat/' + groupId + '/message',
		onMessageReceived
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

	await connect()
	reRenderChat()
})

const user = ref<User>()
const currentMessage = ref<string>('')
const chatData = ref<Message>()
const chat = ref<Chat>()
const showLoginModal = ref(false)
const render = ref<number>(0)

function reRenderChat() {
	render.value++
}
</script>
<template>
	<div class="h-96 flex-col w-full">
		<div class="flex gap-2">
			<RouterLink class="place-sel" to="/chats"> Back </RouterLink>
			<h1 class="text-center text-4xl" v-if="chat && chat.chatName">
				{{ chat.chatName }}}
			</h1>
			<h1 class="text-center text-4xl" v-else>Chat</h1>
		</div>

		<MessageContainer
			class="grow"
			v-if="chatData"
			:chatData="chatData"
			:key="render"
			data-testid="message-container"
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
		</form>
	</div>
</template>
