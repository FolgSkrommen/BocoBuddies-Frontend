<script setup lang="ts">
import BaseInput from '../components/Base/BaseInput.vue'

import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import axios from 'axios'
import BaseButton from '../components/Base/BaseBtn.vue'
import { ref, computed } from 'vue'

const schema = yup.object({
	username: yup.string().required('Brukernavn er påkrevd'),
	firstName: yup.string().required('Fornavn er påkrevd'),
	lastName: yup.string().required('Etternavn er påkrevd'),
	email: yup.string().required('Epost er påkrevd').email('Ikke gyldig'),
	address: yup.string().required('Adresse er påkrevd'),
	postalCode: yup.string().required('Postnummer er påkrevd').min(4),
	phoneNumber: yup.number().required('Telefon er påkrevd').min(8),
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
let { value: postalCode } = useField('postalCode')
let { value: phoneNumber } = useField('phoneNumber')
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
				postalCode: postalCode.value,
				phoneNumber: phoneNumber.value,
				password: password.value,
			},
		})
		.then(response => {
			//store.commit('SET_USER_DATA', response.data)
		})
		.catch()
}

const notValid = computed(
	() =>
		!!errors.value.firstName ||
		!!errors.value.lastName ||
		!!errors.value.email ||
		!!errors.value.address ||
		!!errors.value.postalCode ||
		!!errors.value.phoneNumber ||
		!!errors.value.password ||
		firstName.value == undefined ||
		lastName.value == undefined ||
		email.value == undefined ||
		address.value == undefined ||
		postalCode.value == undefined ||
		phoneNumber.value == undefined ||
		password.value == undefined
)
</script>

<template>
	<div class="text-center">
		<h1 class="font-bold text-4xl">Registrer deg</h1>

		<form @submit.prevent="submit()">
			<BaseInput
				v-model.lazy="username"
				label="Brukernavn"
				:error="errors.username"
				data-testid="username-input"
			/>
			<BaseInput
				v-model.lazy="firstName"
				label="Fornavn"
				:error="errors.firstName"
				data-testid="firstName-input"
			/>
			<BaseInput
				v-model.lazy="lastName"
				label="Etternavn"
				:error="errors.lastName"
				data-testid="lastName-input"
			/>

			<BaseInput
				v-model.lazy="email"
				label="E-post"
				:error="errors.email"
				data-testid="email-input"
			/>
			<BaseInput
				v-model="phoneNumber"
				label="Telefon"
				:error="errors.phoneNumber"
				data-testid="phoneNumber-input"
			/>

			<BaseInput
				v-model="address"
				label="Addresse"
				:error="errors.address"
				data-testid="address-input"
			/>
			<BaseInput
				v-model="postalCode"
				label="Postnummer"
				:error="errors.postalCode"
				data-testid="postalCode-input"
			/>

			<BaseInput
				v-model="password"
				label="Passord"
				type="password"
				:error="errors.password"
				data-testid="password-input"
			/>
			<BaseInput
				v-model="passwordCheck"
				label="Gjenta passord"
				type="password"
				data-testid="passwordCheck-input"
			/>

			<BaseButton
				class="m-4"
				type="submit"
				:disabled="notValid"
				data-testid="submit-button"
				>Registrer</BaseButton
			>
		</form>
	</div>
</template>
