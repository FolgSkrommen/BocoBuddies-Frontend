import { mount, shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Card from '../../../src/components/Card.vue'

describe('Card', () => {
	describe('when loaded', () => {
		it('Component loads correctly', () => {
			const wrapper = shallowMount(Card)
			expect(wrapper.exists())
		})
		it('Check slot is rendered correct', () => {
			const wrapper = mount(Card, {
				slots: {
					default: 'MainContent',
				},
			})

			expect(wrapper.find('[data-testid="slot"]').exists())
			expect(
				wrapper.find('[data-testid="slot"]').element.textContent
			).toContain('MainContent')
		})
	})
})
