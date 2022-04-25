import { shallowMount } from '@vue/test-utils'
import BaseDropdown from '@/components/base/BaseDropdown.vue'

describe('BaseDropdown', () => {
	describe('when', () => {
		const wrapper = shallowMount(BaseDropdown, {
			props: {
				modelValue: 0,
				alternatives: [],
			},
		})
	})
})
