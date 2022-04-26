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
	postalcode: yup.string().required('Postnummer er påkrevd').min(4),
})
const { errors } = useForm({
	validationSchema: schema,
})
let { value: title } = useField<string>('title')
let { value: description } = useField<string>('description')
let { value: price } = useField<number>('price')
let { value: address } = useField<string>('address')
let { value: postalcode } = useField<number>('postalcode')
let { value: phonenumber } = useField<number>('phonenumber')

const notValid = computed(
	() =>
		!!errors.value.title ||
		!!errors.value.description ||
		!!errors.value.price ||
		!!errors.value.address ||
		!!errors.value.postalcode ||
		title.value == undefined ||
		description.value == undefined ||
		price.value == undefined ||
		address.value == undefined ||
		postalcode.value == undefined ||
		phonenumber.value == undefined
)

/*  Categories*/
interface Category {
	name: String
	id: number
	superCategoryId?: number
}
let categoryChoices: Ref<Array<Category[]>> = ref([])

onMounted(() => {
	axios.get('/category/main').then(response => {
		categoryChoices.value.push(response.data)
	})
})
// 0:
let currentCategory: number = -1

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
			}
		})
}

/* Images*/
let imageList: Ref<string[]> = ref([])
function uploadImage(input: any) {
	let count = input.files.length
	let index = 0

	if (input.files) {
		while (count--) {
			imageList.value.push(URL.createObjectURL(input.files[index]))
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
	postalcode: number
}

function submit() {
	let item: Item = {
		categoryId: currentCategory.toString(),
		name: title.value,
		description: description.value,
		price: price.value,
		priceUnit: 'WEEK',
		address: address.value,
		postalcode: postalcode.value,
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
}
</script>

<template>
	<div class="">
		<h1 class="font-bold text-4xl place-self-center">Ny gjenstand</h1>

		<form class="grid gap-y-6" @submit.prevent="submit()">
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
					@input="event => updateCategories(parseInt((event.target as HTMLInputElement).value), index)"
				>
					>
					<option :key="-1" :value="null">Velg</option>

					<option
						v-for="category in categories"
						:key="category.id"
						:value="category.id"
					>
						{{ category.name }}
					</option>
				</select>
			</div>

			<div>
				<BaseLabel model-value="Bilder" />

				<input
					type="file"
					accept="image/jpeg"
					@input="event => uploadImage(event.target)"
					multiple
				/>

				<ImageCarousel
					v-if="imageList.length > 0"
					:images="imageList"
					class="h-52"
				/>
			</div>

			<BaseInput
				v-model="address"
				label="Adresse"
				:error="errors.address"
			/>

			<BaseInput
				v-model="postalcode"
				label="Postnummer *"
				:error="errors.postalcode"
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
