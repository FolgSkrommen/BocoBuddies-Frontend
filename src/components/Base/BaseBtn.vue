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
			return 'bg-blue-500 text-white'
		case 'red':
			return 'bg-red-500 text-white'
		case 'gray':
			return 'bg-gray-200 text-gray-500'
		default:
			return 'bg-blue-500 text-white'
	}
})
</script>

<template>
	<router-link
		class="w-fit py-1 px-2 rounded-lg self-end place-self-end shadow-lg"
		:class="colorClass"
		v-if="to"
		:to="to"
	>
		<slot></slot>
	</router-link>
	<button
		v-else
		class="w-fit py-1 px-2 rounded-lg self-end place-self-end shadow-lg disabled:bg-gray-500 opacity-50"
		:class="colorClass"
		:type="type ?? 'button'"
	>
		<slot></slot>
	</button>
</template>
