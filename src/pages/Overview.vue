<script setup lang="ts">
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
</script>

<template>
	<div class="flex w-full justify-left gap-4 mb-5">
		<router-link :to="{ name: 'myItems' }">
			<button>Mine gjenstander</button>
		</router-link>
		<router-link :to="{ name: 'myLoans' }">
			<button>Mine lån</button>
		</router-link>
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
