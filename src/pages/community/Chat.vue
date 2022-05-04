<script setup lang="ts">
import Card from '../../components/Card.vue'
import { computed, onBeforeMount, Ref, ref, watch } from 'vue'
import { store } from '../../store'
import MessageContainer from '../../components/chat/MessageContainer.vue'
import BaseInput from '../../components/base/BaseInput.vue'
import { DatePicker } from 'v-calendar'
import 'v-calendar/dist/style.css'
import BaseBtn from '../../components/base/BaseBtn.vue'
import { Chat, FriendChat, Message, User } from '../../api/schema'

import Stomp, { Client } from 'webstomp-client'
import { useRoute } from 'vue-router'
import axios from 'axios'
import BasePopup from '../../components/base/BasePopup.vue'
import RateUserPopup from '../../components/RateUserPopup.vue'
const route = useRoute()

const messages = ref<Message[]>([])

//WEBSOCKET
const stompClient = ref<Client>()
let socket: any
function connect() {
	socket = new WebSocket('ws://localhost:8001/ws')
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
	console.log(!stompClient.value || !store.state.user || !chat.value)
	console.log(!stompClient.value)
	if (!stompClient.value || !store.state.user || !chat.value) return
	let chatMessage: Message = {
		senderId: store.state.user.userId,
		message: currentMessage.value,
		type: 'CHAT',
		date: new Date().toISOString(),
		receive: false,
		chatId: chat.value.chatId,
	}

	try {
		const res = await axios.post('/message', chatMessage)

		stompClient.value.send(
			'/app/chat/sendMessage',
			JSON.stringify(chatMessage)
		)

		messages.value.push(chatMessage)
	} catch (error) {}

	currentMessage.value = ''
	event.preventDefault()
}

/**
 * When receiving a message
 * @param payload
 */
function onMessageReceived(payload: any) {
	if (!store.state.user || !chat.value) return
	let message = JSON.parse(payload.body)

	let msg: Message = {
		senderId: message.senderId,
		message: message.message,
		type: 'CHAT',
		date: message.date,
		receive: true,
		chatId: chat.value.chatId,
	}
	if (msg.senderId != store.state.user.userId) {
		messages.value.push(msg)
	} else {
		console.log(msg.senderId)
		console.log(store.state.user.userId)
	}
	reRenderChat()
}

async function updateChatName() {}

/**
 * Fetches data before view is mounted
 */
onBeforeMount(async () => {
	try {
		//TODO nytt kall Even
		const res = await axios.get('/chat?chatId=' + route.params.id)
		chat.value = res.data
	} catch (error: any) {
		await store.dispatch('error', error.message)
	}

	try {
		const res = await axios.get('/message?chatId=' + chat.value?.chatId)
		messages.value = res.data.messages
		console.log(messages.value)
		messages.value.forEach(m => {
			if (!store.state.user) return
			m.receive = m.senderId != store.state.user.userId
			m.type = 'CHAT'
		})
		messages.value.reverse()
	} catch (error: any) {
		await store.dispatch('error', error.message)
	}

	connect()
	reRenderChat()
})

const user = ref<User>()
const currentMessage = ref<string>('')
const chat = ref<FriendChat>()
const showLoginModal = ref(false)
const render = ref<number>(0)

function reRenderChat() {
	render.value++
}
</script>
<template>
	<div class="h-96 flex-col w-full">
		<div class="flex gap-2">
			<router-link class="place-sel" to="/community"> Back </router-link>
			<h1 v-if="chat && chat.chatName">{{ chat.chatName }}</h1>
			<h1 v-else>Chat</h1>
			<base-btn>Oppdater navn</base-btn>
			<base-btn>Legg til i chat</base-btn>
		</div>

		<MessageContainer
			class="grow"
			v-if="messages.length >= 0 && chat"
			:messages="messages"
			:users="chat.members"
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
					>Send</base-btn
				>
			</div>
		</form>
	</div>
</template>
