<script setup lang="ts">
import { StarIcon, CheckCircleIcon } from '@heroicons/vue/solid'
import Card from '../components/Card.vue'

export interface User {
	userId: number
	firstName: string
	lastName: string
	username: string
	rating: number
	pictureUrl: string
	profilePicture?: string
	trusted: boolean
}

interface Props {
	user: User
	color?: 'green'
	showRating?: boolean
}
const { user, color, showRating } = defineProps<Props>()
</script>

<template>
	<Card :color="color">
		<div class="flex gap-4 w-full justify-between">
			<img
				class="w-16 h-16 rounded-full object-cover"
				:src="user.profilePicture"
			/>
			<div class="grid gap-2">
				<p class="font-bold text-lg">
					{{ user.firstName }} {{ user.lastName }}
				</p>
				<p class="text-slate-500">@{{ user.username }}</p>
				<div v-if="showRating" class="flex gap-2">
					<StarIcon
						v-for="icon in Math.floor(user.rating)"
						class="h-6 w-6 text-yellow-400"
					/>
				</div>
			</div>
			<span class="flex-grow"></span>
			<CheckCircleIcon
				class="h-8 w-8 justify-self-start text-blue"
				v-if="user.trusted"
			/>
		</div>
	</Card>
</template>
