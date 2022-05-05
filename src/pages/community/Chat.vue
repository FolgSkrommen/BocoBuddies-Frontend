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
import { ChevronLeftIcon } from '@heroicons/vue/outline'

import Stomp, { Client } from 'webstomp-client'
import { useRoute } from 'vue-router'
import axios from 'axios'
import BasePopup from '../../components/base/BasePopup.vue'
import RateUserPopup from '../../components/RateUserPopup.vue'
import LoadingIndicator from '../../components/base/LoadingIndicator.vue'
const route = useRoute()

const messages = ref<Message[]>([])

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
	console.log(message.date)
	let msg: Message = {
		senderId: message.senderId,
		message: message.message,
		type: 'CHAT',
		date: getDateAndTime(),
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
	status.value = 'loaded'
}

function getDateAndTime() {
	let tzoffset = new Date().getTimezoneOffset() * 60000 //offset in milliseconds
	return new Date(Date.now() - tzoffset).toISOString().slice(0, -1)
}

async function updateChatName() {}

/**
 * Fetches data before view is mounted
 */
onBeforeMount(async () => {
	try {
		const res = await axios.get('/chat/community', {
			params: {
				chatId: route.params.id,
			},
		})
		console.log(res.data)
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
	status.value = 'loaded'
})

const user = ref<User>()
const currentMessage = ref<string>('')
const chat = ref<FriendChat>()
const showLoginModal = ref(false)
const render = ref<number>(0)
const status = ref<Status>('loading')
type Status = 'loading' | 'loaded' | 'error'

function reRenderChat() {
	render.value++
}
const chatName = computed(() => {
	const nameArray = chat.value?.chatName.split('|', 2)
	let chatName = 'Default'
	if (nameArray?.length != 2 || !store.state.user) return chat.value?.chatName
	if (
		nameArray[0] === store.state.user.username &&
		nameArray[1] !== store.state.user.username
	)
		chatName = nameArray[1]
	if (
		nameArray[1] === store.state.user.username &&
		nameArray[0] !== store.state.user.username
	)
		chatName = nameArray[0]
	return chatName
})
</script>
<template>
	<LoadingIndicator v-if="status === 'loading'" data-testid="loading" />
	<div class="h-96 flex-col w-full chatHeight" v-else>
		<div class="flex gap-2">
			<router-link class="place-sel" to="/community">
				<ChevronLeftIcon class="h-12 w-12" />
			</router-link>
			<h1 v-if="chat && chat.chatName">{{ chatName }}</h1>
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
<style scoped>
.chatHeight {
	height: calc(100vh - 200px);
}
</style>
