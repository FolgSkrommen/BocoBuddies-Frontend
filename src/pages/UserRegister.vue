<script setup lang="ts">
import BaseInput from '../components/Base/BaseInput.vue'

import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import axios, { AxiosError } from 'axios'
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
const { value: username } = useField<string>('username')
const { value: firstName } = useField<string>('firstName')
const { value: lastName } = useField<string>('lastName')
const { value: email } = useField<string>('email')
const { value: address } = useField<string>('address')
const { value: postalCode } = useField<string>('postalCode')
const { value: phoneNumber } = useField<string>('phoneNumber')
const { value: password } = useField<string>('password')

let passwordCheck = ''
const passwordIsSame = computed(() => password.value == passwordCheck)

interface RegisterUser {
	firstName: string
	lastName: string
	username: string
	email: string
	password: string
	address: string
	postalcode: string
	phonenumber: string
	pictureUrl?: string
}

async function submit() {
	const data: RegisterUser = {
		firstName: firstName.value,
		lastName: lastName.value,
		username: username.value,
		email: email.value,
		password: password.value,
		address: address.value,
		postalcode: postalCode.value,
		phonenumber: phoneNumber.value,
	}
	try {
		const res = await axios({
			method: 'post',
			url: '/user/register',
			data,
		})
		console.log(res)
	} catch (error) {
		console.log(error)
	}
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
