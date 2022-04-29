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
		class="fixed bottom-20 right-8 p-1 rounded-full bg-blue shadow-xl"
	>
		<PlusIcon class="w-14 h-14 text-white" />
	</router-link>
	<div
		v-else
		class="fixed bottom-20 right-8 p-1 rounded-full bg-blue shadow-xl"
	>
		<PlusIcon class="w-14 h-14 text-white" />
	</div>
</template>
