<script setup lang="ts">
import { computed } from 'vue'
interface Props {
	to?: string
	color?: 'blue' | 'red' | 'gray'
	type?: 'submit'
}

const { color } = defineProps<Props>()

const colorClass = computed(() => {
	switch (color) {
		case 'blue':
			return 'bg-blue text-white'
		case 'red':
			return 'bg-red text-white'
		case 'gray':
			return 'bg-slate-400 text-white'
		default:
			return 'bg-blue text-white'
	}
})
</script>

<template>
	<router-link
		class="w-fit p-2 text-xl rounded-lg self-end place-self-end shadow-lg disabled:shadow-none disabled:bg-slate-300 disabled:text-slate-500"
		:class="colorClass"
		v-if="to"
		:to="to"
	>
		<slot></slot>
	</router-link>
	<button
		v-else
		class="w-fit p-2 text-xl rounded-lg self-end place-self-end shadow-lg disabled:shadow-none disabled:bg-slate-300 disabled:text-slate-500"
		:class="colorClass"
		:type="type ?? 'button'"
	>
		<slot></slot>
	</button>
</template>
