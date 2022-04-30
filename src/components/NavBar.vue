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
	<nav class="bg-slate-900 w-full fixed bottom-0 z-50">
		<div class="flex justify-around px-4 py-2 container mx-auto">
			<router-link to="/">
				<SearchIcon class="w-8 h-8 text-white" />
			</router-link>
			<router-link v-if="store.getters.loggedIn" to="/overview/items">
				<CollectionIcon class="w-8 h-8 text-white" />
			</router-link>
			<router-link v-if="store.getters.loggedIn" to="/community">
				<UserGroupIcon class="w-8 h-8 text-white" />
			</router-link>
			<router-link v-if="store.getters.loggedIn" to="/chats">
				<ChatAlt2Icon class="w-8 h-8 text-white" />
			</router-link>

			<router-link to="/user">
				<UserIcon class="w-8 h-8 text-white" />
			</router-link>
		</div>
	</nav>
</template>
