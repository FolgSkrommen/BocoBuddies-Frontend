<script setup lang="ts">
import { Item } from '../api/schema'
import BaseBtn from '../components/base/BaseBtn.vue'
import Card from './Card.vue'

const emit = defineEmits(['load-more-items'])
const loadMoreItems = () => {
	emit('load-more-items')
}

interface Props {
	edit?: boolean
	items: Array<Item>
	searchHits: string
	redirect: string
	renderLoadButton?: boolean
}
const { edit, items, searchHits, redirect, renderLoadButton } =
	defineProps<Props>()
</script>

<template>
	<div>
		<!--List component-->
		<p class="align-middle">{{ searchHits }}</p>
		<div class="grid gap-4 grid-cols-2 md:grid-cols-3 grid-flow-row">
			<div v-for="item in items">
				<Card class="h-min row-end-auto">
					<router-link
						:to="`/${redirect}/${item.itemId}`"
						class="grid gap-2"
					>
						<img
							v-if="item.images?.length > 0"
							class="rounded-t-xl object-cover h-44 w-full"
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
						</div>
					</router-link>
					<BaseBtn
						class="h-fit w-fit"
						:to="`/edit-item/${item.itemId}`"
						v-if="edit"
						>Rediger</BaseBtn
					>
				</Card>
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
	</div>
</template>
