<script setup lang="ts">
import { store } from '../store'
import {
	HomeIcon,
	ChatIcon,
	UserIcon,
	CollectionIcon,
	PlusIcon,
} from '@heroicons/vue/solid'
</script>

<template>
	<nav class="bg-slate-900 w-full fixed bottom-0 z-50">
		<div class="flex justify-between px-4 py-2 container mx-auto">
			<router-link to="/">
				<HomeIcon class="w-8 h-8 text-white" />
			</router-link>

			<router-link to="/my-loans">
				<CollectionIcon class="w-8 h-8 text-white" />
			</router-link>
			<router-link to="/my-items">
				<PlusIcon class="w-8 h-8 text-white" />
			</router-link>
			<router-link to="/chats">
				<ChatIcon class="w-8 h-8 text-white" />
			</router-link>

			<router-link to="/settings">
				<UserIcon class="w-8 h-8 text-white" />
			</router-link>
		</div>
	</nav>
</template>
