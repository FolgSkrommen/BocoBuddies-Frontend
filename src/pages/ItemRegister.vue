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

const schema = yup.object({
	title: yup.string().required('Brukernavn er påkrevd'),
	description: yup.string().required('Fornavn er påkrevd'),
	price: yup.string().required('Etternavn er påkrevd'),
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

/*  Categories*/
interface Category {
	categoryName: String
	categoryId: number
	superCategoryId?: number
	filterTypes?: FilterType[]
}
let categoryChoices: Ref<Array<Category[]>> = ref([])

axios.get('/category/main').then(response => {
	categoryChoices.value.push(response.data)
})

interface FilterValue {
	id: number
	value: string
}

interface FilterType {
	filterTypeId: number
	filterTypeName: string
	filterValues: FilterValue[]
}

let currentCategory: number = 0

let filterTypes: Ref<Array<FilterType>> = ref([])

function updateCategories(categoryId: number, index: number) {
	filterTypes.value = []
	categoryChoices.value = categoryChoices.value.slice(0, index + 1)
	currentCategory = categoryId
	axios
		.get('/category/sub', {
			params: {
				categoryId: categoryId,
			},
		})
		.then(response => {
			console.log(response.data)
			if (response.data.length > 0) {
				categoryChoices.value.push(response.data)
			}
		})

	categoryChoices.value[index].forEach(object => {
		if (object.categoryId == categoryId) {
			console.log(object.filterTypes)
			if (object.filterTypes) {
				filterTypes.value = object.filterTypes
			}
		}
	})
}

/* Filter */

let chosenFilters: Ref<number[]> = ref([])
function updateFilters(typeId: number, index: number) {
	chosenFilters.value[index] = typeId
	console.log(chosenFilters.value)
}

/* Images*/
let imagePreview: Ref<string[]> = ref([])
let imageFiles: Ref<File[]> = ref([])
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

let currentPriceUnit: string
function setPriceUnit(priceUnit: string) {
	currentPriceUnit = priceUnit
}

/* Submit */
interface Item {
	categoryId: number
	FilterIdList: number[]
	name: string
	description: string
	price: number
	priceUnit: string
	address: string
	postalCode: string
	startDate: string
	endDate: string
}

type Status = 'sending' | 'success' | 'error'
const status = ref<Status>()
const errorMessage = ref()
async function registerItem() {
	status.value = 'sending'
	if (!range.value) {
		status.value = 'error'
		errorMessage.value = 'Range is not selected'
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
	chosenFilters.value.forEach(number => {
		formData.append('filterIdList', number.toString())
	})
	formData.append('images', imageFiles.value[0])
	try {
		await axios.post('/item/register', formData)
		router.push('/')
	} catch (error) {
		status.value = 'error'
		errorMessage.value = error
	}
}
</script>

<template>
	<BaseBanner
		v-if="status === 'error'"
		type="error"
		:message="errorMessage"
	/>
	<h1 class="font-bold text-4xl place-self-center">Ny gjenstand</h1>
	<form class="grid w-full gap-y-6" @submit.prevent="registerItem">
		<BaseInput
			v-model.lazy="title"
			label="Tittel *"
			:error="errors.title"
		/>
		<BaseInput
			v-model.lazy="description"
			label="Beskrivelse *"
			:error="errors.description"
		/>
		<div class="flex gap-4">
			<BaseInput
				class="grow"
				v-model.lazy="price"
				type="number"
				label="NOK *"
				:error="errors.price"
			/>

			<div class="grow">
				<BaseLabel model-value="Per" />

				<select
					class="rounded-xl bg-gray-500 items-center text-xl my-3 shadow-lg w-full p-3"
					@input="
						event => setPriceUnit((event.target as HTMLInputElement).value)
					"
				>
					<option
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
				v-for="(categories, index) in categoryChoices"
				v-if="categoryChoices"
				:key="index"
				class="rounded-xl bg-gray-500 items-center text-xl my-3 shadow-lg w-full p-3"
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
				class="rounded-xl bg-gray-500 items-center text-xl my-3 shadow-lg w-full p-3"
				@input="
						event => updateFilters(parseInt((event.target as HTMLInputElement).value), index)
					"
			>
				>
				<option value="0">Velg</option>

				<option
					v-for="value in filterType.filterValues"
					:key="value.id"
					:value="value.id"
				>
					{{ value.value }}
				</option>
			</select>
		</div>

		<div class="grid place-items-center">
			<p class="font-bold text-lg">Available time</p>
			<DatePicker
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
				@input="event => uploadImage(event.target)"
				multiple
			/>

			<ImageCarousel
				v-if="imagePreview.length > 0"
				:images="imagePreview"
				class="h-52"
			/>
		</div>

		<BaseInput v-model="address" label="Adresse" :error="errors.address" />

		<BaseInput
			v-model="postalCode"
			label="Postnummer *"
			:error="errors.postalCode"
		/>

		<BaseButton
			class="m-4 place-self-center"
			type="submit"
			:disabled="notValid"
			>Send</BaseButton
		>
	</form>
</template>
