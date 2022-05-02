<script setup lang="ts">
import { ref } from 'vue'
import LoadingIndicator from '../components/base/LoadingIndicator.vue'
import BaseBanner from '../components/base/BaseBanner.vue'

const errorMessage = ref()

type Status = 'loading' | 'loaded' | 'error'
const status = ref<Status>()

async function searchForFriends() {
	status.value = 'loading'
	try {
		status.value = 'loaded'
	} catch (error) {
		status.value = 'error'
		errorMessage.value = error
	}
}
</script>

<template>
	<div class="font-bold text-4xl">
		<LoadingIndicator v-if="status === 'loading'" />
		<h1></h1>
	</div>
</template>
