<script setup lang="ts">
import Card from '../Card.vue'
import { XIcon } from '@heroicons/vue/solid'

const emit = defineEmits(['exit'])
</script>

<template>
	<div
		class="bg-[rgb(0,0,0,0.5)] fixed w-full h-full top-0 left-0 grid place-items-center z-40"
	>
		<div class="min-w-[256px]">
			<Card>
				<div class="grid gap-4">
					<button @click="emit('exit')" class="place-self-end">
						<XIcon class="w-8 h-8" />
					</button>
					<slot></slot>
				</div>
			</Card>
		</div>
	</div>
</template>
