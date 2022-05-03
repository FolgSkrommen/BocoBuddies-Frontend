<script setup lang="ts">
import BaseLabel from './BaseLabel.vue'
const props = defineProps({
	modelValue: [String, Number],
	label: String,
	disabled: Boolean,
	type: String,
	error: String,
})

const emit = defineEmits(['update:modelValue'])

const updateValue = (event: Event) => {
	emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template>
	<div class="grid">
		<BaseLabel :model-value="label" />

		<input
			:class="disabled ? 'bg-slate-300 shadow-none' : ''"
			:disabled="disabled"
			:value="modelValue"
			@input="updateValue"
			:type="type ?? 'text'"
			data-testid="input"
		/>

		<p class="text-red-700 text-xs w-full text-center">{{ error }}</p>
	</div>
</template>
