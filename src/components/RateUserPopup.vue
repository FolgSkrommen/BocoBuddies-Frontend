<script setup lang="ts">
import BaseBtn from '../components/base/BaseBtn.vue'
import { CheckCircleIcon, StarIcon } from '@heroicons/vue/solid'
import BasePopup from '../components/base/BasePopup.vue'
import { ref } from 'vue'

export interface User {
	userId: number
	firstName: string
	lastName: string
	username: string
	rating: number
	pictureUrl: string
	trusted: boolean
}

interface Props {
	lender: User
}

const { lender } = defineProps<Props>()

const emit = defineEmits(['exit'])

const rating = ref<number>(-1)
const comment = ref('')

function handleRate() {
	if (rating.value === -1) return
	//TODO: ADD Method
	emit('exit')
}
</script>

<template>
	<div>
		<BasePopup @exit="emit('exit')">
			<img
				class="w-16 h-16 rounded-full place-self-center"
				:src="lender.pictureUrl"
				:alt="lender.username"
			/>
			<p class="place-self-center font-bold text-lg">
				{{ lender.firstName }} {{ lender.lastName }}
			</p>
			<div class="flex gap-2 place-self-center">
				<StarIcon
					v-for="(icon, i) in 5"
					@click="rating = i"
					class="h-8 w-8 bg-black text-white rounded-full p-1"
					:class="i < rating + 1 ? 'text-yellow-400' : ''"
				/>
			</div>
			<textarea class="p-2" v-model="comment" rows="4"></textarea>
			<div class="flex justify-between">
				<BaseBtn @click="emit('exit')" color="gray">Cancel</BaseBtn>
				<BaseBtn @click="handleRate" :disabled="rating === -1"
					>Rate</BaseBtn
				>
			</div>
		</BasePopup>
	</div>
</template>