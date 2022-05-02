<script setup lang="ts">
import { ref, watch } from 'vue'
import UserCard from '../components/UserCard.vue'
import LoadingIndicator from '../components/base/LoadingIndicator.vue'
import BaseBanner from '../components/base/BaseBanner.vue'
import axios from 'axios'
import FloatingBtn from '../components/base/FloatingBtn.vue'
import Card from '../components/Card.vue'
import { store } from '../store'
import AddFriendPopup from '../components/AddFriendPopup.vue'
import { User } from '../api/schema'

type GetStatus = 'loading' | 'loaded' | 'error'
const errorMessage = ref()

const users = ref<User[]>()

const getFriendsStatus = ref<GetStatus>()
async function getFriends() {
	getFriendsStatus.value = 'loading'
	try {
		//TODO: Call
		//users.value = friends
		getFriendsStatus.value = 'loaded'
	} catch (error) {
		errorMessage.value = error
		getFriendsStatus.value = 'error'
	}
}

interface FriendChat {
	chatId: number
	chatName: string
	members: User[]
}

const friendChats = ref<FriendChat[]>()

const getChatsStatus = ref<GetStatus>()
async function getChats() {
	getChatsStatus.value = 'loading'
	if (!store.getters.loggedIn) {
		errorMessage.value = 'Not logged in'
		getChatsStatus.value = 'error'
		return
	}
	try {
		//TODO: Call
		const data: FriendChat[] = []

		//NOTE: User will not be in the list of "members"
		let newData: FriendChat[] = []
		data.forEach(({ chatId, chatName, members }) =>
			newData.push({
				chatId,
				chatName,
				members: members.filter(
					({ id }) => id !== store.state.user?.id
				),
			})
		)

		friendChats.value = data
		getChatsStatus.value = 'loaded'
	} catch (error) {
		errorMessage.value = error
		getChatsStatus.value = 'error'
	}
}

enum View {
	FRIENDS = 'Friends',
	CHATS = 'Chats',
}
const view = ref<View>(View.CHATS)
getChats()

watch(view, () => {
	switch (view.value) {
		case View.FRIENDS:
			getFriends()
			break
		case View.CHATS:
			getChats()
			break
	}
})
const addingUser = ref(false)
const createGC = ref(false)
function add() {
	switch (view.value) {
		case View.FRIENDS:
			addingUser.value = true
			break
		case View.CHATS:
			createGC.value = true
			break
	}
}
</script>

<template>
	<div class="grid gap-4">
		<div class="flex gap-4">
			<button
				v-for="tag in View"
				class="px-2 py-1 rounded-lg"
				:class="
					view === tag
						? 'bg-blue text-white'
						: 'bg-slate-300 text-slate-900'
				"
				@click="view = tag"
			>
				{{ tag }}
			</button>
		</div>
		<div v-if="view === 'Friends'">
			<BaseBanner
				v-if="getFriendsStatus === 'error'"
				type="error"
				:message="errorMessage"
			/>
			<LoadingIndicator v-if="getFriendsStatus === 'loading'" />
			<div class="grid gap-4">
				<UserCard v-for="user in users" :user="user" />
			</div>
			<FloatingBtn @click="add" />
			<AddFriendPopup
				v-show="addingUser"
				@exit="addingUser = false"
			></AddFriendPopup>
		</div>
		<div v-if="view === 'Chats'">
			<BaseBanner
				v-if="getChatsStatus === 'error'"
				type="error"
				:message="errorMessage"
			/>
			<LoadingIndicator v-if="getChatsStatus === 'loading'" />
			<div class="grid gap-4">
				<div v-for="{ chatId, chatName, members } in friendChats">
					<Card>
						<div class="flex gap-4 w-full">
							<div
								class="grid grid-cols-2 w-16 h-16 gap-2 min-w-[64px]"
							>
								<img
									v-for="user in members.slice(0, 4)"
									class="rounded-full object-cover"
									:src="user.profilePicture"
								/>
							</div>
							<div class="grid gap-2">
								<p class="font-bold text-lg">{{ chatName }}</p>
								<div class="flex gap-2 flex-wrap">
									<p
										v-for="member in members"
										class="text-slate-500"
									>
										{{ member.firstName }}
									</p>
								</div>
							</div>
						</div>
					</Card>
				</div>
			</div>
			<FloatingBtn @click="add" />
		</div>
	</div>
</template>
