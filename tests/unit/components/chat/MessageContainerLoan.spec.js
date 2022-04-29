import { mount, shallowMount } from '@vue/test-utils'
import MessageContainerLoan from '@/components/chat/MessageContainerLoan.vue'

describe('MessageContainerLoan', () => {
	const chatDataMessage = {
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

	const chatDataRequest = {
		userId: 1,
		messages: [
			{
				senderId: 1,
				message: 'Test message',
				type: 'REQUEST',
				date: new Date().toString(),
				receive: true,
				chatId: '1',
				start: 'Start',
				end: 'End',
				price: 100,
			},
		],
	}

	const chat = {
		chatId: '1',
		itemId: '2',
		chatName: 'Test chatName',
	}

	const item = {
		name: 'Item name',
		description: 'description',
		price: 100,
		priceUnit: 'DAYS',
		postalCode: '8006',
		address: 'Gate',
		images: ['img'],
		availableFrom: 'from',
		availableTo: 'to',
		categories: ['cat1', 'cat2'],
	}

	let loanStatus = 'UNDEFINED'

	describe('when loaded', () => {
		it('Component exists', () => {
			const wrapper = mount(MessageContainerLoan, {
				props: {
					chatData: chatDataMessage,
					modelValue: loanStatus,
					chat: chat,
					item: item,
				},
			})
			expect(wrapper.exists()).toBe(true)
		})

		it('Chat message is visible', () => {
			const wrapper = mount(MessageContainerLoan, {
				props: {
					chatData: chatDataMessage,
					modelValue: loanStatus,
					chat: chat,
					item: item,
				},
			})
			const message = wrapper.find('[data-testid="message"]')
			expect(wrapper.props().chatData.messages[0].message).toBe(
				'Test message'
			)
			expect(message.exists()).toBe(true)
			expect(message.element.textContent).toBe('Test message')
		})
		it('Request message is visible with buttons', () => {
			loanStatus = 'PENDING'
			const wrapper = mount(MessageContainerLoan, {
				props: {
					chatData: chatDataRequest,
					modelValue: loanStatus,
					chat: chat,
					item: item,
				},
			})
			const requestButtonDecline = wrapper.find(
				'[data-testid="decline-btn"]'
			)
			const requestButtonConfirm = wrapper.find(
				'[data-testid="confirm-btn"]'
			)
			expect(requestButtonDecline.exists()).toBe(true)
			expect(requestButtonConfirm.exists()).toBe(true)
		})
	})
})
