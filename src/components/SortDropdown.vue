<script setup lang="ts">
import BaseDropdown, { Alternative } from '../components/base/BaseDropdown.vue'

interface Props {
	sortAlts: Array<Alternative>
	modelValue: number
}

const emit = defineEmits(['update:modelValue'])
const updateValue = (event: Event) => {
	emit('update:modelValue', (event.target as HTMLInputElement).value)
}
const { modelValue, sortAlts } = defineProps<Props>()
</script>

<template>
	<div class="flex items-center justify-center h-full">
		<!--Sort dropdown-->
		<BaseDropdown
			:alternatives="sortAlts"
			v-model.number="modelValue"
			class="bottom-12 fixed my-2"
			data-testid="sort-dropdown"
			@input="updateValue"
		></BaseDropdown>
	</div>
</template>
