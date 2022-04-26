<script setup lang="ts">
import { computed } from 'vue'
import ImageCarousel from '../components/ImageCarousel.vue'
import { GoogleMap, Marker, Circle } from 'vue3-google-map'
import { Calendar, DatePicker } from 'v-calendar'

export interface Filter {
	name: string
	value: string
}

export interface Position {
	lat: number
	lng: number
}

export interface Item {
	name: string
	description: string
	price: number
	priceUnit: string
	postalcode: string
	address: string
	position: Position
	images: string[]
	availableFrom: string
	availableTo: string
	categories: string[]
	filters: Filter[]
}
interface Props {
	item: Item
}

let { item } = defineProps<Props>()

function randomCenter(position: Position) {
	const newPosition: Position = {
		lat: position.lat + Math.random() * 0.004 - 0.002,
		lng: position.lng + Math.random() * 0.004 - 0.002,
	}
	return newPosition
}

const range = computed(() => ({
	start: new Date(item.availableFrom),
	end: new Date(item.availableTo),
}))
</script>

<template>
	<div class="grid gap-4">
		<ImageCarousel :images="item.images" />
		<p>{{ item.description }}</p>
		<div>
			<p class="font-bold text-lg">Pris</p>
			<p>{{ item.price }} / {{ item.priceUnit }}</p>
		</div>
		<div>
			<p class="font-bold text-lg">Kategori</p>
			<div class="flex gap-4">
				<div
					class="flex gap-4"
					v-for="(category, i) in item.categories"
				>
					<p v-if="i">></p>
					<p>{{ category }}</p>
				</div>
			</div>
		</div>
		<div>
			<p class="font-bold text-lg">Filtere</p>
			<div class="grid gap-2">
				<div v-for="filter in item.filters" class="flex gap-2">
					<p class="font-bold">{{ filter.name }}:</p>
					<p>{{ filter.value }}</p>
				</div>
			</div>
		</div>
		<div>
			<p class="font-bold text-lg">Tilgjengelig fra</p>
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
		/>
		<div>
			<p class="font-bold text-lg">Adresse</p>
			<p>{{ item.address }}</p>
			<p>{{ item.postalcode }}</p>
		</div>
		<GoogleMap
			v-if="item.position"
			api-key="AIzaSyAnMA9aHGVJ1Fw6w6j43au2We09k4V5_kQ"
			style="width: 100%; height: 500px"
			:center="item.position"
			:zoom="14"
		>
			<Circle
				:options="{
					center: randomCenter(item.position),
					radius: 400,
				}"
			/>
		</GoogleMap>
	</div>
</template>