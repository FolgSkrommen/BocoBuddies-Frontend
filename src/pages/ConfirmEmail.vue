<script setup lang="ts">
import BaseBtn from '../components/base/BaseBtn.vue'
import BasePopup from '../components/base/BasePopup.vue'
import router from '../router'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { ref } from 'vue'
import { store } from '../store'

const { params } = useRoute()
let confirmEmailString: string
confirmEmailString = String(params.confirmEmailString)
console.log(confirmEmailString)
let fail = ref(false)
let res = ''
let success = ref(false)

async function verify() {
	try {
		const response = await axios.post('/verify', null, {
			params: {
				confirmString: confirmEmailString,
			},
		})
		res = response.data
		success = ref(true)
	} catch (error) {}
	console.log(res)
	router.push('/')
	await store.dispatch('logout')
	await router.push('/')
	console.log('logging out')
}
</script>

<template>
	<div v-if="success">
		<h2>Din email har blitt verifisert</h2>
	</div>
	<div v-else>
		<h2>Hei!</h2>
		<h3>Klikk knappen for å verifisere deg selv!</h3>
		<h3>Vennligst log inn igjen etter at du har verifisert deg selv</h3>
		<BaseBtn @click="verify">Verifiser!</BaseBtn>
	</div>
	<BasePopup v-show="fail" @exit="fail = false"
		>Det skjedde en feil</BasePopup
	>
</template>
