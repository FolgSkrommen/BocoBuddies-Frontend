<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'
import { Review, User } from '../../api/schema'
import { store } from '../../store'

interface Props {
	user: User
}

const { user } = defineProps<Props>()

const reviews = ref<Review[]>()

try {
	const reviewsRes = await axios.get('/review/getByUser', {
		params: {
			userId: user.userId,
			isReciever: true,
		},
	})
	const data = reviewsRes.data as Review[]
	reviews.value = data
} catch (error: any) {
	store.dispatch('error', error.message)
}
</script>

<template></template>
