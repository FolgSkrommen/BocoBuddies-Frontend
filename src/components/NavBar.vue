<script setup lang="ts">
import { HomeIcon, ChatIcon, UserIcon, PlusIcon } from '@heroicons/vue/solid'
</script>

<template>
	<nav class="bg-gray-800 w-full">
		<div class="flex justify-between px-4 py-2 container mx-auto">
			<router-link to="/">
				<HomeIcon class="w-10 h-10 text-white" />
			</router-link>
			<router-link to="/item-register">
				<PlusIcon class="w-10 h-10 text-white" />
			</router-link>
			<router-link to="/chats">
				<ChatIcon class="w-10 h-10 text-white" />
			</router-link>
			<router-link to="/settings">
				<UserIcon class="w-10 h-10 text-white" />
			</router-link>
		</div>
	</nav>
</template>
