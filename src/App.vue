<script setup lang="ts">
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import NavBar from './components/NavBar.vue'
</script>

<template>
	<div>
		<div class="container mx-auto p-4">
			<router-view></router-view>
		</div>
		<div class="h-14"></div>
		<NavBar />
	</div>
</template>
