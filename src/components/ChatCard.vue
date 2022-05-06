<script setup lang="ts">
import { computed } from 'vue'
import { FriendChat } from '../api/schema'
import Card from '../components/Card.vue'
import { store } from '../store'

interface Props {
	friendChat: FriendChat
	to?: string
}
const { friendChat } = defineProps<Props>()

const chatName = computed(() => {
	const nameArray = friendChat.chatName.split('|', 2)
	let chatName = 'Default'
	if (nameArray.length != 2 || !store.state.user)
		return (chatName = friendChat.chatName)
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
	<div class="grid gap-4">
		<router-link v-if="to" :to="'/community/chat/' + friendChat.chatId">
			<Card>
				<div class="flex gap-4 w-full p-2 h-fit place-items-end">
					<div
						v-if="friendChat.members.length > 1"
						class="grid grid-cols-2 w-16 h-16 gap-2 min-w-[64px]"
					>
						<img
							v-for="user in friendChat.members.slice(0, 4)"
							class="rounded-full object-cover w-7 h-7"
							:src="user.profilePicture"
							:alt="user.username"
						/>
					</div>
					<img
						class="w-16 h-16 rounded-full object-cover"
						:src="friendChat.members[0].profilePicture"
						:alt="friendChat.chatName"
						v-else
					/>
					<div class="grid gap-2">
						<p class="font-bold text-lg">
							{{ chatName }}
						</p>
						<div class="flex gap-2 flex-wrap">
							<p
								v-for="member in friendChat.members"
								class="text-slate-600"
							>
								{{ member.firstName }}
							</p>
						</div>
					</div>
					<span class="flex-grow"></span>
					<slot></slot>
				</div>
			</Card>
		</router-link>
		<div v-else>
			<Card>
				<div class="flex gap-4 w-full p-2">
					<div class="grid grid-cols-2 w-16 h-16 gap-2 min-w-[64px]">
						<img
							v-for="user in friendChat.members.slice(0, 4)"
							class="rounded-full object-cover"
							:src="user.profilePicture"
							:alt="user.username"
						/>
					</div>
					<div class="grid gap-2">
						<p class="font-bold text-lg">
							{{ friendChat.chatName }}
						</p>
						<div class="flex gap-2 flex-wrap">
							<p
								v-for="member in friendChat.members"
								class="text-slate-600"
							>
								{{ member.firstName }}
							</p>
						</div>
					</div>
					<span class="flex-grow"></span>
					<slot></slot>
				</div>
			</Card>
		</div>
	</div>
</template>
