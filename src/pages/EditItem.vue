<script setup lang="ts">
import 'v-calendar/dist/style.css'
import { computed, ref } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import { store } from '../store'
import LoadingIndicator from '../components/base/LoadingIndicator.vue'
import { Category, FilterType, Item, User } from '../api/schema'
import { GetItemRequest, GetItemResponse } from '../api/item'
import ImageCarousel from '../components/ImageCarousel.vue'
import { PutItemEditRequest } from '../api/item/edit'
import { DatePicker } from 'v-calendar'
import BaseBtn from '../components/base/BaseBtn.vue'

const router = useRouter()
const { params } = useRoute()
const itemId = parseInt(params.id as string)

const item = ref<Item>()
const newItem = ref<Item>()

const lender = ref<User>()

interface PriceUnit {
	value: string
	name: string
}

const priceUnits: PriceUnit[] = [
	{
		value: 'HOUR',
		name: 'Time',
	},
	{
		value: 'DAY',
		name: 'Dag',
	},
	{
		value: 'WEEK',
		name: 'Uke',
	},
	{
		value: 'MONTH',
		name: 'Måned',
	},
	{
		value: 'YEAR',
		name: 'År',
	},
]

const newPriceUnit = ref<PriceUnit>(priceUnits[0])

interface Range {
	start: Date
	end: Date
}

const newRange = ref<Range>({ start: new Date(), end: new Date() })

function resetItem(oldItem: Item) {
	newItem.value = { ...oldItem }
	console.log(newItem.value.active)
	newRange.value.start = new Date(oldItem.availableFrom)
	newRange.value.end = new Date(oldItem.availableTo)

	const convertedPriceUnit = priceUnits.find(
		el => el.value === oldItem.priceUnit
	)
	if (convertedPriceUnit) newPriceUnit.value = convertedPriceUnit
	filterTypes.value = []
	categoryChoices.value = []
	currentCategory = 0
	chosenFilters.value = []
	getCategories()
}

function resetItemFromOld() {
	if (!item.value) return
	newItem.value = { ...item.value }
	newRange.value.start = new Date(item.value.availableFrom)
	newRange.value.end = new Date(item.value.availableTo)

	const convertedPriceUnit = priceUnits.find(
		el => el.value === item.value?.priceUnit
	)
	if (convertedPriceUnit) newPriceUnit.value = convertedPriceUnit
	filterTypes.value = []
	categoryChoices.value = []
	currentCategory = 0
	chosenFilters.value = []
	getCategories()
}

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
		lender.value = data.lender
		item.value = data.item
		resetItem(item.value)
		getStatus.value = 'loaded'
	} catch (error: any) {
		getStatus.value = 'error'
		store.dispatch('error', error.message)
	}
}

getItem()

let categoryChoices = ref<Category[][]>([])

const getCategoriesStatus = ref<GetStatus>()
getCategoriesStatus.value = 'loading'
async function getCategories() {
	try {
		const res = await axios.get('/category/main')
		categoryChoices.value.push(res.data)
		getCategoriesStatus.value = 'loaded'
	} catch (error: any) {
		getCategoriesStatus.value = 'error'
		store.dispatch('error', error.message)
	}
}

let currentCategory: number = 0

let filterTypes = ref<FilterType[]>([])

const updateCategoriesStatus = ref<GetStatus>()
async function updateCategories(categoryId: number, index: number) {
	updateCategoriesStatus.value = 'loading'
	filterTypes.value = []
	categoryChoices.value = categoryChoices.value.slice(0, index + 1)
	currentCategory = categoryId
	try {
		const res = await axios.get('/category/sub', {
			params: {
				categoryId: categoryId,
			},
		})
		if (res.data.length > 0) {
			categoryChoices.value.push(res.data)
		}

		categoryChoices.value[index].forEach(object => {
			if (object.categoryId == categoryId) {
				if (object.filterTypes) {
					filterTypes.value = object.filterTypes
				}
			}
		})
		updateCategoriesStatus.value = 'loaded'
	} catch (error: any) {
		updateCategoriesStatus.value = 'error'
		store.dispatch('error', error.message)
	}
}

let chosenFilters = ref<number[]>([])
function updateFilters(chosen: string, index: number) {
	chosenFilters.value[index] = parseInt(chosen)
}

const newImages = ref<File[]>([])

function handleImageChange(event: Event) {
	const files = (event.target as HTMLInputElement).files
	if (!files || files?.length < 1) return
	if (!newItem.value) return
	newItem.value.images = []
	for (let i = 0; i < files.length; i++) {
		const element = files.item(i)
		if (element) {
			newImages.value.push(element)
			newItem.value.images.push(URL.createObjectURL(element))
		}
	}
}

type PutStatus = 'sending' | 'success' | 'error'
const putStatus = ref<PutStatus>()
async function updateItem() {
	try {
		if (!newItem.value) {
			throw new Error('Item is not fetched')
		}
		const body: PutItemEditRequest = {
			name: newItem.value.name,
			description: newItem.value.description,
			price: newItem.value.price,
			priceUnit: newPriceUnit.value.value,
			address: newItem.value.address,
			postalCode: newItem.value.postalCode,
			startDate: newRange.value.start.toISOString(),
			endDate: newRange.value.end.toISOString(),
			categoryId: currentCategory,
			filterIdList: chosenFilters.value,
			images: newImages.value,
			itemId: itemId,
			active: newItem.value.active,
		}
		console.log(body.images)
		const formData = new FormData()
		formData.append('name', body.name)
		console.log(formData.get('name'))
		formData.append('description', body.description)
		formData.append('price', body.price.toString())
		formData.append('priceUnit', body.priceUnit)
		formData.append('address', body.address)
		formData.append('postalCode', body.postalCode.toString())
		formData.append('startDate', body.startDate)
		formData.append('endDate', body.endDate)
		if (showEditCategory.value) {
			formData.append('categoryId', body.categoryId.toString())
			formData.append('filterIdList', body.filterIdList.toString())
		}
		if (!body.images.length) {
			console.log('Bilde listen er tom')
		} else {
			for (let i = 0; i < body.images.length; i++) {
				formData.append('images', body.images[i])
			}
		}
		formData.append('itemId', body.itemId.toString())
		formData.append('active', body.active.toString())
		console.log(formData.getAll('images'))
		await axios.put('/item/edit', formData)
		putStatus.value = 'success'
		store.dispatch('successWithTimeout', {
			message: 'Gjenstand er oppdatert',
		})
	} catch (error: any) {
		putStatus.value = 'error'
		store.dispatch('error', error.message)
	}
}

const showEditCategory = ref(false)
</script>

<template>
	<LoadingIndicator v-if="getStatus === 'loading'" />
	<div class="grid gap-4" v-if="newItem && getStatus === 'loaded'">
		<button
			v-if="item"
			@click="resetItemFromOld"
			class="bg-red-500 hover:bg-red-700"
		>
			Tilbakestill
		</button>
		<div class="flex gap-4 items-center">
			<h3>Aktiv</h3>
			<input class="h-6 w-6" type="checkbox" v-model="newItem.active" />
		</div>
		<div>
			<h3>Navn</h3>
			<input v-model="newItem.name" class="w-full" />
		</div>
		<div>
			<h3>Bilder</h3>
			<ImageCarousel :images="newItem.images" :alt="newItem.name" />
			<input
				multiple
				type="file"
				accept="image/jpeg"
				@change="handleImageChange($event)"
			/>
		</div>
		<div>
			<h3>Beskrivelse</h3>
			<textarea
				class="w-full"
				rows="4"
				v-model="newItem.description"
			></textarea>
		</div>
		<div>
			<h3>Pris</h3>
			<div class="grid grid-cols-2 gap-4">
				<div>
					<p>Verdi</p>
					<input
						v-model="newItem.price"
						type="number"
						class="w-full"
					/>
				</div>
				<div>
					<p>Enhet</p>
					<select v-model="newPriceUnit" class="w-full">
						<option
							v-for="unit in priceUnits"
							:key="unit.value"
							:value="unit"
						>
							{{ unit.name }}
						</option>
					</select>
				</div>
			</div>
		</div>
		<div>
			<h3>Adresse</h3>
			<div class="grid grid-cols-4 gap-4">
				<div class="col-span-3">
					<p>Gateadresse</p>
					<input v-model="newItem.address" class="w-full" />
				</div>
				<div>
					<p>Postnummer</p>
					<input
						v-model="newItem.postalCode"
						class="w-full"
						type="number"
					/>
				</div>
			</div>
		</div>
		<div class="grid place-items-center">
			<p class="font-bold text-lg">Tilgjengelig tid</p>
			<DatePicker
				:key="newRange"
				data-testid="date-picker"
				class="place-self-center"
				v-model="newRange"
				mode="dateTime"
				is-range
				locale="no"
				is24hr
			/>
		</div>
		<div class="flex gap-4 items-center">
			<h3>Rediger kategori og filter</h3>
			<input class="h-6 w-6" type="checkbox" v-model="showEditCategory" />
		</div>
		<div v-if="showEditCategory">
			<div class="grid gap-4">
				<h3>Kategori</h3>
				<select
					class="w-full"
					v-for="(categories, index) in categoryChoices"
					v-if="categoryChoices"
					:key="index"
					@input="
						event => updateCategories(parseInt((event.target as HTMLInputElement).value), index)
					"
				>
					>
					<option></option>
					<option
						v-for="category in categories"
						:key="category.categoryId"
						:value="category.categoryId"
					>
						{{ category.categoryName }}
					</option>
				</select>
			</div>
			<div v-for="(filterType, index) in filterTypes">
				<h3>{{ filterType.filterTypeName }}</h3>
				<select
					class="w-full"
					v-if="filterTypes"
					:key="index"
					@input="
						event => updateFilters((event.target as HTMLInputElement).value, index)
					"
				>
					>
					<option></option>
					<option
						v-for="value in filterType.filterValues"
						:key="value.id"
						:value="value.id"
					>
						{{ value.value }}
					</option>
				</select>
			</div>
		</div>
		<BaseBtn @click="updateItem" :to="'/overview/items'">Lagre</BaseBtn>
	</div>
</template>
