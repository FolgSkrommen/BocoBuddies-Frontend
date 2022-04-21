<script setup lang="ts">
import { HomeIcon, ChatIcon, UserIcon, PlusIcon } from '@heroicons/vue/solid'
</script>

<template>
	<!-- TODO: Finish, add router link -->

	<nav class="bg-black w-full">
		<div class="flex justify-between px-4 py-2 container mx-auto">
			<router-link to="/">
				<HomeIcon class="w-16 h-16 text-white" />
			</router-link>
			<router-link to="/">
				<PlusIcon class="w-16 h-16 text-white" />
			</router-link>
			<router-link to="/">
				<ChatIcon class="w-16 h-16 text-white" />
			</router-link>
			<router-link to="/">
				<UserIcon class="w-16 h-16 text-white" />
			</router-link>
		</div>
	</nav>
</template>
