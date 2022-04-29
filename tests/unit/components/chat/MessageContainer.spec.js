import { mount, shallowMount } from '@vue/test-utils'
import MessageContainer from '@/components/chat/MessageContainer.vue'

describe('MessageContainer', () => {
	describe('when loaded', () => {
		it('Component exists', () => {
			const wrapper = mount(MessageContainer, {
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
