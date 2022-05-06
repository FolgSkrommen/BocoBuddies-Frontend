<script setup lang="ts">
import {
	computed,
	onMounted,
	onRenderTracked,
	onRenderTriggered,
	PropType,
	ref,
} from 'vue'
import Message from './Message.vue'
import BaseBtn from '../base/BaseBtn.vue'
import { Message as MessageInterface } from '../../api/schema'
import { User as User } from '../../api/schema'

interface Props {
	messages: MessageInterface[]
	users: User[]
}
//DO NOT REMOVE NEEDED FOR REFRESHING CHAT (TO ALWAY BE AT BOTTOM)
onMounted(() => {
	var myDiv = document.getElementById('box')
	if (myDiv) myDiv.scrollTop = myDiv.scrollHeight
})

const { messages, users } = defineProps<Props>()

function styleType(received: boolean) {
	switch (received) {
		case true:
			return 'bg-slate-400 text-black '
		case false:
			return 'bg-blue-500 text-white justify-self-end'
		default:
			return 'bg-blue-500 text-white'
	}
}

function getProperDateTime(dateTime: string) {
	let time = dateTime.substring(11, 16)
	let date = dateTime.substring(0, 10)
	if (new Date().toISOString().substring(0, 10) === date) return time
	return date
}

function isValidHttpUrl(string: string) {
	let url

	try {
		url = new URL(string)
	} catch (_) {
		return false
	}

	return url.protocol === 'http:' || url.protocol === 'https:'
}

function getProfilePicture(id: number) {
	let user: User = {
		userId: 0,
		firstName: '',
		lastName: '',
		username: '',
		verified: false,
		trusted: false,
		rating: 0,
	}
	if (!users) return ''
	users.forEach(u => {
		if (u.userId === id) user = u
	})
	return user.profilePicture
}

function getUserName(id: number) {
	return users.find(u => u.userId === id)?.username ?? ''
}

function messagePlacement(receive: boolean) {
	switch (receive) {
		case true:
			return 'place-self-start'
		case false:
			return 'place-self-end'
		default:
			return 'place-self-end'
	}
}
</script>
<template>
	<div
		class="border bg-slate-200 px-2 my-2 py-3 w-full h-full overflow-auto"
		id="box"
		data-testid="chat"
	>
		<div class="grid" v-for="(message, i) in messages">
			<div
				class="flex my-2 gap-1"
				:class="messagePlacement(message.receive)"
				data-testid="message-info"
			>
				<img
					v-if="message.senderId && message.receive"
					class="rounded-full object-cover w-6 h-6 self-end"
					:src="getProfilePicture(message.senderId)"
					:alt="getUserName(message.senderId)"
				/>
				<div class="flex flex-col text-center">
					<p v-if="message.date" class="text-xs">
						{{ getProperDateTime(message.date) }}
					</p>
					<Message
						v-if="message.type === 'CHAT'"
						:id="i"
						:receive="!message.receive"
					>
						<a
							v-if="
								message.message &&
								isValidHttpUrl(message.message)
							"
							:href="message.message"
							class="text-decoration-line: underline white"
						>
							<div data-testid="message">
								{{ message.message }}
							</div>
						</a>
						<div data-testid="message" v-else>
							{{ message.message }}
						</div>
					</Message>
				</div>
			</div>
		</div>
	</div>
</template>
