<script setup lang="ts">
import { computed } from 'vue'

interface Props {
	color?: 'green'
}

const { color } = defineProps<Props>()

const colorClass = computed(() => {
	switch (color) {
		case 'green':
			return 'bg-green-100'
		default:
			return 'bg-white'
	}
})
</script>

<template>
	<div
		class="shadow-lg rounded-xl grid gap-4 transition-all"
		:class="colorClass"
		data-testid="slot"
	>
		<slot></slot>
	</div>
</template>
