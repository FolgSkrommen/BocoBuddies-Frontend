<script setup lang="ts">
import { computed } from 'vue'
interface Props {
	to?: string
	color?: 'blue' | 'red' | 'gray' | 'green'
	type?: 'submit'
	disabled?: boolean
}

const { color } = defineProps<Props>()

const colorClass = computed(() => {
	switch (color) {
		case 'blue':
			return 'bg-blue-600 text-white'
		case 'red':
			return 'bg-red-400 text-white'
		case 'gray':
			return 'bg-slate-300 text-slate-900'
		case 'green':
			return 'bg-green-500 text-white'
		default:
			return 'bg-blue-600 text-white'
	}
})
</script>

<template>
	<router-link
		class="py-2 px-4 rounded-xl bg-blue-500 text-white text-center"
		:class="colorClass"
		v-if="to"
		:to="to"
	>
		<slot></slot>
	</router-link>
	<button
		v-else
		class="disabled:bg-gray-300"
		:class="colorClass"
		:disabled="disabled"
		:type="type ?? 'button'"
	>
		<slot></slot>
	</button>
</template>
