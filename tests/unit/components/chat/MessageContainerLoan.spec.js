import { mount, shallowMount } from '@vue/test-utils'
import MessageContainerLoan from '@/components/chat/MessageContainerLoan.vue'

describe('MessageContainerLoan', () => {
	describe('when loaded', () => {
		it('Component exists', () => {
			const wrapper = mount(MessageContainerLoan, {
				props: {
					chatData: {
						messages: [
							{
								type: 'CHAT',
								receive: true,
								message: 'I love testing <3',
							},
						],
					},
				},
			})
			expect(wrapper.exists()).toBe(true)
		})
	})
})
