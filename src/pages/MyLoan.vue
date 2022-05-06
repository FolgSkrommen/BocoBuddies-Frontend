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
getLoan()
const showRateUserPopup = ref(false)
</script>

<template>
	<LoadingIndicator v-if="status === 'loading'" />
	<div v-if="status === 'loaded' && item && loan && lender">
		<RateUserPopup
			v-show="showRateUserPopup"
			@exit="showRateUserPopup = false"
			:user="lender"
		/>
		<div class="grid gap-4">
			<div class="flex gap-2">
				<router-link class="place-sel" to="/overview/items">
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
			<BaseBtn v-if="!loan.returned">Gå til chat</BaseBtn>
			<BaseBtn v-if="!loan.returned" color="red">Avlys</BaseBtn>
			<div v-if="loan.returned" class="grid gap-4">
				<p class="font-bold text-lg">Objektet er returnert</p>
				<BaseBtn @click="showRateUserPopup = true" v-if="loan.returned"
					>Gi tilbakemelding</BaseBtn
				>
			</div>
			<ItemInfo :item="item" />
		</div>
		<UserCard :user="lender" show-rating />
	</div>
	<p v-if="status === 'error'">{{ errorMessage }}</p>
</template>
