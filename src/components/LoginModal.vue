<script setup lang="ts">
import BaseModal from './base/BaseModal.vue'
import BaseBtn from './base/BaseBtn.vue'

//THIS COMPONENT IS NOT GOING TO BE USED, SO DON'T USE IT (yet)
//THIS COMPONENT IS NOT GOING TO BE USED, SO DON'T USE IT (yet)
//THIS COMPONENT IS NOT GOING TO BE USED, SO DON'T USE IT (yet)
//THIS COMPONENT IS NOT GOING TO BE USED, SO DON'T USE IT (yet)
//THIS COMPONENT IS NOT GOING TO BE USED, SO DON'T USE IT (yet)
//THIS COMPONENT IS NOT GOING TO BE USED, SO DON'T USE IT (yet)
//THIS COMPONENT IS NOT GOING TO BE USED, SO DON'T USE IT (yet)
//THIS COMPONENT IS NOT GOING TO BE USED, SO DON'T USE IT (yet)
//THIS COMPONENT IS NOT GOING TO BE USED, SO DON'T USE IT (yet)
//THIS COMPONENT IS NOT GOING TO BE USED, SO DON'T USE IT (yet)
//THIS COMPONENT IS NOT GOING TO BE USED, SO DON'T USE IT (yet)
//THIS COMPONENT IS NOT GOING TO BE USED, SO DON'T USE IT (yet)

interface Props {
	modelValue: boolean
}

const emit = defineEmits(['update:modelValue'])

const cancel = () => {
	emit('update:modelValue', !modelValue)
}

const { modelValue } = defineProps<Props>()
</script>

<template>
	<div>
		<BaseModal :modelValue="modelValue" title="Title">
			<template v-slot:header> Vil du logge inn? </template>
			<template v-slot:body> </template>
			<template v-slot:footer>
				<div class="grid gap-4 grid-cols-2">
					<BaseBtn @click="cancel">Tilbake</BaseBtn>
					<BaseBtn to="/user-login">Logg inn</BaseBtn>
				</div>
			</template>
		</BaseModal>
	</div>
</template>
