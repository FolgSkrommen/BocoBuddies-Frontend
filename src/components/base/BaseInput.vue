<script setup lang="ts">
import { string } from 'yup'
import BaseLabel from './BaseLabel.vue'
const props = defineProps({
	modelValue: [String, Number],
	label: String,
	disabled: Boolean,
	type: String,
	error: String,
	placeholder: String,
})

const emit = defineEmits(['update:modelValue'])

const updateValue = (event: Event) => {
	emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template>
	<div class="grid">
		<BaseLabel v-if="label" :model-value="label" />

		<input
			class="rounded-xl"
			:class="disabled ? 'bg-slate-300 shadow-none' : ''"
			:disabled="disabled"
			:value="modelValue"
			@input="updateValue"
			:type="type ?? 'text'"
			:placeholder="placeholder ?? ''"
			data-testid="input"
		/>

		<p v-show="error" class="text-red-700 text-xs w-full text-center">
			{{ error }}
		</p>
	</div>
</template>
