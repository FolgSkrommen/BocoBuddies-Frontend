<script setup lang="ts">
import { watch } from 'vue'
import {
	InformationCircleIcon,
	CheckCircleIcon,
	XCircleIcon,
} from '@heroicons/vue/outline'

interface Props {
	type?: 'error' | 'success' | 'info'
	message: string
}

const { type, message } = defineProps<Props>()

window.scrollTo({ top: 0 })
watch(
	() => message,
	() => {
		window.scrollTo({ top: 0 })
	}
)
</script>

<template>
	<div
		v-if="type === 'error'"
		class="rounded-lg p-2 flex gap-2 bg-red-200 text-red-800"
	>
		<XCircleIcon class="w-8 h-8 min-w-fit" />
		<p>{{ message }}</p>
	</div>
	<div
		v-else-if="type === 'success'"
		class="rounded-lg p-2 flex gap-2 bg-green-200 text-green-800"
	>
		<CheckCircleIcon class="w-8 h-8 min-w-fit" />
		<p>{{ message }}</p>
	</div>
	<div v-else class="rounded-lg p-2 flex gap-2 bg-slate-200 text-slate-600">
		<InformationCircleIcon class="w-8 h-8 min-w-fit" />
		<p>{{ message }}</p>
	</div>
</template>
