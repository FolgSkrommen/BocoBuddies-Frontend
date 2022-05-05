<script setup lang="ts"></script>

<template>
	<div class="flex w-full justify-left gap-1 mb-1">
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
	@apply py-2 px-4 rounded-xl bg-slate-300 text-slate-900 hover:bg-blue-800 hover:text-white transition-colors;
}
.router-link-active {
	@apply py-2 px-4 rounded-xl bg-blue-500 text-white hover:bg-blue-800 transition-colors;
}
</style>
