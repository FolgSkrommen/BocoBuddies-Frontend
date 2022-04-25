<script setup lang="ts">
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
		<label class="text-slate-500 text-left" data-testid="label">{{
			label
		}}</label>
		<input
			class="bg-slate-100 rounded-xl p-3 shadow-lg"
			:class="disabled ? 'bg-slate-300 shadow-none' : ''"
			:disabled="disabled"
			:value="modelValue"
			@input="updateValue"
			:type="type ?? 'text'"
			data-testid="input"
		/>

		<p class="text-red text-xs w-full text-center">{{ error }}</p>
	</div>
</template>
