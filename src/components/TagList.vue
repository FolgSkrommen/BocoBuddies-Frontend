<script setup lang="ts">
import { XCircleIcon } from '@heroicons/vue/solid'

const props = defineProps({
	modelValue: { type: Array, required: true },
	removable: { type: Boolean },
})
const emit = defineEmits(['remove-tag-event', 'add-tag-event'])
</script>

<template>
	<div class="flex gap-3 overflow-x-auto">
		<div
			v-for="tag in props.modelValue"
			:key="tag.id"
			class="bg-blue text-white p-1 px-2 flex gap-1 rounded-xl"
		>
			<XCircleIcon
				v-if="props.removable"
				@click="$emit('remove-tag-event', tag)"
				class="h-6 w-6 place-self-center"
			></XCircleIcon>
			<span
				@click="$emit('add-tag-event', tag)"
				class="text-lg truncate"
				>{{ tag.name }}</span
			>
		</div>
	</div>
</template>
