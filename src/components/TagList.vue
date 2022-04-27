<script setup lang="ts">
import { XCircleIcon } from '@heroicons/vue/solid'

interface Props {
	modelValue: Tag[]
	removable?: boolean
}
interface Tag {
	categoryId: number
	categoryName: string
	superCategoryId: number
}
let { modelValue, removable } = defineProps<Props>()
const emit = defineEmits(['remove-tag-event', 'add-tag-event'])
</script>

<template>
	<div class="flex gap-3 overflow-x-auto">
		<div
			v-for="tag in modelValue"
			:key="tag.categoryId"
			class="bg-blue text-white p-1 px-2 flex gap-1 rounded-xl hover:cursor-pointer"
		>
			<XCircleIcon
				v-if="removable"
				@click="$emit('remove-tag-event', tag)"
				class="h-6 w-6 place-self-center"
			></XCircleIcon>
			<span
				@click="$emit('add-tag-event', tag)"
				class="text-lg truncate"
				>{{ tag.categoryName }}</span
			>
		</div>
	</div>
</template>
