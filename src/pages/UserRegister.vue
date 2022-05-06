<script setup lang="ts">
import BaseInput from '../components/base/BaseInput.vue'
import LoadingIndicator from '../components/base/LoadingIndicator.vue'
import BaseBanner from '../components/base/BaseBanner.vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import axios, { AxiosError } from 'axios'
import BaseButton from '../components/base/BaseBtn.vue'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { PostUserRegisterRequest } from '../api/user/register'
import { store } from '../store'

const schema = yup.object({
	username: yup.string().required('Brukernavn er påkrevd'),
	firstName: yup.string().required('Fornavn er påkrevd'),
	lastName: yup.string().required('Etternavn er påkrevd'),
	email: yup.string().required('Epost er påkrevd').email('Ikke gyldig'),
	address: yup.string().required('Adresse er påkrevd'),
	postalCode: yup.string().required('Postnummer er påkrevd').min(4),
	phoneNumber: yup.number().required('Telefon er påkrevd'),
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

const passwordCheck = ref('')

type Status = 'loading' | 'loaded' | 'error'
const status = ref<Status>()

let registerSuccess = ref(false)

const router = useRouter()

async function submit() {
	const data: PostUserRegisterRequest = {
		firstName: firstName.value,
		lastName: lastName.value,
		username: username.value,
		email: email.value,
		password: password.value,
		address: address.value,
		postalCode: postalCode.value,
		phoneNumber: phoneNumber.value,
	}
	status.value = 'loading'
	try {
		await axios.post('/user/register', data)
		status.value = 'loaded'
		//await router.push('/login')
		registerSuccess.value = true
	} catch (error: any) {
		status.value = 'error'
		store.dispatch('error', error.response.data)
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
		password.value == undefined ||
		password.value != passwordCheck.value
)
</script>

<template>
	<LoadingIndicator v-if="status === 'loading'" />
	<div class="text-center">
		<form
			v-if="!registerSuccess"
			class="grid gap-y-8"
			data-testid="register-form"
			@submit.prevent="submit()"
		>
			<h1>Registrer deg</h1>

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
				type="firstName"
			/>
			<BaseInput
				v-model.lazy="lastName"
				label="Etternavn"
				:error="errors.lastName"
				data-testid="lastName-input"
				type="lastName"
			/>

			<span class="my-4"></span>

			<BaseInput
				v-model.lazy="email"
				label="E-post"
				type="email"
				:error="errors.email"
				data-testid="email-input"
			/>

			<BaseInput
				v-model="phoneNumber"
				label="Telefon"
				:error="errors.phoneNumber"
				type="number"
				data-testid="phoneNumber-input"
			/>

			<span class="my-4"></span>

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
			<span class="my-4"></span>

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
		<div class="text-center" v-if="registerSuccess">
			<h2>Bruker registrert!</h2>
			<router-link
				data-testid="register-link"
				class="text-blue-500 underline"
				to="/login"
			>
				Gå til innlogging
			</router-link>
		</div>
	</div>
</template>
