<script setup lang="ts">
import { FriendChat } from '../api/schema'
import Card from '../components/Card.vue'

interface Props {
	friendChat: FriendChat
	to?: string
}
const { friendChat } = defineProps<Props>()
</script>

<template>
	<div class="grid gap-4">
		<router-link v-if="to" :to="'/community/chat/' + friendChat.chatId">
			<Card>
				<div class="flex gap-4 w-full">
					<div class="grid grid-cols-2 w-16 h-16 gap-2 min-w-[64px]">
						<img
							v-for="user in friendChat.members.slice(0, 4)"
							class="rounded-full object-cover"
							:src="user.profilePicture"
						/>
					</div>
					<div class="grid gap-2">
						<p class="font-bold text-lg">
							{{ friendChat.chatName }}
						</p>
						<div class="flex gap-2 flex-wrap">
							<p
								v-for="member in friendChat.members"
								class="text-slate-500"
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
				<div class="flex gap-4 w-full">
					<div class="grid grid-cols-2 w-16 h-16 gap-2 min-w-[64px]">
						<img
							v-for="user in friendChat.members.slice(0, 4)"
							class="rounded-full object-cover"
							:src="user.profilePicture"
						/>
					</div>
					<div class="grid gap-2">
						<p class="font-bold text-lg">
							{{ friendChat.chatName }}
						</p>
						<div class="flex gap-2 flex-wrap">
							<p
								v-for="member in friendChat.members"
								class="text-slate-500"
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
