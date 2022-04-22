<script setup lang="ts">
import BaseInput from '../components/base/BaseInput.vue'
import { store } from '../store'

import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import axios from 'axios'
import BaseButton from '../components/base/BaseBtn.vue'
import { ref, computed } from 'vue'

const schema = yup.object({
	username: yup.string().required('Brukernavn er påkrevd'),
	firstName: yup.string().required('Fornavn er påkrevd'),
	lastName: yup.string().required('Etternavn er påkrevd'),
	email: yup.string().required('Epost er påkrevd').email('Ikke gyldig'),
	address: yup.string().required('Adresse er påkrevd'),
	postalcode: yup.string().required('Postnummer er påkrevd').min(4),
	phonenumber: yup.number().required('Telefon er påkrevd').min(8),
	password: yup.string().required('Passord er påkrevd').min(8),
})
// Create a form context with the validation schema
const { errors } = useForm({
	validationSchema: schema,
})
// No need to define rules for fields
let { value: username } = useField('username')
let { value: firstName } = useField('firstName')
let { value: lastName } = useField('lastName')
let { value: email } = useField('email')
let { value: address } = useField('address')
let { value: postalcode } = useField('postalcode')
let { value: phonenumber } = useField('phonenumber')
let { value: password } = useField('password')

let passwordCheck = ''
let passwordIsSame = computed(() => password.value == passwordCheck)

function submit() {
	axios
		.post('/user/register', null, {
			params: {
				firstName: firstName.value,
				lastName: lastName.value,
				email: email.value,
				address: address.value,
				postalcode: postalcode.value,
				phonenumber: phonenumber.value,
				password: password.value,
			},
		})
		.then(response => {
			store.commit('SET_USER_DATA', response.data)
		})
		.catch()
}

const notValid = computed(
	() =>
		!!errors.value.email ||
		!!errors.value.password ||
		email.value == undefined ||
		password.value == undefined
)
</script>

<template>
	<div class="text-center">
		<h1 class="font-bold text-4xl">Ny gjenstand</h1>

		<form @submit.prevent="submit()">
			<BaseInput
				v-model.lazy="username"
				label="Tittel"
				:error="errors.username"
			/>
			<BaseInput
				v-model.lazy="firstName"
				label="Beskrivelse"
				:error="errors.firstName"
			/>
			<BaseInput
				v-model.lazy="lastName"
				label="Pris"
				:error="errors.lastName"
			/>

			<BaseInput
				v-model.lazy="email"
				label="Hovedkategori"
				:error="errors.email"
			/>
			<BaseInput
				v-model="phonenumber"
				label="Underkategori"
				:error="errors.phonenumber"
			/>

			<BaseInput
				v-model="address"
				label="Addresse"
				:error="errors.address"
			/>
			<BaseInput
				v-model="postalcode"
				label="Postnummer"
				:error="errors.postalcode"
			/>

			<BaseInput
				v-model="password"
				label="Passord"
				type="password"
				:error="errors.password"
			/>
			<BaseInput
				v-model="passwordCheck"
				label="Gjenta passord"
				type="password"
			/>

			<BaseButton class="m-4" type="submit" :disabled="notValid"
				>Send</BaseButton
			>
		</form>
	</div>
</template>
