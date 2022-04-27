<script setup lang="ts">
import BaseBtn from '../components/base/BaseBtn.vue'

interface Item {
	id: number
	image: string
	name: string
	price: number
	availableFrom: string
	availableTo: string
	priceUnit: string
	address: string
	postalCode: string
}

const emit = defineEmits(['load-more-items'])
const loadMoreItems = () => {
	emit('load-more-items')
}
interface Props {
	items: Array<Item>
	searchHits: string
	redirect: string
}
const { items, searchHits, redirect } = defineProps<Props>()
</script>

<template>
	<div>
		<!--List component-->
		<p class="align-middle">{{ searchHits }}</p>
		<div class="grid gap-4">
			<router-link
				class="bg-slate-100 rounded-lg shadow-lg"
				v-for="item in items"
				:to="`/${redirect}/${item.id}`"
			>
				<div class="flex gap-2">
					<img
						class="w-32 rounded-l-lg"
						:src="item.image"
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
				</div>
			</router-link>
		</div>
		<div class="flex justify-center my-10">
			<BaseBtn @click="loadMoreItems" data-testid="load-more-items-button"
				>Last inn flere</BaseBtn
			>
		</div>
	</div>
</template>