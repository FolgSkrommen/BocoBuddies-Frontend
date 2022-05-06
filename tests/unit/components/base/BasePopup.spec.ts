import { mount, shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import BasePopup from '../../../../src/components/base/BasePopup.vue'

describe('BasePopup', () => {
	describe('when loaded', () => {
		it('Component loads correctly', () => {
			const wrapper = mount(BasePopup)
			expect(wrapper.exists()).toBe(true)

			const card = wrapper.find('[data-testid="card"]')
			expect(card.exists()).toBe(true)
		})
	})
})
