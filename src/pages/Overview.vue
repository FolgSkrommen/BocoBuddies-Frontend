<script setup lang="ts"></script>

<template>
	<div class="flex w-full justify-left gap-4 mb-4 text-center">
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
	@apply py-2 px-4 rounded-xl bg-slate-600 text-white hover:bg-blue-800 hover:text-white transition-colors;
}
.router-link-active {
	@apply py-2 px-4 rounded-xl bg-blue-500 text-white hover:bg-blue-800 transition-colors;
}
</style>
