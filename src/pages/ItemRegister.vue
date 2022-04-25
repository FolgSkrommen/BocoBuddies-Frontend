<script setup lang="ts">
//Components
import BaseInput from '../components/base/BaseInput.vue'
import BaseButton from '../components/base/BaseBtn.vue'
import BaseDropdown from '../components/base/BaseDropdown.vue'

import { store } from '../store'
import axios from 'axios'

import { computed, onMounted, Ref, ref } from 'vue'

//Form validation
// /*
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

const schema = yup.object({
	title: yup.string().required('Brukernavn er påkrevd'),
	description: yup.string().required('Fornavn er påkrevd'),
	price: yup.string().required('Etternavn er påkrevd'),
	category: yup.string().required('Epost er påkrevd').email('Ikke gyldig'),
	address: yup.string().required('Adresse er påkrevd'),
	postalcode: yup.string().required('Postnummer er påkrevd').min(4),
})
const { errors } = useForm({
	validationSchema: schema,
})
let { value: title } = useField('title')
let { value: description } = useField('description')
let { value: price } = useField('price')
let { value: category } = useField('category')
let { value: address } = useField('address')
let { value: postalcode } = useField('postalcode')
let { value: phonenumber } = useField('phonenumber')

function submit() {}

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

function update(categoryId: number, index: number) {
	categoryChoices.value = categoryChoices.value.slice(0, index + 1)
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
</script>

<template>
	<div class="text-center">
		<h1 class="font-bold text-4xl">Ny gjenstand</h1>

		<form @submit.prevent="submit()">
			<BaseInput
				v-model.lazy="title"
				label="Tittel"
				:error="errors.title"
			/>
			<BaseInput
				v-model.lazy="description"
				label="Beskrivelse"
				:error="errors.description"
			/>

			<BaseInput
				v-model.lazy="price"
				label="Pris"
				:error="errors.price"
			/>

			<h2>Kategorier</h2>
			<select
				v-for="(categories, index) in categoryChoices"
				:key="index"
				class="border-2 border-black rounded bg-gray-300 items-center"
				@input="event => update(event.target.value, index)"
			>
				>
				<option
					v-for="category in categories"
					:key="category.id"
					:value="category.id"
				>
					{{ category.name }}
				</option>
			</select>

			<BaseInput
				v-model="address"
				label="Bilder"
				:error="errors.address"
			/>
			<BaseInput
				v-model="postalcode"
				label="Adresse"
				:error="errors.postalcode"
			/>

			<BaseButton class="m-4" type="submit">Send</BaseButton>
		</form>
	</div>
</template>
