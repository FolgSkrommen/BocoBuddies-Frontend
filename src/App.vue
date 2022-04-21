<script setup lang="ts">
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import NavBar from './components/NavBar.vue'
import BaseBtn from './components/Base/BaseBtn.vue'
import BaseInput from './components/Base/BaseInput.vue'
import { ref } from 'vue'
const test = ref('')
</script>

<template>
	<div>
		<NavBar />
		<div class="container mx-auto p-4">
			<router-view></router-view>
		</div>
	</div>
</template>
