<script setup lang="ts">
import BaseBtn from '../components/base/BaseBtn.vue'
import { CheckCircleIcon, StarIcon } from '@heroicons/vue/solid'
import BasePopup from '../components/base/BasePopup.vue'
import { ref } from 'vue'
import axios from 'axios'
import { User, Loan } from '../api/schema'
import { PostReviewRequest } from '../api/review'
import BaseLabel from './base/BaseLabel.vue'
import { store } from '../store'
interface Props {
	user: User
	loan: Loan
}

const { user, loan } = defineProps<Props>()

const emit = defineEmits(['exit', 'confirm'])

const rating = ref<number>(-1)
const comment = ref('')

async function handleRate() {
	if (rating.value === -1) return
	//TODO: ADD Method
	if (!loan.loanId) return
	const review: PostReviewRequest = {
		loanId: loan.loanId,
		isOwner: user.userId === loan.loaner,
		rating: rating.value,
		description: comment.value,
		date: new Date().toISOString(),
	}
	try {
		const res = await axios.post('/review', review)
	} catch (error: any) {
		console.log(error)
		store.dispatch('error', error.message)
	}
	emit('confirm')
}
</script>

<template>
	<BasePopup @exit="emit('exit')">
		<img
			class="w-16 h-16 rounded-full place-self-center"
			:src="user.profilePicture"
			:alt="user.username"
		/>
		<p class="place-self-center font-bold text-lg">
			{{ user.firstName }} {{ user.lastName }}
		</p>
		<div class="flex gap-2 place-self-center">
			<StarIcon
				v-for="(icon, i) in 5"
				@click="rating = i + 1"
				class="h-8 w-8 bg-black text-white rounded-full p-1"
				:class="i < rating + 1 ? 'text-yellow-400' : ''"
			/>
		</div>
		<BaseLabel modelValue="Kommentar"></BaseLabel>
		<textarea class="p-2" v-model="comment" rows="4"></textarea>
		<div class="flex justify-between">
			<BaseBtn @click="emit('exit')" color="gray">Avbryt</BaseBtn>
			<BaseBtn @click="handleRate" :disabled="rating === -1"
				>Ranger</BaseBtn
			>
		</div>
	</BasePopup>
</template>
