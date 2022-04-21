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
			class="bg-blue text-white p-1 rounded-xl flex gap-1 items-center h-max"
		>
			<XCircleIcon
				v-if="props.removable"
				@click="$emit('remove-tag-event', tag)"
				class="h-5 w-5"
			></XCircleIcon>
			<span @click="$emit('add-tag-event', tag)">{{ tag.name }}</span>
		</div>
	</div>
</template>
