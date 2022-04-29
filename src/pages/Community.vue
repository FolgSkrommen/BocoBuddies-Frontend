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
import NewMessagePopup from '../components/NewMessagePopup.vue'

type GetStatus = 'loading' | 'loaded' | 'error'
const errorMessage = ref()

interface User {
	userId: number
	firstName: string
	lastName: string
	username: string
	rating: number
	pictureUrl: string
	trusted: boolean
}

const users = ref<User[]>()

const getFriendsStatus = ref<GetStatus>()
async function getFriends() {
	getFriendsStatus.value = 'loading'
	try {
		//TODO: Call
		const friends: User[] = [
			{
				userId: 1,
				firstName: 'John',
				lastName: 'Doe',
				username: 'john.doe',
				rating: 1,
				pictureUrl: 'https://i.stack.imgur.com/5Kgaq.jpg?s=192&g=1',
				trusted: true,
			},
			{
				userId: 2,
				firstName: 'Jane',
				lastName: 'Doe',
				username: 'jane.doe',
				rating: 4.5,
				pictureUrl:
					'https://mooreks.co.uk/wp-content/uploads/2015/01/Dinah-Regan-1513-1.jpg',
				trusted: true,
			},
			{
				userId: 3,
				firstName: 'John',
				lastName: 'Smith',
				username: 'john.smith',
				rating: 3,
				pictureUrl:
					'https://static.generated.photos/vue-static/face-generator/landing/demo-previews/sex.jpg',
				trusted: true,
			},
			{
				userId: 4,
				firstName: 'Jane',
				lastName: 'Smith',
				username: 'jane.smith',
				rating: 4.5,
				pictureUrl:
					'https://i1.sndcdn.com/artworks-FMJtFdT1qYskUjoP-y0ixOw-t500x500.jpg',
				trusted: true,
			},
			{
				userId: 5,
				firstName: 'John',
				lastName: 'Doe',
				username: 'john.doe',
				rating: 4.5,
				pictureUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
				trusted: true,
			},
		]
		users.value = friends
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
		const data: FriendChat[] = [
			{
				chatId: 1,
				chatName: 'Chat 1',
				members: [
					{
						userId: 1,
						firstName: 'John',
						lastName: 'Doe',
						username: 'johndoe',
						rating: 4.5,
						pictureUrl:
							'https://randomuser.me/api/portraits/men/3.jpg',
						trusted: true,
					},
					{
						userId: 2,
						firstName: 'Jane',
						lastName: 'Janeson',
						username: 'janey',
						rating: 3.4,
						pictureUrl:
							'https://mooreks.co.uk/wp-content/uploads/2015/01/Dinah-Regan-1513-1.jpg',
						trusted: true,
					},
					{
						userId: 3,
						firstName: 'Johan',
						lastName: 'Johanson',
						username: 'johan',
						rating: 4.2,
						pictureUrl:
							'https://static.generated.photos/vue-static/face-generator/landing/demo-previews/sex.jpg',
						trusted: true,
					},
				],
			},
			{
				chatId: 2,
				chatName: 'Chat 2',
				members: [
					{
						userId: 1,
						firstName: 'John',
						lastName: 'Doe',
						username: 'johndoe',
						rating: 4.5,
						pictureUrl:
							'https://randomuser.me/api/portraits/men/3.jpg',
						trusted: true,
					},
				],
			},
			{
				chatId: 3,
				chatName: 'Chat 3',
				members: [
					{
						userId: 1,
						firstName: 'John',
						lastName: 'Doe',
						username: 'johndoe',
						rating: 4.5,
						pictureUrl:
							'https://randomuser.me/api/portraits/men/3.jpg',
						trusted: true,
					},
					{
						userId: 2,
						firstName: 'Jane',
						lastName: 'Janeson',
						username: 'janey',
						rating: 3.4,
						pictureUrl:
							'https://mooreks.co.uk/wp-content/uploads/2015/01/Dinah-Regan-1513-1.jpg',
						trusted: true,
					},
				],
			},
			{
				chatId: 4,
				chatName: 'Chat 4',
				members: [
					{
						userId: 1,
						firstName: 'John',
						lastName: 'Doe',
						username: 'johndoe',
						rating: 4.5,
						pictureUrl:
							'https://randomuser.me/api/portraits/men/3.jpg',
						trusted: true,
					},
					{
						userId: 2,
						firstName: 'Jane',
						lastName: 'Janeson',
						username: 'janey',
						rating: 3.4,
						pictureUrl:
							'https://mooreks.co.uk/wp-content/uploads/2015/01/Dinah-Regan-1513-1.jpg',
						trusted: true,
					},
					{
						userId: 3,
						firstName: 'Johan',
						lastName: 'Johanson',
						username: 'johan',
						rating: 4.2,
						pictureUrl:
							'https://static.generated.photos/vue-static/face-generator/landing/demo-previews/sex.jpg',
						trusted: true,
					},
					{
						userId: 4,
						firstName: 'Johanna',
						lastName: 'Johansson',
						username: 'johanna',
						rating: 4.2,
						pictureUrl:
							'https://i1.sndcdn.com/artworks-FMJtFdT1qYskUjoP-y0ixOw-t500x500.jpg',
						trusted: true,
					},
				],
			},
			{
				chatId: 5,
				chatName: 'Chat 5',
				members: [
					{
						userId: 1,
						firstName: 'John',
						lastName: 'Doe',
						username: 'johndoe',
						rating: 4.5,
						pictureUrl:
							'https://randomuser.me/api/portraits/men/3.jpg',
						trusted: true,
					},
					{
						userId: 2,
						firstName: 'Jane',
						lastName: 'Janeson',
						username: 'janey',
						rating: 3.4,
						pictureUrl:
							'https://mooreks.co.uk/wp-content/uploads/2015/01/Dinah-Regan-1513-1.jpg',
						trusted: true,
					},
					{
						userId: 3,
						firstName: 'Johan',
						lastName: 'Johanson',
						username: 'johan',
						rating: 4.2,
						pictureUrl:
							'https://static.generated.photos/vue-static/face-generator/landing/demo-previews/sex.jpg',
						trusted: true,
					},
					{
						userId: 4,
						firstName: 'Johanna',
						lastName: 'Johansson',
						username: 'johanna',
						rating: 4.2,
						pictureUrl:
							'https://i1.sndcdn.com/artworks-FMJtFdT1qYskUjoP-y0ixOw-t500x500.jpg',
						trusted: true,
					},
					{
						userId: 5,
						firstName: 'Johan',
						lastName: 'Johansson',
						username: 'johan',
						rating: 4.2,
						pictureUrl:
							'https://randomuser.me/api/portraits/men/3.jpg',
						trusted: true,
					},
				],
			},
		]

		//NOTE: User will not be in the list of "members"
		let newData: FriendChat[] = []
		data.forEach(({ chatId, chatName, members }) =>
			newData.push({
				chatId,
				chatName,
				members: members.filter(
					({ userId }) => userId !== store.state.user?.id
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
									:src="user.pictureUrl"
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
			<NewMessagePopup
				v-show="createChat"
				@exit="createChat = false"
			></NewMessagePopup>
		</div>
	</div>
</template>
