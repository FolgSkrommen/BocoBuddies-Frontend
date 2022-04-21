
<script setup lang="ts">
import BaseInput from '../components/Base/BaseInput.vue'
import { store } from '../store'

import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import axios from 'axios'
import BaseButton from '../components/Base/BaseBtn.vue'
import { ref, computed } from 'vue'

const schema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required().min(8),
})
// Create a form context with the validation schema
const { errors } = useForm({
  validationSchema: schema,
})
// No need to define rules for fields
let { value: email } = useField('email')
let { value: password } = useField('password')

function submit() {
  alert(email.value + ' ' + password.value)
  store.dispatch('login', {
    email: email.value,
    password: password.value,
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
  <div class="">
    <h1>Logg inn</h1>

    <form @submit.prevent="submit()">
      <BaseInput v-model="email" label="Email" />

      <BaseInput v-model="password" label="Password" type="password" />

      <BaseButton type="submit" :disabled="notValid">Submit</BaseButton>
    </form>
  </div>
</template>

