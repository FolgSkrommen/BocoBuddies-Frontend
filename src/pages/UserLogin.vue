<script setup lang="ts">
import BaseInput from '../components/base/BaseInput.vue'
import { store } from '../store'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import BaseButton from '../components/base/BaseBtn.vue'
import { computed, ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import BaseBanner from '../components/base/BaseBanner.vue'
import { User } from '../api/schema'
import { PostUserLoginRequest } from '../api/user/login'

let router = useRouter()

const errorMessage = ref()

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

type Status = 'loading' | 'loaded' | 'error'
const loginStatus = ref<Status>()

async function logIn() {
	loginStatus.value = 'loading'
	const data: PostUserLoginRequest = {
		email: email.value,
		password: password.value,
	}
	try {
		await store.dispatch('login', data)
		console.log('logged in')
		loginStatus.value = 'loaded'
		await router.push('/')
	} catch (error) {
		loginStatus.value = 'error'
		errorMessage.value = error
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
	<BaseBanner
		v-if="loginStatus === 'error'"
		type="error"
		:message="errorMessage"
	/>
	<div class="text-center">
		<h1>Logg inn</h1>
		<form data-testid="login-form" @submit.prevent="logIn()">
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

			<BaseButton
				data-testid="submit-button"
				class="m-4"
				type="submit"
				:disabled="notValid"
				>Submit</BaseButton
			>
		</form>

		<router-link
			data-testid="register-link"
			class="text-blue-500 underline"
			to="/register"
		>
			Har du ikke bruker? Klikk her!
		</router-link>
	</div>
</template>
