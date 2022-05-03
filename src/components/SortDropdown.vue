<script setup lang="ts">
import { Alternative } from '../api/schema'
import BaseDropdown from '../components/base/BaseDropdown.vue'

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
	<!--Sort dropdown-->
	<BaseDropdown
		:alternatives="sortAlts"
		v-model.number="modelValue"
		class="w-full"
		data-testid="sort-dropdown"
		@input="updateValue"
	/>
</template>
