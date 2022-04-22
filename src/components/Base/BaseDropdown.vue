<script setup lang="ts">
interface Props {
	modelValue: string
	alternatives: [Alternative]
}
interface Alternative {
	alt: string
	id: number
}
let { modelValue, alternatives } = defineProps<Props>()

const emit = defineEmits(['update:modelValue'])
const updateValue = (event: Event) => {
	emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template>
	<div>
		<select
			v-model="modelValue"
			@input="updateValue"
			class="border-2 border-black rounded bg-gray-300 items-center"
		>
			<option
				v-for="element in alternatives"
				:value="element.id"
				:key="element.id"
			>
				{{ element.alt }}
			</option>
		</select>
	</div>
</template>
