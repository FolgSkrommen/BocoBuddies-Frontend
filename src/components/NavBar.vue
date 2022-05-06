<script setup lang="ts">
import { store } from '../store'
import {
	SearchIcon,
	ChatAlt2Icon,
	UserIcon,
	CollectionIcon,
	UserGroupIcon,
	PlusIcon,
} from '@heroicons/vue/solid'
</script>

<template>
	<nav class="bg-slate-900 text-white w-full fixed bottom-0 z-50">
		<div class="flex justify-around px-4 py-2 container mx-auto">
			<router-link class="grid place-items-center" to="/">
				<SearchIcon class="w-8 h-8" />
				<p class="text-slate-300 text-sm">Søk</p>
			</router-link>
			<router-link
				class="grid place-items-center"
				v-if="store.getters.loggedIn"
				to="/overview/items"
			>
				<CollectionIcon class="w-8 h-8" />
				<p class="text-slate-300 text-sm">Ditt</p>
			</router-link>
			<router-link
				class="grid place-items-center"
				v-if="store.getters.loggedIn"
				to="/community"
			>
				<UserGroupIcon class="w-8 h-8" />
				<p class="text-slate-300 text-sm">Samfunn</p>
			</router-link>
			<router-link
				class="grid place-items-center"
				v-if="store.getters.loggedIn"
				to="/chats"
			>
				<ChatAlt2Icon class="w-8 h-8" />
				<p class="text-slate-300 text-sm">Lån</p>
			</router-link>
			<router-link
				class="grid place-items-center"
				:to="'/user/' + store.state.user?.userId"
			>
				<img
					v-if="store.state.user"
					class="rounded-full object-cover w-8 h-8"
					:src="store.state.user.profilePicture"
					:alt="store.state.user.username"
				/>
				<UserIcon v-else class="w-8 h-8" />
				<p class="text-slate-300 text-sm">
					<slot v-if="store.state.user"> Profil </slot>
					<slot v-else> Logg inn </slot>
				</p>
			</router-link>
		</div>
	</nav>
</template>

<style scoped>
a {
	@apply text-white;
}
.router-link-active * {
	@apply text-blue-400;
}
</style>
