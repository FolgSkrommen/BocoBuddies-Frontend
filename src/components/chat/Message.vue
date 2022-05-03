<script setup lang="ts">
import Card from '../components/Card.vue'
import { ref } from 'vue'

interface Props {
	receive: boolean
}

const { receive } = defineProps<Props>()
</script>
<template>
	<div class="grid">
		<div
			class="bg-blue-500 text-white px-4 py-3 rounded-full overflow-auto my-5 max-w-[80%] place-self-end"
			v-if="receive"
		>
			<slot></slot>
		</div>
		<div
			class="bg-slate-400 text-black px-4 py-3 rounded-full overflow-auto my-5 max-w-[80%] place-self-start"
			v-else
		>
			<slot></slot>
		</div>
	</div>
</template>
