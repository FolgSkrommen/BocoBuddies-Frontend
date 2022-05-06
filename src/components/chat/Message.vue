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
			class="bg-blue-500 text-white px-4 py-3 rounded-full overflow-auto"
			v-if="receive"
		>
			<slot></slot>
		</div>
		<div
			class="bg-slate-300 text-black px-4 py-3 rounded-full overflow-auto"
			v-else
		>
			<slot></slot>
		</div>
	</div>
</template>
