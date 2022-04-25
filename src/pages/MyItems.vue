<script setup lang="ts">
import Card from '../components/Card.vue'
import FloatingBtn from '../components/base/FloatingBtn.vue'
import { PlusIcon } from '@heroicons/vue/solid'
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
</script>

<template>
	<div>
		<h1>Mine Gjenstander</h1>
		<FloatingBtn to="/item/register" />
	</div>
</template>
