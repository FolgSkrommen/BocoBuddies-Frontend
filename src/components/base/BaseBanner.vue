<script setup lang="ts">
import { watch } from 'vue'
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
</script>

<template>
	<div
		v-if="type === 'error'"
		class="container mx-auto rounded-lg p-2 flex gap-2 bg-red-300 text-red-800"
	>
		<XCircleIcon class="w-8 h-8 min-w-[32px]" />
		<p>{{ message }}</p>
		<span class="flex-grow"></span>
		<XIcon
			@click="emit('exit')"
			class="w-8 h-8 text-slate-900 cursor-pointer min-w-[32px]"
		/>
	</div>
	<div
		v-else-if="type === 'success'"
		class="container mx-auto rounded-lg p-2 flex gap-2 bg-green-300 text-green-800"
	>
		<CheckCircleIcon class="w-8 h-8 min-w-[32px]" />
		<p>{{ message }}</p>
		<span class="flex-grow"></span>
		<XIcon
			@click="emit('exit')"
			class="w-8 h-8 text-slate-900 cursor-pointer min-w-[32px]"
		/>
	</div>
	<div
		v-else
		class="container mx-auto rounded-lg p-2 flex gap-2 bg-slate-300 text-slate-800"
	>
		<InformationCircleIcon class="w-8 h-8 min-w-[32px]" />
		<p>{{ message }}</p>
		<span class="flex-grow"></span>
		<XIcon
			@click="emit('exit')"
			class="w-8 h-8 min-w-[32px] text-slate-900 cursor-pointer"
		/>
	</div>
</template>
