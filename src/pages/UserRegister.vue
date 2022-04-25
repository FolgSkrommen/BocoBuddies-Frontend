<script setup lang="ts">
import BaseInput from '../components/base/BaseInput.vue'

import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import axios, { AxiosError } from 'axios'
import BaseButton from '../components/base/BaseBtn.vue'
import { ref, computed } from 'vue'
import router from '../router'

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
const { value: username } = useField<string>('username')
const { value: firstName } = useField<string>('firstName')
const { value: lastName } = useField<string>('lastName')
const { value: email } = useField<string>('email')
const { value: address } = useField<string>('address')
const { value: postalcode } = useField<string>('postalcode')
const { value: phonenumber } = useField<string>('phonenumber')
const { value: password } = useField<string>('password')

const passwordCheck = ref('')
const passwordIsSame = computed<boolean>(
	() => password.value === passwordCheck.value
)

interface UserRegisterData {
	firstName: string
	lastName: string
	username: string
	email: string
	password: string
	address: string
	postalCode: string
	phoneNumber: string
	pictureUrl?: string
}

async function submit() {
	const data: UserRegisterData = {
		firstName: firstName.value,
		lastName: lastName.value,
		username: username.value,
		email: email.value,
		password: password.value,
		address: address.value,
		postalCode: postalcode.value,
		phoneNumber: phonenumber.value,
	}
	await axios
		.post('/user/register', data)
		.then(response => {
			console.log(response)
			router.push('/login')
		})
		.catch(error => {
			console.log(error)
		})
}

const notValid = computed(
	() =>
		!!errors.value.firstName ||
		!!errors.value.lastName ||
		!!errors.value.email ||
		!!errors.value.address ||
		!!errors.value.postalcode ||
		!!errors.value.phonenumber ||
		!!errors.value.password ||
		firstName.value == undefined ||
		lastName.value == undefined ||
		email.value == undefined ||
		address.value == undefined ||
		postalcode.value == undefined ||
		phonenumber.value == undefined ||
		password.value == undefined ||
		!passwordIsSame
)
</script>

<template>
	<div class="text-center">
		<h1 class="font-bold text-4xl my-8">Registrer deg</h1>

		<form
			class="grid gap-y-8"
			data-testid="register-form"
			@submit.prevent="submit()"
		>
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
				v-model="phonenumber"
				label="Telefon"
				:error="errors.phonenumber"
				data-testid="phonenumber-input"
			/>

			<BaseInput
				v-model="address"
				label="Addresse"
				:error="errors.address"
				data-testid="address-input"
			/>
			<BaseInput
				v-model="postalcode"
				label="Postnummer"
				:error="errors.postalcode"
				data-testid="postalcode-input"
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
				class="m-4 place-self-center"
				type="submit"
				:disabled="notValid"
				data-testid="submit-button"
				>Registrer</BaseButton
			>
		</form>
	</div>
</template>
