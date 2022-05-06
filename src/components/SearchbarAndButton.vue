<script setup lang="ts">
import { SearchIcon } from '@heroicons/vue/outline'

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
	label?: string
}
const { modelValue, error } = defineProps<Props>()
</script>

<template>
	<!--Text search input component-->
	<div class="flex w-full">
		<input
			v-model="modelValue"
			class="rounded-none grow rounded-l-xl"
			placeholder="Søk"
			data-testid="search-field"
			@input="updateValue"
			@keyup.enter="search"
			data-bs-toggle="tooltip"
			data-bs-placement="bottom"
			title="Søk"
		/>
		<button
			@click="search"
			class="rounded-l-none bg-green-600"
			data-testid="search-button"
			data-bs-toggle="tooltip"
			data-bs-placement="bottom"
			title="Søk"
		>
			<SearchIcon class="w-6" />
		</button>
	</div>
</template>
