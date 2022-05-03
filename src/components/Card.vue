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
	<div class="p-2 shadow-lg rounded-xl grid gap-2" :class="colorClass">
		<slot></slot>
	</div>
</template>
