<script setup lang="ts">
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import NavBar from './components/NavBar.vue'
import BaseDropdown from './components/Base/BaseDropdown.vue'
import Card from './components/Card.vue'
import { ref } from 'vue'
import { HomeIcon, ChatIcon, UserIcon, PlusIcon } from '@heroicons/vue/solid'
</script>

<template>
	<div>
		<NavBar />
		<div class="container mx-auto p-4">
			<router-view></router-view>
		</div>
	</div>
</template>
