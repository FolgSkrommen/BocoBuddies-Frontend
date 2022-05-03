<script setup lang="ts">
import { Item } from '../api/schema'
import BaseBtn from '../components/base/BaseBtn.vue'
import Card from './Card.vue'

const emit = defineEmits(['load-more-items'])
const loadMoreItems = () => {
	emit('load-more-items')
}
interface Props {
	items: Array<Item>
	searchHits: string
	redirect: string
	renderLoadButton?: boolean
}
const { items, searchHits, redirect, renderLoadButton } = defineProps<Props>()
</script>

<template>
	<div>
		<!--List component-->
		<p class="align-middle">{{ searchHits }}</p>
		<div class="grid gap-4 sm:grid-cols-2">
			<router-link
				class="bg-slate-100 rounded-lg shadow-lg"
				v-for="item in items"
				:to="`/${redirect}/${item.itemId}`"
			>
				<Card>
					<img
						v-if="item.images?.length > 0"
						class="w-32 rounded-l-lg object-cover"
						:src="item.images[0]"
						:alt="item.name"
					/>
					<div class="p-2 grid">
						<p class="font-bold text-lg">
							{{ item.name }}
						</p>
						<div>
							<p>{{ item.price }}kr / {{ item.priceUnit }}</p>
						</div>
						<p class="text-slate-500">
							{{ item.availableFrom }} -
							{{ item.availableTo }}
						</p>
						<p class="text-slate-500">
							{{ item.postalCode }}, {{ item.address }}
						</p>
					</div>
				</Card>
			</router-link>
		</div>
		<div class="flex justify-center my-10">
			<BaseBtn
				@click="loadMoreItems"
				v-if="renderLoadButton"
				data-testid="load-more-items-button"
				>Last inn flere</BaseBtn
			>
		</div>
	</div>
</template>
