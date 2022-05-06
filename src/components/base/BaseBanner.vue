<script setup lang="ts">
import { computed, watch } from 'vue'
import {
	InformationCircleIcon,
	CheckCircleIcon,
	XCircleIcon,
	XIcon,
} from '@heroicons/vue/outline'

interface Props {
	type?: 'error' | 'success' | 'info'
	message: string
}

const { type, message } = defineProps<Props>()

const emit = defineEmits(['exit'])

window.scrollTo({ top: 0 })
watch(
	() => message,
	() => {
		window.scrollTo({ top: 0 })
	}
)

const colorClass = computed(() => {
	switch (type) {
		case 'error':
			return 'bg-red-200 text-red-800'
		case 'success':
			return 'bg-green-300 text-green-800'
		case 'info':
			return 'bg-slate-300 text-slate-800'
		default:
			return 'bg-slate-300 text-slate-800'
	}
})
</script>

<template>
	<div
		data-testid="container"
		class="container mx-auto rounded-xl p-2 flex gap-4"
		:class="colorClass"
	>
		<XCircleIcon
			data-testid="x-icon"
			v-if="type === 'error'"
			class="w-8 h-8 min-w-[32px]"
		/>
		<CheckCircleIcon
			data-testid="check-icon"
			v-else-if="type === 'success'"
			class="w-8 h-8 min-w-[32px]"
		/>
		<InformationCircleIcon
			v-else
			data-testid="info-icon"
			class="w-8 h-8 min-w-[32px]"
		/>
		<p data-testid="message">{{ message }}</p>
		<span class="flex-grow"></span>
		<XIcon
			data-testid="exit"
			@click="emit('exit')"
			class="w-8 h-8 text-slate-900 cursor-pointer min-w-[32px]"
		/>
	</div>
</template>
