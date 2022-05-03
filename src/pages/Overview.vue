<script setup lang="ts">
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
</script>

<template>
	<div class="flex w-full justify-left gap-2 mb-5">
		<router-link class="flex-1" :to="{ name: 'myItems' }">
			Mine gjenstander
		</router-link>
		<router-link class="flex-1" :to="{ name: 'myLoans' }">
			Mine lån
		</router-link>
	</div>
	<router-view />
</template>

<style scoped>
a {
	@apply py-2 px-4 rounded bg-slate-300 text-slate-900;
}
.router-link-active {
	@apply py-2 px-4 rounded bg-blue-500 text-white;
}
</style>
