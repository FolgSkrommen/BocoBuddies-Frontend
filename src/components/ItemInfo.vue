<script setup lang="ts">
import { computed, ref } from 'vue'
import ImageCarousel from '../components/ImageCarousel.vue'
import { DatePicker } from 'v-calendar'
import { Item, Position } from '../api/schema'
import axios from 'axios'

interface Props {
	item: Item
}

let listOfFilterWithValue = ref<any[]>([])
const { item } = defineProps<Props>()

function randomCenter(position: Position) {
	const newPosition: Position = {
		lat: position.lat + Math.random() * 0.01 - 0.005,
		lng: position.lng + Math.random() * 0.01 - 0.005,
	}
	return newPosition
}

const range = computed(() => ({
	start: new Date(item.availableFrom),
	end: new Date(item.availableTo),
}))
const getPriceUnit = computed(() => {
	if (item.priceUnit === 'DAY') return 'Dag'
	if (item.priceUnit === 'HOUR') return 'Time'
	if (item.priceUnit === 'MONTH') return 'Måned'
	if (item.priceUnit === 'WEEK') return 'Uke'
	if (item.priceUnit === 'YEAR') return 'År'
})
let filterTypes = ref<string[]>([])
async function getFilterTypeName() {
	try {
		let sendObject: any = {
			list: [],
		}
		item.filters.forEach(filter => {
			sendObject.list.push(filter.id)
		})
		const res = await axios.post('/category/getFilterName', sendObject)
		filterTypes.value = res.data
		for (let i = 0; i < filterTypes.value.length; i++) {
			let object = {
				filter: item.filters[i].value,
				name: filterTypes.value[i],
			}
			listOfFilterWithValue.value.push(object)
		}
	} catch (err) {
		console.log(err)
	}
}
getFilterTypeName()

const circleOptions = {
	strokeColor: '#004AAD',
	strokeOpacity: 0.8,
	strokeWeight: 2,
	fillColor: '#004AAD',
}
</script>

<template>
	<div class="grid gap-4">
		<div class="grid gap-4">
			<ImageCarousel :images="item.images" :alt="item.name" />
			<div>
				<p class="font-bold text-lg">Pris</p>
				<h1 data-testid="price-with-unit">
					{{ item.price }}kr / {{ getPriceUnit }}
				</h1>
			</div>
			<p data-testid="description">{{ item.description }}</p>
			<div v-if="item.categories.length > 0">
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
			<div v-if="listOfFilterWithValue.length > 0">
				<p class="font-bold text-lg">Filtere</p>
				<div class="grid gap-4">
					<div
						v-for="filter in listOfFilterWithValue"
						class="flex gap-4"
					>
						<p class="">{{ filter.name }}:</p>
						<p>{{ filter.filter }}</p>
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
		</div>

		<DatePicker
			data-testid="calendar"
			class="place-self-center pointer-events-none"
			v-model="range"
			is-range
			:contenteditable="false"
			locale="no"
		/>
		<!--<div >
			<p class="font-bold text-lg">Adresse</p>
			<p>{{ item.address }}</p>
			<p>{{ item.postalCode }}</p>
		</div>-->
		<GMapMap
			:center="item.position"
			:zoom="13"
			class="h-96"
			data-testid="map"
		>
			<GMapCircle
				:center="randomCenter(item.position)"
				:radius="1000"
				:options="circleOptions"
			/>
		</GMapMap>
	</div>
</template>
