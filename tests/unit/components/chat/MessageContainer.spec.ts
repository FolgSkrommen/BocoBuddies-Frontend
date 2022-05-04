import { mount, shallowMount } from '@vue/test-utils'
import MessageContainer from '../../../../src/components/chat/MessageContainer.vue'
import { describe, expect, it } from 'vitest'

describe('MessageContainerLoan', () => {
	describe('when loaded', () => {
		const messages = [
			{
				senderId: 1,
				message: 'Test message',
				type: 'CHAT',
				date: new Date().toString(),
				receive: true,
				chatId: '1',
			},
		]

		it('Component exists', () => {
			const wrapper = mount(MessageContainer, {
				props: {
					messages,
				},
			})
			expect(wrapper.exists()).toBe(true)
		})
		it('Message is rendered', () => {
			const wrapper = mount(MessageContainer, {
				props: {
					messages,
				},
			})
			const message = wrapper.findAll('[data-testid="message"]')

			expect(message.length).toBe(1)
		})
		it('Message info is rendered', () => {
			const wrapper = mount(MessageContainer, {
				props: {
					messages,
				},
			})
			const messageInfo = wrapper.find('[data-testid="message-info"]')
			expect(wrapper.props().messages[0].senderId).toBe(1)
			expect(messageInfo.exists()).toBe(true)
			expect(messageInfo.element.textContent).toContain('Usikkert - ')
			expect(messageInfo.element.textContent).not.toContain(' - Usikkert')
		})
		it('Chat box is rendered', () => {
			const wrapper = mount(MessageContainer, {
				props: {
					messages,
				},
			})
			const messageInfo = wrapper.find('[data-testid="chat"]')
			expect(messageInfo.exists()).toBe(true)
		})
	})
})
