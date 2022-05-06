<script setup lang="ts">
import BaseBtn from '../components/base/BaseBtn.vue'
import ItemInfo from '../components/ItemInfo.vue'
import { DatePicker } from 'v-calendar'
import 'v-calendar/dist/style.css'
import UserCard from '../components/UserCard.vue'
import { computed, ref } from 'vue'
import { ChevronLeftIcon } from '@heroicons/vue/outline'
import RateUserPopup from '../components/RateUserPopup.vue'
import LoadingIndicator from '../components/base/LoadingIndicator.vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import { Item, Loan, User } from '../api/schema'
import { GetLoanRequest, GetLoanResponse } from '../api/loan'

const { params } = useRoute()
const id = parseInt(params.id as string)

type Status = 'loading' | 'loaded' | 'error'

const status = ref<Status>()
const errorMessage = ref()
const hasReviewed = ref<boolean>(false)
const item = ref<Item>()
const lender = ref<User>()
const loan = ref<Loan>()

const range = computed(() => {
	if (!loan.value) return
	return {
		start: new Date(loan.value.start),
		end: new Date(loan.value.end),
	}
})

async function hasReviewedCheck() {
	const res = await axios.get('/review/hasReviewed', {
		params: {
			loanId: id,
		},
	})
	console.log(res.data)
	hasReviewed.value = res.data
}

async function getLoan() {
	status.value = 'loading'
	try {
		const params: GetLoanRequest = {
			loanId: id,
			isLender: true,
		}
		const res = await axios.get('/loan', {
			params,
		})
		const data: GetLoanResponse = res.data
		console.log(data)

		item.value = data.item
		lender.value = data.user
		loan.value = data.loan
		console.log(loan.value)

		status.value = 'loaded'
	} catch (error) {
		status.value = 'error'
		errorMessage.value = error
	}
}

function confirmReview() {
	hasReviewed.value = true
	showRateUserPopup.value = false
}
getLoan()
hasReviewedCheck()
const showRateUserPopup = ref(false)
</script>

<template>
	<LoadingIndicator v-if="status === 'loading'" />
	<div v-if="status === 'loaded' && item && loan && lender">
		<RateUserPopup
			v-show="showRateUserPopup"
			@exit="showRateUserPopup = false"
			@confirm="confirmReview()"
			:user="lender"
			:loan="loan"
		/>
		<div class="grid gap-4">
			<div class="flex gap-4">
				<router-link
					to="/overview"
					data-bs-toggle="tooltip"
					data-bs-placement="bottom"
					title="Tilbake til mine gjenstander"
				>
					<ChevronLeftIcon class="h-12 w-12" />
				</router-link>
				<h1>{{ item.name }}</h1>
			</div>
			<div v-if="!loan.returned" class="grid gap-4">
				<div>
					<p class="font-bold text-lg">Låneperiode</p>
					<p>
						{{ new Date(loan.start).toLocaleString() }} -
						{{ new Date(loan.end).toLocaleString() }}
					</p>
				</div>
				<DatePicker
					class="place-self-center pointer-events-none"
					v-model="range"
					is-range
					:contenteditable="false"
					color="red"
					locale="no"
				/>
			</div>
			<BaseBtn :to="'/chat/' + loan.chatId">Gå til chat</BaseBtn>
			<div v-if="loan.returned" class="grid gap-4">
				<p class="font-bold text-lg">Objektet er returnert</p>
				<BaseBtn
					@click="showRateUserPopup = true"
					v-if="loan.returned && !hasReviewed"
					>Gi tilbakemelding</BaseBtn
				>
				<p class="font-bold text-lg" v-else>Tilbakemelding levert</p>
			</div>
			<ItemInfo :item="item" />
			<UserCard
				:user="lender"
				show-rating
				:to="`/user/${lender.userId}`"
			/>
		</div>
	</div>
	<p v-if="status === 'error'">{{ errorMessage }}</p>
</template>
