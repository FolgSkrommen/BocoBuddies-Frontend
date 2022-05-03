<script setup lang="ts">
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
</script>

<template>
	<div class="flex w-full justify-left gap-4 mb-5">
		<router-link :to="{ name: 'myItems' }"> Mine gjenstander </router-link>
		<router-link :to="{ name: 'myLoans' }"> Mine lån </router-link>
	</div>
	<router-view />
</template>

<style scoped>
a {
	@apply py-2 px-4 rounded-xl bg-slate-300 text-slate-900;
}
.router-link-active {
	@apply py-2 px-4 rounded-xl bg-blue-500 text-white;
}
</style>
