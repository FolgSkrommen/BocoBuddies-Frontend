import { mount, shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import BasePopup from '../../../../src/components/base/BasePopup.vue'

describe('BasePopup', () => {
	describe('when loaded', () => {
		it('Component loads correctly', () => {
			const wrapper = shallowMount(BasePopup)

			expect(wrapper.exists()).toBe(true)
		})
	})
})
