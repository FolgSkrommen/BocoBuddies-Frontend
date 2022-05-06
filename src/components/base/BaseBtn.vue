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
			return 'bg-blue-700 text-white'
		case 'red':
			return 'bg-red-500 text-white hover:bg-red-700 hover:text-white'
		case 'gray':
			return 'bg-slate-600 text-white hover:bg-slate-400 hover:text-black'
		case 'green':
			return 'bg-green-500 text-white'
		default:
			return 'bg-blue-700 text-white'
	}
})
</script>

<template>
	<router-link
		data-testid="router-link"
		class="py-2 px-4 rounded-xl bg-blue-500 text-white hover:bg-blue-800 transition-colors text-center"
		:class="colorClass"
		v-if="to"
		:to="to"
	>
		<slot></slot>
	</router-link>
	<button
		v-else
		data-testid="button"
		class="disabled:bg-slate-300 disabled:hover:bg-slate-300"
		:class="colorClass"
		:disabled="disabled"
		:type="type ?? 'button'"
	>
		<slot></slot>
	</button>
</template>
