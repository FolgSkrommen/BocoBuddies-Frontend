<script setup lang="ts">
import BaseInput from '../components/base/BaseInput.vue'
import BaseBtn from '../components/base/BaseBtn.vue'

const emit = defineEmits(['update:modelValue', 'search-and-reset'])
const updateValue = (event: Event) => {
	emit('update:modelValue', (event.target as HTMLInputElement).value)
}
const search = () => {
	emit('search-and-reset')
}
interface Props {
	modelValue: string
}
const { modelValue } = defineProps<Props>()
</script>

<template>
	<!--Text search input component-->
	<div class="flex">
		<BaseInput
			@keyup.enter="search"
			@input="updateValue"
			v-model="modelValue"
			:modelValue="modelValue"
			data-testid="search-field"
		></BaseInput>
		<BaseBtn @click="search" data-testid="search-button">Søk</BaseBtn>
	</div>
</template>
