<script setup lang="ts">
const props = defineProps({
	modelValue: String,
})
</script>

<template>
	<div class="grid">
		<label class="text-slate-800 text-left" data-testid="label">
			{{ modelValue }}
		</label>
	</div>
</template>
