<script setup lang="ts">
import Card from '../Card.vue'
import { XIcon } from '@heroicons/vue/solid'

const emit = defineEmits(['exit'])
</script>

<template>
	<div
		class="bg-[rgb(0,0,0,0.5)] fixed w-full h-full top-0 left-0 grid place-items-center z-40 overflow-y-auto"
	>
		<div class="min-w-[256px] mb-24 mt-8 md:mt-24">
			<Card data-testid="card">
				<div class="grid gap-4 overflow-y-auto p-2">
					<div
						class="place-self-end w-8 h-8 cursor-pointer"
						data-bs-toggle="tooltip"
						data-bs-placement="bottom"
						title="Lukk vindu"
					>
						<XIcon @click="emit('exit')" data-testid="icon"></XIcon>
					</div>

					<slot></slot>
				</div>
			</Card>
		</div>
	</div>
</template>
