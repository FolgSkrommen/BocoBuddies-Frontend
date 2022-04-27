<script setup lang="ts">
import Card from '../components/Card.vue'
import { StarIcon, CheckCircleIcon } from '@heroicons/vue/solid'
import BaseBtn from '../components/base/BaseBtn.vue'
import ItemInfo, { Item } from '../components/ItemInfo.vue'
import { Calendar, DatePicker } from 'v-calendar'
import 'v-calendar/dist/style.css'
import { computed, ref } from 'vue'
import UserCard, { User } from '../components/UserCard.vue'
import RateUserPopup from '../components/RateUserPopup.vue'
import LoadingIndicator from '../components/base/LoadingIndicator.vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const { params } = useRoute()
const id = parseInt(params.id as string)

interface Loan {
	startDate: string
	endDate: string
	returned: boolean
	active: boolean
	creationDate: string
	chatId: number
	loanId: number
}

interface LoanResponse {
	item: Item
	user: User
	loan: Loan
}

type Status = 'loading' | 'loaded' | 'error'

const status = ref<Status>()
const errorMessage = ref()

const item = ref<Item>()
const loaner = ref<User>()
const loan = ref<Loan>()

const range = computed(() => {
	if (!loan.value) return
	return {
		start: new Date(loan.value.startDate),
		end: new Date(loan.value.endDate),
	}
})

interface ItemResponse {
	item: Item
	lender: User
}

async function getItem() {
	status.value = 'loading'
	try {
		const res = await axios.get('/item', {
			method: 'GET',
			params: {
				id,
			},
		})
		const data: ItemResponse = res.data
		console.log(data)
		item.value = data.item
		loaner.value = data.lender
		status.value = 'loaded'
	} catch (error) {
		status.value = 'error'
		errorMessage.value = error
	}
}

async function getLoan() {
	status.value = 'loading'
	try {
		const res = await axios.get('/loan', {
			method: 'GET',
			params: {
				loanId: id,
				isLender: true,
			},
		})
		const data: LoanResponse = res.data
		item.value = data.item
		loaner.value = data.user
		loan.value = data.loan
		status.value = 'loaded'
	} catch (error) {
		getItem()
	}
}
getLoan()
const showRateUserPopup = ref(false)
</script>

<template>
	<LoadingIndicator v-if="status === 'loading'" />
	<div v-if="status === 'loaded' && loaner && item">
		<RateUserPopup
			v-show="showRateUserPopup"
			@exit="showRateUserPopup = false"
			:user="loaner"
		/>
		<div class="grid gap-4">
			<h1 class="text-4xl font-bold">{{ item.name }}</h1>

			<div v-if="loan && loan.active" class="grid gap-4">
				<div v-if="loan.returned" class="grid gap-4">
					<p class="font-bold text-lg">Objektet er returnert</p>
					<BaseBtn
						@click="showRateUserPopup = true"
						v-if="loan.returned"
						>Gi tilbakemelding</BaseBtn
					>
					<BaseBtn color="red">Slett</BaseBtn>
				</div>
				<div>
					<p class="font-bold text-lg">Låneperiode</p>
					<p>
						{{ new Date(item.availableFrom).toLocaleString() }} -
						{{ new Date(item.availableTo).toLocaleString() }}
					</p>
				</div>
				<DatePicker
					class="place-self-center pointer-events-none"
					v-model="range"
					is-range
					:contenteditable="false"
					color="green"
					locale="no"
				/>
				<UserCard :user="loaner" color="green" />
				<BaseBtn>Gå til chat</BaseBtn>
			</div>
			<BaseBtn v-else color="red">Slett</BaseBtn>
			<ItemInfo :item="item" />
		</div>
	</div>
	<p v-if="status === 'error'">{{ errorMessage }}</p>
</template>
