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
		it('Message info is rendered', () => {
			const wrapper = mount(MessageContainer, {
				props: {
					chatData,
				},
			})
			const messageInfo = wrapper.find('[data-testid="message-info"]')
			expect(wrapper.props().chatData.messages[0].senderId).toBe(1)
			expect(messageInfo.exists()).toBe(true)
			expect(messageInfo.element.textContent).toContain(' - 1')
			expect(messageInfo.element.textContent).not.toContain(' - 2')
		})
		it('Chat box is rendered', () => {
			const wrapper = mount(MessageContainer, {
				props: {
					chatData,
				},
			})
			const messageInfo = wrapper.find('[data-testid="chat"]')
			expect(messageInfo.exists()).toBe(true)
		})
	})
})
