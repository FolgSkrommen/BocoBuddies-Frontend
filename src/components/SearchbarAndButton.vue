<script setup lang="ts">
import BaseInput from '../components/base/BaseInput.vue'
import BaseBtn from '../components/base/BaseBtn.vue'

const emit = defineEmits(['update:modelValue', 'search'])
const updateValue = (event: Event) => {
	emit('update:modelValue', (event.target as HTMLInputElement).value)
}
const search = () => {
	emit('search')
}
interface Props {
	modelValue: string
	error?: string
}
const { modelValue, error } = defineProps<Props>()
</script>

<template>
	<!--Text search input component-->
	<div class="flex gap-2 w-full">
		<BaseInput
			class="grow"
			@keyup.enter="search"
			@input="updateValue"
			v-model="modelValue"
			:modelValue="modelValue"
			data-testid="search-field"
			:error="error"
		></BaseInput>
		<BaseBtn @click="search" data-testid="search-button">Søk</BaseBtn>
	</div>
</template>
