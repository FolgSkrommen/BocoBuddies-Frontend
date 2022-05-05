<script setup lang="ts">
import { Alternative } from '../../api/schema'

interface Props {
	modelValue: number
	alternatives: Alternative[]
}

let { modelValue, alternatives } = defineProps<Props>()

const emit = defineEmits(['update:modelValue', 'sort-clicked'])
const updateValue = (event: Event) => {
	emit('update:modelValue', (event.target as HTMLInputElement).value)
	emit('sort-clicked')
}
</script>

<template>
	<div>
		<select
			v-model="modelValue"
			@input="updateValue"
			class="border-2 border-slate-400 rounded-xl w-full bg-slate-200 items-center animation-none p-1"
			data-testid="dropdown-container"
		>
			<option
				v-for="element in alternatives"
				:value="element.id"
				:key="element.id"
				data-testid="dropdown-option"
			>
				{{ element.alt }}
			</option>
		</select>
	</div>
</template>
