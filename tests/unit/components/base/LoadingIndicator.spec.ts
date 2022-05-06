import { mount, shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import LoadingIndicator from '../../../../src/components/base/LoadingIndicator.vue'

describe('LoadingIndicator', () => {
	describe('when loaded', () => {
		it('has its comoponents and spin attribute', () => {
			const wrapper = mount(LoadingIndicator)
			const svg = wrapper.find('[data-testid="svg"]')
			expect(svg.attributes().class).include('animate-spin')
			expect(svg.exists()).toBe(true)
		})
	})
})
