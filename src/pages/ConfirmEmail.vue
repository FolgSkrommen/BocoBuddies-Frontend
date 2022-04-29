<script setup lang="ts">
import UserCard, { User } from '../components/UserCard.vue'
import BaseBtn from '../components/base/BaseBtn.vue'
import BasePopup from '../components/base/BasePopup.vue'
import router from '../router'
import { useRoute } from 'vue-router'
import axios from 'axios'

const { params } = useRoute()
let confirmEmailString: string
confirmEmailString = String(params.confirmEmailString)
console.log(confirmEmailString)
let success = false
let fail: boolean = false

async function verify() {
	await axios
		.post('/verify', null, {
			params: {
				confirmString: confirmEmailString,
			},
		})
		.then(response => {
			console.log(response)
			router.push('/')
			success = true
		})
		.catch(err => {
			success = false
			fail = true
		})
}
</script>

<template>
	<div v-if="success">
		<h2>Din email har blitt verifisert</h2>
	</div>
	<div v-else>
		<h2>Hei!</h2>
		<h3>Klikk knappen for å verifisere deg selv!</h3>
		<BaseBtn @click="verify">Verifiser!</BaseBtn>
	</div>
	<BasePopup v-show="fail" @exit="fail = false"
		>Det skjedde en feil</BasePopup
	>
</template>
