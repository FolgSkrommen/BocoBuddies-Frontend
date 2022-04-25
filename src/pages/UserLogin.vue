<script setup lang="ts">
import BaseInput from '../components/base/BaseInput.vue'
import { store, User } from '../store'

import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import BaseButton from '../components/base/BaseBtn.vue'
import { computed } from 'vue'
import axios from 'axios'
import router from '../router'

const schema = yup.object({
	email: yup.string().required('Epost er påkrevd').email('Ikke gyldig'),
	password: yup
		.string()
		.required('Passord er påkrevd')
		.min(8, 'Minimum 8 tegn'),
})

const { errors } = useForm({
	validationSchema: schema,
})

const { value: email } = useField<string>('email')
const { value: password } = useField<string>('password')

interface UserLoginData {
	email: string
	password: string
}

async function submit() {
	const data: UserLoginData = {
		email: email.value,
		password: password.value,
	}

	await store
		.dispatch('login', data)
		.then(() => {
			console.log('logged in')
			router.push('/')
		})
		.catch(err => {
			alert(err)
		})
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

		<router-link class="text-blue underline" to="/register">
			Har du ikke bruker? Klikk her!
		</router-link>
	</div>
</template>
