import { mount, shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import FloatingBtn from '../../../../src/components/base/FloatingBtn.vue'

describe('BaseBtn', () => {
	describe('when loaded', () => {
		it('without "to" it is button and default color', () => {
			const wrapper = mount(FloatingBtn)
			const button = wrapper.find('[data-testid="button"]')
			expect(button.exists()).toBe(true)
			expect(button.attributes().class).include('bg-blue')
		})
		it('with "to" it is router-link and default color', () => {
			const wrapper = mount(FloatingBtn, {
				props: {
					to: '/',
				},
			})

			const routerLink = wrapper.find('[data-testid="router-link"]')
			expect(routerLink.exists()).toBe(true)

			expect(routerLink.attributes().class).include('bg-blue')
		})
	})
})
