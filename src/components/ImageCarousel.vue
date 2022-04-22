<script setup lang="ts">
interface Props {
	images: string[]
}

const { images } = defineProps<Props>()
</script>

<template>
	<div class="flex">
		<img v-for="url in images" :src="url" />
	</div>
</template>
