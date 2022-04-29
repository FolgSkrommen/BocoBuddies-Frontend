import { mount, shallowMount } from '@vue/test-utils'
import MessageContainer from '@/components/chat/MessageContainer.vue'

describe('MessageContainerLoan', () => {
	describe('when loaded', () => {
		const chatData = {
			userId: 1,
			messages: [
				{
					senderId: 1,
					message: 'Test message',
					type: 'CHAT',
					date: new Date().toString(),
					receive: true,
					chatId: '1',
				},
			],
		}
		it('Component exists', () => {
			const wrapper = mount(MessageContainer, {
				props: {
					chatData,
				},
			})
			expect(wrapper.exists()).toBe(true)
		})
		it('Message is rendered', () => {
			const wrapper = mount(MessageContainer, {
				props: {
					chatData,
				},
			})
			const message = wrapper.find('[data-testid="message"]')
			expect(wrapper.props().chatData.messages[0].message).toBe(
				'Test message'
			)
			expect(message.exists()).toBe(true)
			expect(message.element.textContent).toBe('Test message')
		})
	})
})
