<script setup lang="ts">
//Components
import BaseInput from '../components/base/BaseInput.vue'
import BaseButton from '../components/base/BaseBtn.vue'
import BaseDropdown from '../components/base/BaseDropdown.vue'
import ImageCarousel from '../components/ImageCarousel.vue'
import { DatePicker } from 'v-calendar'

import axios from 'axios'

import { computed, Ref, ref } from 'vue'
import router from '../router'

//Form validation
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import BaseLabel from '../components/base/BaseLabel.vue'
import BaseBanner from '../components/base/BaseBanner.vue'
import { Category, FilterType } from '../api/schema'
import { store } from '../store'
import { PostItemRegisterRequest } from '../api/item/register'

const schema = yup.object({
	title: yup.string().required('Brukernavn er påkrevd'),
	description: yup.string().required('Beskrivelse er påkrevd'),
	price: yup.string().required('Pris er påkrevd'),
	address: yup.string().required('Adresse er påkrevd'),
	postalCode: yup.string().required('Postnummer er påkrevd').min(4),
})
const { errors } = useForm({
	validationSchema: schema,
})
let { value: title } = useField<string>('title')
let { value: description } = useField<string>('description')
let { value: price } = useField<number>('price')
let { value: address } = useField<string>('address')
let { value: postalCode } = useField<number>('postalCode')

interface Range {
	start: Date
	end: Date
}
const range = ref<Range>()

const notValid = computed(
	() =>
		!!errors.value.title ||
		!!errors.value.description ||
		!!errors.value.price ||
		!!errors.value.address ||
		!!errors.value.postalCode ||
		title.value == undefined ||
		description.value == undefined ||
		price.value == undefined ||
		address.value == undefined ||
		postalCode.value == undefined
)

let categoryChoices: Ref<Array<Category[]>> = ref([])

type GetStatus = 'loading' | 'loaded' | 'error'
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
	console.log(categoryChoices.value)
}

getCategories()

let currentCategory: number = 0

let filterTypes: Ref<Array<FilterType>> = ref([])

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
				console.log(object.filterTypes)
				if (object.filterTypes) {
					filterTypes.value = object.filterTypes
					console.log(filterTypes.value)
				}
			}
		})
		updateCategoriesStatus.value = 'loaded'
	} catch (error: any) {
		updateCategoriesStatus.value = 'error'
		store.dispatch('error', error.message)
	}
}

/* Filter */

let chosenFilters = ref<String[]>([])
function updateFilters(chosen: String, index: number) {
	chosenFilters.value[index] = chosen
	console.log(chosenFilters.value)
}

/* Images*/
const imagePreview = ref<string[]>([])
const imageFiles = ref<File[]>([])
function uploadImage(input: any) {
	let count = input.files.length
	let index = 0

	if (input.files) {
		while (count--) {
			imagePreview.value.push(URL.createObjectURL(input.files[index]))
			imageFiles.value = input.files
			index++
		}
	}
}

/* Price */

interface PriceUnit {
	value: string
	name: string
}

let priceUnits: PriceUnit[] = [
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

let currentPriceUnit: string = 'HOUR'
function setPriceUnit(priceUnit: string) {
	currentPriceUnit = priceUnit
}

type PostStatus = 'sending' | 'success' | 'error'
const status = ref<PostStatus>()
async function registerItem() {
	status.value = 'sending'
	if (!range.value) {
		status.value = 'error'
		store.commit('error', 'Range is not selected')
		return
	}

	const formData = new FormData()

	formData.append('categoryId', currentCategory.toString())
	formData.append('name', title.value)
	formData.append('description', description.value)
	formData.append('price', price.value.toString())
	formData.append('priceUnit', currentPriceUnit)
	formData.append('address', address.value)
	formData.append('postalCode', postalCode.value.toString())
	formData.append('startDate', range.value.start.toISOString())
	formData.append('endDate', range.value.end.toISOString())
	chosenFilters.value.forEach(chosen => {
		filterTypes.value.forEach(filterType => {
			filterType.filterValues.forEach(filter => {
				console.log(filter.value + filter)
				if (chosen == filter.value) {
					console.log(filter.id)
					formData.append('filterIdList', filter.id.toString())
				}
			})
		})
	})
	if (!imageFiles.value.length) {
		//TODO: Filter funker ikke, fiks dette, muligens endre fra formdata til interface
		formData.append('images', new Blob())
		console.log('Bilde listen er tom')
	} else {
		for (let i = 0; i < imageFiles.value.length; i++) {
			formData.append('images', imageFiles.value[i])
		}
	}
	try {
		console.log(formData.getAll('images'))
		await axios.post('/item/register', formData)
		await router.push('/')
	} catch (error: any) {
		status.value = 'error'
		store.dispatch('error', error.message)
	}
}
</script>

<template>
	<form
		data-testid="form"
		class="grid w-full gap-y-6"
		@submit.prevent="registerItem"
	>
		<h1 data-testid="header">Ny gjenstand</h1>
		<BaseInput
			data-testid="title-input"
			v-model.lazy="title"
			label="Tittel *"
			:error="errors.title"
		/>

		<div>
			<p>Beskrivelse *</p>
			<textarea
				class="w-full"
				data-testid="description-input"
				v-model.lazy="description"
				label="Beskrivelse *"
				:error="errors.description"
				rows="4"
			></textarea>
		</div>

		<span class="my-4"></span>

		<div class="flex gap-4">
			<BaseInput
				data-testid="price-input"
				class="grow"
				v-model.lazy="price"
				type="number"
				label="NOK *"
				:error="errors.price"
			/>

			<div class="grow">
				<BaseLabel model-value="Per" />

				<select
					class="rounded-xl"
					data-testid="priceUnit-selector"
					@input="
						event => setPriceUnit((event.target as HTMLInputElement).value)
					"
				>
					<option
						data-testid="price-unit-option"
						v-for="unit in priceUnits"
						:key="unit.value"
						:value="unit.value"
					>
						{{ unit.name }}
					</option>
				</select>
			</div>
		</div>

		<div>
			<BaseLabel model-value="Kategori" />

			<select
				class="rounded-xl"
				v-for="(categories, index) in categoryChoices"
				v-if="categoryChoices"
				:key="index"
				@input="
						event => updateCategories(parseInt((event.target as HTMLInputElement).value), index)
					"
			>
				>
				<option value="1">Velg</option>

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
			<BaseLabel :model-value="filterType.filterTypeName" />
			<select
				v-if="filterTypes"
				:key="index"
				class="rounded-xl bg-slate-500 items-center text-xl my-3 shadow-lg w-full p-3"
				@input="
						event => updateFilters((event.target as HTMLInputElement).value, index)
					"
			>
				>
				<option value="0">Velg</option>

				<option
					v-for="value in filterType.filterValues"
					:key="value.id"
					:value="value.value"
				>
					{{ value.value }}
				</option>
			</select>
		</div>

		<div class="grid place-items-center">
			<p class="font-bold text-lg">Available time</p>
			<DatePicker
				data-testid="date-picker"
				class="place-self-center"
				v-model="range"
				mode="dateTime"
				is-range
				locale="no"
				is24hr
			/>
		</div>
		<div>
			<BaseLabel model-value="Bilder" />

			<input
				type="file"
				accept="image/*"
				data-testid="image-input"
				@input="event => uploadImage(event.target)"
				multiple
			/>

			<ImageCarousel
				v-if="imagePreview.length > 0"
				:images="imagePreview"
				class="h-52"
			/>
		</div>
		<span class="my-4"></span>

		<BaseInput
			data-testid="address-input"
			v-model="address"
			label="Adresse"
			:error="errors.address"
		/>

		<BaseInput
			data-testid="postalCode-input"
			v-model="postalCode"
			label="Postnummer *"
			:error="errors.postalCode"
		/>

		<BaseButton
			data-testid="submit-button"
			class="m-4 place-self-center"
			type="submit"
			:disabled="notValid"
			>Send</BaseButton
		>
	</form>
</template>
