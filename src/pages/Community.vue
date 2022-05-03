<script setup lang="ts">
import { ref, watch } from 'vue'
import UserCard from '../components/UserCard.vue'
import LoadingIndicator from '../components/base/LoadingIndicator.vue'
import BaseBanner from '../components/base/BaseBanner.vue'
import axios from 'axios'
import FloatingBtn from '../components/base/FloatingBtn.vue'
import Card from '../components/Card.vue'
import { store } from '../store'
import { FriendChat, User } from '../api/schema'
import AddFriendPopup from '../components/community-popups/AddFriendPopup.vue'
import NewMessagePopup from '../components/community-popups/NewMessagePopup.vue'

type GetStatus = 'loading' | 'loaded' | 'error'

const users = ref<User[]>()

const getFriendsStatus = ref<GetStatus>()
async function getFriends() {
	if (!store.state.user) return
	getFriendsStatus.value = 'loading'
	try {
		const res = await axios.get('/user/friends', {
			params: { userId: store.state.user.userId },
		})
		users.value = res.data
		console.log(users.value)
		getFriendsStatus.value = 'loaded'
	} catch (error: any) {
		store.dispatch('error', error.message)
		getFriendsStatus.value = 'error'
	}
}

const friendChats = ref<FriendChat[]>()

const getChatsStatus = ref<GetStatus>()
async function getChats() {
	getChatsStatus.value = 'loading'
	if (!store.getters.loggedIn) {
		store.dispatch('error', 'Not logged in')
		getChatsStatus.value = 'error'
		return
	}
	try {
		const res = await axios.get('/chat/getByUser/community')
		const data: FriendChat[] = res.data

		//NOTE: User will not be in the list of "members"
		let dataWithoutUser: FriendChat[] = []
		data.forEach(({ chatId, chatName, members }) =>
			dataWithoutUser.push({
				chatId,
				chatName,
				members: members.filter(
					({ userId }) => userId !== store.state.user?.userId
				),
			})
		)

		friendChats.value = dataWithoutUser
		getChatsStatus.value = 'loaded'
	} catch (error: any) {
		store.dispatch('error', error.message)
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
const createChat = ref(false)
function add() {
	switch (view.value) {
		case View.FRIENDS:
			addingUser.value = true
			break
		case View.CHATS:
			createChat.value = true
			break
	}
}
</script>

<template>
	<div class="grid gap-4">
		<div class="flex gap-4">
			<button
				v-for="tag in View"
				:class="
					view === tag
						? 'bg-blue-500 text-white'
						: 'bg-slate-300 text-slate-900'
				"
				@click="view = tag"
			>
				{{ tag }}
			</button>
		</div>
		<div v-if="view === 'Friends'">
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
			<LoadingIndicator v-if="getChatsStatus === 'loading'" />
			<div class="grid gap-4">
				<div v-for="{ chatId, chatName, members } in friendChats">
					<router-link :to="'/community/chat/' + chatId">
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
									<p class="font-bold text-lg">
										{{ chatName }}
									</p>
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
					</router-link>
				</div>
			</div>
			<FloatingBtn @click="add" />
			<NewMessagePopup
				v-show="createChat"
				@exit="createChat = false"
			></NewMessagePopup>
		</div>
	</div>
</template>
