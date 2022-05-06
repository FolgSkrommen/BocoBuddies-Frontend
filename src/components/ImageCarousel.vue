<script setup lang="ts">
interface Props {
	images: string[]
	alt?: string
}

const { images, alt } = defineProps<Props>()
</script>

<template>
	<div class="flex overflow-x-scroll snap-x gap-4 p-4">
		<img
			class="rounded-xl snap-center max-h-96 object-cover"
			v-for="src in images"
			:src="src"
			:alt="alt ? alt : ''"
			data-testid="carousel"
		/>
	</div>
</template>
