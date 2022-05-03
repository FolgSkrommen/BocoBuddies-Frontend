<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import BaseBanner from './components/base/BaseBanner.vue'
import { store } from './store'
const { dispatch } = store
</script>

<template>
	<div>
		<div class="left-0 top-0 fixed w-full p-4 grid gap-4">
			<BaseBanner
				@exit="dispatch('hideBanner', 'error')"
				v-show="store.state.banners.error.show"
				type="error"
				:message="store.state.banners.error.message"
			/>
			<BaseBanner
				@exit="dispatch('hideBanner', 'info')"
				v-show="store.state.banners.info.show"
				type="info"
				:message="store.state.banners.info.message"
			/>
			<BaseBanner
				@exit="dispatch('hideBanner', 'success')"
				v-show="store.state.banners.success.show"
				type="success"
				:message="store.state.banners.success.message"
			/>
		</div>
		<div class="container mx-auto p-4">
			<router-view></router-view>
		</div>
		<div class="h-14"></div>
		<NavBar />
	</div>
</template>
