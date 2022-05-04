<script setup lang="ts">
import BaseBtn from '../components/base/BaseBtn.vue'
import ItemInfo from '../components/ItemInfo.vue'
import 'v-calendar/dist/style.css'
import UserCard from '../components/UserCard.vue'
import { ref } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import { store } from '../store'
import LoadingIndicator from '../components/base/LoadingIndicator.vue'
import { Category, Item, User } from '../api/schema'
import { GetItemRequest, GetItemResponse } from '../api/item'
import { PostChatRequest, PostChatResponse } from '../api/chat'
import ImageCarousel from '../components/ImageCarousel.vue'

const router = useRouter()
const { params } = useRoute()
const itemId = parseInt(params.id as string)

const item = ref<Item>()
const newItem = ref<Item>()

const lender = ref<User>()

type GetStatus = 'loading' | 'loaded' | 'error'
const getStatus = ref<GetStatus>()
async function getItem() {
	getStatus.value = 'loading'
	const params: GetItemRequest = {
		itemId: itemId,
	}
	try {
		const res = await axios.get('/item', {
			params,
		})
		const data: GetItemResponse = res.data
		item.value = data.item
		newItem.value = data.item
		lender.value = data.lender
		getStatus.value = 'loaded'
	} catch (error: any) {
		getStatus.value = 'error'
		store.dispatch('error', error.message)
	}
}

getItem()

type PutStatus = 'sending' | 'success' | 'error'
const putStatus = ref<PutStatus>()
async function updateItem() {}
</script>

<template>
	<LoadingIndicator v-if="getStatus === 'loading'" />
	<div class="grid gap-4" v-if="newItem && getStatus === 'loaded'">
		<div>
			<h1>{{ newItem.name }}</h1>
		</div>
		<ImageCarousel :images="newItem.images" />
		<textarea
			class="w-full"
			rows="4"
			v-model="newItem.description"
		></textarea>
	</div>
</template>
