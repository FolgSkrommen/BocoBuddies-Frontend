<script setup lang="ts">
import BaseInput from '../components/Base/BaseInput.vue'
import { store, User } from '../store'

import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import BaseButton from '../components/Base/BaseBtn.vue'
import { computed } from 'vue'
import axios from 'axios'

const schema = yup.object({
	email: yup.string().required('Epost er påkrevd').email('Ikke gyldig'),
	password: yup
		.string()
		.required('Passord er påkrevd')
		.min(8, 'Minimum 8 tegn'),
})
//test
//<x<x
// Create a form context with the validation schema
const { errors } = useForm({
	validationSchema: schema,
})
// No need to define rules for fields
const { value: email } = useField<string>('email')
const { value: password } = useField<string>('password')

interface UserLoginData {
	email: string
	password: string
}

interface UserLoginResponse {
	user: {
		id: number
		firstName: string
		lastName: string
		username: string
		email: string
		address: string
		postalcode: string
		phonenumber: string
		pictureUrl?: string
		verified: boolean
		trusted: boolean
	}
	token: string
}

async function submit() {
	const data: UserLoginData = {
		email: email.value,
		password: password.value,
	}
	try {
		const res = await axios({
			method: 'post',
			url: '/user/login',
			data,
		})
		console.log(res)
		const user: UserLoginResponse = res.data
		console.log(user)
	} catch (error) {
		console.log(error)
	}
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
		<h1 class="font-bold text-4xl">Logg inn</h1>

		<form @submit.prevent="submit()">
			<BaseInput
				data-testid="email-input"
				v-model="email"
				label="Email"
				:error="errors.email"
			/>

			<BaseInput
				data-testid="password-input"
				v-model="password"
				label="Password"
				type="password"
				:error="errors.password"
			/>

			<BaseButton class="m-4" type="submit" :disabled="notValid"
				>Submit</BaseButton
			>
		</form>

		<router-link class="text-blue underline" to="user-register">
			Har du ikke bruker? Klikk her!
		</router-link>
	</div>
</template>
