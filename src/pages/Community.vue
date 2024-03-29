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
import { Payload } from 'vuex'
import ChatCard from '../components/ChatCard.vue'
import { GetUserFriendsPendingResponse } from '../api/user/friends/pending'
import BaseBtn from '../components/base/BaseBtn.vue'
import {
	DelUserFriendsRequest,
	DelUserFriendsResponse,
	PutUserFriendsRequest,
	PutUserFriendsResponse,
} from '../api/user/friends'
import { DelUserRequest } from '../api/user'

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

function closeChatSearchAndGetChats() {
	getChats()
	createChat.value = false
}

const friendRequests = ref<User[]>([])
const sentFriendRequests = ref<User[]>([])
const friendRequestStatus = ref<GetStatus>()

async function getFriendRequests() {
	friendRequestStatus.value = 'loading'
	try {
		const res = await axios.get('/user/friends/pending')
		const data: GetUserFriendsPendingResponse = res.data
		friendRequests.value = data
		friendRequestStatus.value = 'loaded'
	} catch (error: any) {
		store.dispatch('error', error.message)
		friendRequestStatus.value = 'error'
	}
}
async function getSentFriendRequests() {
	friendRequestStatus.value = 'loading'
	try {
		const res = await axios.get('/user/friends/sent')
		const data: GetUserFriendsPendingResponse = res.data
		sentFriendRequests.value = data
		friendRequestStatus.value = 'loaded'
	} catch (error: any) {
		store.dispatch('error', error.message)
		friendRequestStatus.value = 'error'
	}
}

async function acceptReq(request: User) {
	friendRequestStatus.value = 'loading'
	console.log(request)

	try {
		const params: PutUserFriendsRequest = { userId: request.userId }
		const res = await axios.put('/user/friends', null, { params })
		const data: PutUserFriendsResponse = res.data
		if (data) {
			getFriendRequests()
			return
		}
		store.dispatch(
			'error',
			'Du fikk ikke akseptert forespørselen til ' +
				request.firstName +
				' ' +
				request.lastName
		)
		friendRequestStatus.value = 'error'
	} catch (error: any) {
		store.dispatch('error', error.message)
		friendRequestStatus.value = 'error'
	}
}

async function delUserReqOrFriend(request: User) {
	friendRequestStatus.value = 'loading'
	try {
		const params: DelUserFriendsRequest = { userId: request.userId }
		const res = await axios.delete('/user/friends', { params })
		const data: DelUserFriendsResponse = res.data
		if (data) {
			getFriends()
			getFriendRequests()
			getSentFriendRequests()
			return
		}
		store.dispatch(
			'error',
			'Du fikk ikke avslått forespørselen til ' +
				request.firstName +
				' ' +
				request.lastName
		)
		friendRequestStatus.value = 'error'
	} catch (error: any) {
		store.dispatch('error', error.message)
		friendRequestStatus.value = 'error'
	}
}

enum View {
	FRIENDS = 'Venner',
	FRIEND_REQ = 'Forespørsler',
	CHATS = 'Samtaler',
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
		case View.FRIEND_REQ:
			getFriendRequests()
			getSentFriendRequests()
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
function cookie() {
	const seenCommunityCookie = ('; ' + document.cookie)
		.split(`; seenCommunityTutorial=`)
		.pop()
		?.split(';')[0]

	if (!seenCommunityCookie?.includes('true')) {
		store.dispatch(
			'info',
			'Dette er sammfunn siden. Her kan du legge til venner og chatte med de. Du kan til og med opprette gruppechatter. Klikk på pluss knappen under den riktige fanen for å enten opprette en ny chat eller å legge til nye venner Klikk X knappen for å lukke denne meldingen.'
		)
		document.cookie = 'seenCommunityTutorial=true; max-age=31536000'
	}
}
cookie()
</script>

<template>
	<div class="grid gap-4">
		<div class="flex gap-4">
			<button
				v-for="tag in View"
				class="flex-1"
				:class="
					view === tag
						? 'bg-blue-500 text-white'
						: 'bg-slate-600 text-white'
				"
				@click="view = tag"
				data-testid="view-button"
			>
				{{ tag }}
			</button>
		</div>
		<div v-if="view === View.FRIENDS">
			<LoadingIndicator v-if="getFriendsStatus === 'loading'" />
			<div class="grid gap-4">
				<div v-for="user in users">
					<UserCard :user="user" :to="'/user/' + user.userId">
						<BaseBtn color="red" @click="delUserReqOrFriend(user)"
							>Fjern</BaseBtn
						>
					</UserCard>
				</div>
			</div>
			<FloatingBtn @click="add" />
			<AddFriendPopup
				v-show="addingUser"
				@exit="addingUser = false"
			></AddFriendPopup>
			<h2
				v-if="users?.length === 0"
				class="text-slate-600 w-fit mx-auto mt-28"
			>
				Trykk (+) for å legge til venner
			</h2>
		</div>
		<div v-if="view === View.FRIEND_REQ">
			<LoadingIndicator v-if="friendRequestStatus === 'loading'" />
			<p v-if="!friendRequests">Ingen venneforespørsler</p>
			<div class="grid gap-8">
				<div v-if="friendRequests.length > 0">
					<h2>Forespørsler</h2>
					<div class="grid gap-4">
						<div v-for="request in friendRequests">
							<UserCard
								:user="request"
								:to="'/user/' + request.userId"
							>
								<BaseBtn
									color="blue"
									@click="acceptReq(request)"
									>Godta</BaseBtn
								>
								<BaseBtn
									color="red"
									@click="delUserReqOrFriend(request)"
									>Avslå</BaseBtn
								>
							</UserCard>
						</div>
					</div>
				</div>
				<div v-if="sentFriendRequests.length > 0">
					<h2>Sendte forespørsler</h2>
					<div class="grid gap-4">
						<div v-for="request in sentFriendRequests">
							<UserCard
								:user="request"
								:to="'/user/' + request.userId"
							>
								<BaseBtn
									color="red"
									@click="delUserReqOrFriend(request)"
									>Angre</BaseBtn
								>
							</UserCard>
						</div>
					</div>
				</div>
			</div>
			<h2
				v-if="
					friendRequests?.length === 0 &&
					sentFriendRequests?.length === 0
				"
				class="text-slate-600 w-fit mx-auto mt-28"
			>
				Du har ingen forespørsler
			</h2>
		</div>
		<div v-if="view === View.CHATS">
			<LoadingIndicator v-if="getChatsStatus === 'loading'" />
			<div class="grid gap-4">
				<div v-for="friendChat in friendChats">
					<ChatCard
						:to="'/community/chat/' + friendChat.chatId"
						:friendChat="friendChat"
						data-testid="chat-card"
					></ChatCard>
				</div>
			</div>
			<h2
				v-if="friendChats?.length === 0"
				class="text-slate-600 w-fit mx-auto mt-28"
			>
				Trykk (+) for å starte en samtale, eller legg til en venn
			</h2>
			<FloatingBtn @click="add" data-testid="add-btn" />
			<NewMessagePopup
				v-show="createChat"
				@exit="createChat = false"
				@created-gc="closeChatSearchAndGetChats"
			></NewMessagePopup>
		</div>
	</div>
</template>
