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
	<div class="left-0 top-0 fixed w-full p-4">
		<div
			v-if="type === 'error'"
			class="container mx-auto rounded-lg p-2 flex gap-2 bg-red-200 text-red-800"
		>
			<XCircleIcon class="w-8 h-8 min-w-fit" />
			<p>{{ message }}</p>
			<span class="flex-grow"></span>
			<XIcon
				@click="emit('exit')"
				class="w-8 h-8 min-w-fit text-slate-900 cursor-pointer"
			/>
		</div>
		<div
			v-else-if="type === 'success'"
			class="rounded-lg p-2 flex gap-2 bg-green-200 text-green-800"
		>
			<CheckCircleIcon class="w-8 h-8 min-w-fit" />
			<p>{{ message }}</p>
		</div>
		<div
			v-else
			class="rounded-lg p-2 flex gap-2 bg-slate-200 text-slate-600"
		>
			<InformationCircleIcon class="w-8 h-8 min-w-fit" />
			<p>{{ message }}</p>
		</div>
	</div>
</template>
