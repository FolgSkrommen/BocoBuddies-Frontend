<script setup lang="ts">
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
</script>

<template>
	<div class="flex w-full justify-left gap-4 mb-5">
		<RouterLink class="p-4 text-4xl" :to="{ name: 'myItems' }"
			>Mine gjenstander</RouterLink
		>
		<RouterLink class="p-4 text-4xl" :to="{ name: 'myLoans' }"
			>Mine lån</RouterLink
		>
	</div>
	<router-view />
</template>

<style scoped>
.router-link-active {
	background-color: #004aad;
	color: white;
	border-radius: 10px;
}
</style>
