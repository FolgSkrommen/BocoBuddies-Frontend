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
	<div class="flex flex-col">
		<label class="text-slate-500 p-2">{{ label }}</label>
		<input
			class="bg-slate-100 rounded-xl py-2 px-2 shadow-lg"
			:class="disabled ? 'bg-gray-300' : ''"
			:disabled="disabled"
			:value="modelValue"
			@input="updateValue"
			:type="type ?? 'text'"
		/>

    <p class=" text-red-500 text-xs"> {{error}} </p>
	</div>
</template>
