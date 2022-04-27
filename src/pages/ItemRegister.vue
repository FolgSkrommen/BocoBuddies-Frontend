<script setup lang="ts">
//Components
import BaseInput from '../components/base/BaseInput.vue'
import BaseButton from '../components/base/BaseBtn.vue'
import ImageCarousel from '../components/ImageCarousel.vue'

import axios from 'axios'

import { computed, onMounted, Ref, ref } from 'vue'
import router from '../router'

//Form validation
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import BaseLabel from '../components/base/BaseLabel.vue'

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

onMounted(() => {
	axios.get('/category/main').then(response => {
		categoryChoices.value.push(response.data)
	})
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

let currentCategory: number = -1

let filterTypes: Ref<Array<FilterType>> = ref([])

function updateCategories(categoryId: number, index: number) {
	categoryChoices.value = categoryChoices.value.slice(0, index + 1)
	currentCategory = categoryId
	axios
		.get('/category/sub', {
			params: {
				categoryId: categoryId,
			},
		})
		.then(response => {
			if (response.data.length > 0) {
				categoryChoices.value.push(response.data)

				categoryChoices.value[index].forEach(object => {
					if (object.categoryId == categoryId) {
						if (object.filterTypes) {
							filterTypes.value = object.filterTypes
						}
					}
				})
			}
		})
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

interface Item {
	categoryId: string
	name: string
	description: string
	price: number
	priceUnit: string
	address: string
	postalCode: number
}

function submit() {
	let item: Item = {
		categoryId: currentCategory.toString(),
		name: title.value,
		description: description.value,
		price: price.value,
		priceUnit: 'WEEK',
		address: address.value,
		postalCode: postalCode.value,
	}
	console.log(item)

	axios
		.post('/item/register', item)
		.then(response => {
			router.push('/')
		})
		.catch(error => {
			alert(error.message)
		})

	axios
		.post('/image', imageFiles, {
			headers: {
				'Content-Type':
					'multipart/form-data; boundary=<calculated when request is sent>',
			},
		})
		.then(response => {
			console.log(response)
		})
		.catch(error => {
			alert(error)
		})
}
</script>

<template>
	<div class="">
		<h1 class="font-bold text-4xl place-self-center">Ny gjenstand</h1>

		<form class="grid w-full gap-y-6" @submit.prevent="submit()">
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

			<BaseInput
				v-model.lazy="price"
				label="Pris *"
				:error="errors.price"
			/>

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
					<option :key="-1" :value="null">Velg</option>

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
				>
					>
					<option :key="-1" :value="null">Velg</option>

					<option
						v-for="value in filterType.filterValues"
						:key="value.id"
						:value="value.id"
					>
						{{ value.value }}
					</option>
				</select>
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

			<BaseInput
				v-model="address"
				label="Adresse"
				:error="errors.address"
			/>

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
	</div>
</template>
