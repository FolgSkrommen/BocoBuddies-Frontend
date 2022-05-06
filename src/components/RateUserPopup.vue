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
	user?: User
	loan?: Loan
}

const { user, loan } = defineProps<Props>()

const emit = defineEmits(['exit', 'confirm'])

const rating = ref<number>(-1)
const comment = ref('')

function getDateAndTime() {
	let tzoffset = new Date().getTimezoneOffset() * 60000 //offset in milliseconds
	return new Date(Date.now() - tzoffset).toISOString().slice(0, -1)
}

async function handleRate() {
	if (rating.value === -1) return
	if (!loan) return
	if (!loan.loanId) return
	if (!user) return
	rating.value++
	const review: PostReviewRequest = {
		loanId: loan.loanId,
		isOwner: user.userId === loan.loaner,
		rating: rating.value,
		description: comment.value,
		date: getDateAndTime(),
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
			:src="user?.profilePicture"
			:alt="user?.username"
			data-testid="profile-img"
		/>
		<p
			class="place-self-center font-bold text-lg"
			data-testid="last-first-name"
		>
			{{ user?.firstName }} {{ user?.lastName }}
		</p>
		<div class="flex gap-2 place-self-center">
			<StarIcon
				v-for="(icon, i) in 5"
				@click="rating = i"
				class="h-8 w-8 bg-black text-white rounded-full p-1 cursor-pointer"
				:class="i < rating + 1 ? 'text-yellow-400' : ''"
			/>
		</div>
		<BaseLabel
			modelValue="Kommentar"
			data-testid="comment-label"
		></BaseLabel>
		<textarea
			class="p-2 bg-slate-100 rounded-xl border"
			v-model="comment"
			rows="4"
			data-testid="comment"
		></textarea>
		<div class="flex justify-between">
			<BaseBtn @click="emit('exit')" color="gray" data-testid="cancel-btn"
				>Avbryt</BaseBtn
			>
			<BaseBtn
				@click="handleRate"
				:disabled="rating === -1"
				data-testid="rating-btn"
				>Ranger</BaseBtn
			>
		</div>
	</BasePopup>
</template>
