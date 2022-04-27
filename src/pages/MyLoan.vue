<script setup lang="ts">
import Card from '../components/Card.vue'
import { StarIcon, CheckCircleIcon } from '@heroicons/vue/solid'
import BaseBtn from '../components/base/BaseBtn.vue'
import ItemInfo, { Item } from '../components/ItemInfo.vue'
import { Calendar, DatePicker } from 'v-calendar'
import 'v-calendar/dist/style.css'
import UserCard, { User } from '../components/UserCard.vue'
import { computed, ref } from 'vue'
import RateUserPopup from '../components/RateUserPopup.vue'
import LoadingIndicator from '../components/base/LoadingIndicator.vue'
import axios from 'axios'
import { useRoute } from 'vue-router'

const { params } = useRoute()
const id = params.id as string

interface Loan {
	startDate: string
	endDate: string
	returned: boolean
	active: boolean
}

interface LoanResponse {
	item: Item
	lender: User
	loan: Loan
}

type Status = 'loading' | 'loaded' | 'error'

const status = ref<Status>()
const errorMessage = ref()

const item = ref<Item>()
const lender = ref<User>()
const loan = ref<Loan>()

const range = computed(() => {
	if (!loan.value) return
	return {
		start: new Date(loan.value.startDate),
		end: new Date(loan.value.endDate),
	}
})

async function getLoan() {
	status.value = 'loading'
	try {
		const res = await axios.get('/loan', {
			method: 'GET',
			params: {
				id,
			},
		})
		const data: LoanResponse = res.data
		console.log(data)
		item.value = data.item
		lender.value = data.lender
		status.value = 'loaded'
	} catch (error) {
		status.value = 'error'
		errorMessage.value = error
	}
}

const showRateUserPopup = ref(false)
getLoan()
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
			<h1 class="text-4xl font-bold">{{ item.name }}</h1>
			<div v-if="!loan.returned" class="grid gap-4">
				<div>
					<p class="font-bold text-lg">Låneperiode</p>
					<p>
						{{ new Date(item.availableFrom).toLocaleString() }} -
						{{ new Date(item.availableTo).toLocaleString() }}
					</p>
				</div>
				<DatePicker
					class="place-self-center pointer-events-none -z-10"
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
		<UserCard :user="lender" />
	</div>
	<p v-if="status === 'error'">{{ errorMessage }}</p>
</template>
