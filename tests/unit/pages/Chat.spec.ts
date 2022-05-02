import { describe, expect, it } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import Chat from '../../../src/pages/community/Chat.vue'

describe('when loaded', () => {
	it('has the required elements', async () => {
		const wrapper = mount(Chat)

		expect(wrapper.exists()).toBe(true)

		expect(wrapper.find('[data-testid="message-input"]').exists()).toBe(
			true
		)
		expect(wrapper.find('[data-testid="submit-button"]').exists()).toBe(
			true
		)
		expect(wrapper.find('[data-testid="rent-button"]').exists()).toBe(true)
		expect(wrapper.find('[data-testid="loan-modal"]').exists()).toBe(true)
		expect(
			wrapper.find('[data-testid="feedback-button"]').exists()
		).not.toBe(true)
	})
})
