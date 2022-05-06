<script setup lang="ts">
import UserCard from './UserCard.vue'
import BaseBtn from './base/BaseBtn.vue'
import { User } from '../api/schema'

const emit = defineEmits(['button-clicked', 'user-clicked'])

function userClicked(user: User) {
	emit('user-clicked', user)
}
function buttonClicked(user: User) {
	emit('button-clicked', user)
}
interface Props {
	user: User
	btnTxt: string
	btnDsbld: boolean
	to?: string
}
const { user, btnTxt } = defineProps<Props>()
</script>

<template>
	<UserCard
		:user="user"
		@click="userClicked(user)"
		:to="to"
		data-testid="user-card"
	>
		<BaseBtn
			@click="buttonClicked(user)"
			:disabled="btnDsbld"
			data-testid="button"
			>{{ btnTxt }}</BaseBtn
		>
	</UserCard>
</template>
