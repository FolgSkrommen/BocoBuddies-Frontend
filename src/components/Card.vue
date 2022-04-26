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
			return 'bg-slate-100'
	}
})
</script>

<template>
	<div class="z-20 p-2 shadow-lg rounded-xl grid gap-2" :class="colorClass">
		<slot></slot>
	</div>
</template>
