<script setup lang="ts">
import BaseInput from '../components/Base/BaseInput.vue'
import { store } from '../store'

import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import axios from 'axios'
import BaseButton from '../components/Base/BaseBtn.vue'
import { computed } from 'vue'

const schema = yup.object({
  email: yup.string().required("Epost er påkrevd").email("Ikke gyldig"),
  password: yup.string().required("Passord er påkrevd").min(8, "Minimum 8 tegn"),
})
// Create a form context with the validation schema
const { errors } = useForm({
  validationSchema: schema,
})
// No need to define rules for fields
let { value: email } = useField('email')
let { value: password } = useField('password')

interface Parameters {
  email: String,
  password: String,
}

let params: Parameters = {
  email:  email.value,
  password: password.value
}

function submit() {
  alert(email.value + ' ' + password.value)
  store.dispatch('login', params)
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
      <BaseInput v-model="email" label="Email" :error="errors.email"/>

      <BaseInput v-model="password" label="Password" type="password" :error="errors.password" />

      <BaseButton class="m-4" type="submit" :disabled="notValid">Submit</BaseButton>
    </form>

    <router-link class="text-blue underline" to="user-register">
      Har du ikke bruker? Klikk her!
    </router-link>
  </div>
</template>

