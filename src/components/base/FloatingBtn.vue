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
		data-bs-toggle="tooltip"
		data-bs-placement="bottom"
		title="Opprett annonse"
	>
		<PlusIcon class="w-14 h-14 text-white" />
	</router-link>
	<button
		data-testid="button"
		class="fixed bottom-24 right-8 p-1 rounded-full bg-blue-500 hover:bg-blue-800 hover:text-white transition-colors shadow-xl"
		v-else
		data-bs-toggle="tooltip"
		data-bs-placement="bottom"
		title="Legg til ny"
	>
		<PlusIcon class="w-14 h-14 text-white" />
	</button>
</template>
