<script setup lang="ts">
import { XCircleIcon } from '@heroicons/vue/solid'
import { Category } from '../api/schema'

interface Props {
	modelValue: Category[]
	removable?: boolean
	color: String
}
let { modelValue, removable } = defineProps<Props>()
const emit = defineEmits(['remove-category-event', 'add-category-event'])
</script>

<template>
	<div class="flex gap-3 overflow-x-auto">
		<div
			v-for="category in modelValue"
			:key="category.categoryId"
			class="text-white hover:bg-blue-800 hover:text-white transition-colors p-1 px-2 flex gap-1 rounded-full hover:cursor-pointer"
			:class="color"
			data-testid="item-instance"
		>
			<XCircleIcon
				v-if="removable"
				@click="emit('remove-category-event', category)"
				class="h-6 w-6 place-self-center"
				data-testid="x-icon"
			></XCircleIcon>
			<span
				@click="emit('add-category-event', category)"
				class="truncate font-light"
				data-testid="span"
				>{{ category.categoryName }}</span
			>
		</div>
	</div>
</template>
