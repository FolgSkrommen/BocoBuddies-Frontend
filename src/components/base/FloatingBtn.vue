<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/solid'
interface Props {
	to?: string
}
const { to } = defineProps<Props>()
</script>

<template>
	<router-link
		v-if="to"
		:to="to"
		data-testid="router-link"
		class="fixed bottom-24 right-8 p-1 rounded-full bg-blue-500 hover:bg-blue-800 hover:text-white transition-colors shadow-xl"
	>
		<PlusIcon class="w-14 h-14 text-white" />
	</router-link>
	<button
		data-testid="button"
		class="fixed bottom-24 right-8 p-1 rounded-full bg-blue-500 hover:bg-blue-800 hover:text-white transition-colors shadow-xl"
		v-else
	>
		<PlusIcon class="w-14 h-14 text-white" />
	</button>
</template>
