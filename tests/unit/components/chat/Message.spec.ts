import { mount, shallowMount } from '@vue/test-utils'
import Message from '../../../../src/components/chat/Message.vue'
import { describe, expect, it } from 'vitest'

describe('Message', () => {
	describe('when loaded', () => {
		it('Component exists when receive true', () => {
			const wrapper = mount(Message, {
				props: {
					receive: true,
				},
			})
			expect(wrapper.exists()).toBe(true)
		})

		it('Component exists when receive false', () => {
			const wrapper = mount(Message, {
				props: {
					receive: false,
				},
			})
			expect(wrapper.exists()).toBe(true)
		})
	})
})
