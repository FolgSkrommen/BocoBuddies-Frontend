<script setup lang="ts">
interface Props {
	images: string[]
}

const { images } = defineProps<Props>()
</script>

<template>
	<div class="flex overflow-x-scroll snap-x gap-4 p-4">
		<img
			class="rounded-xl snap-center max-h-96"
			v-for="url in images"
			:src="url"
		/>
	</div>
</template>
