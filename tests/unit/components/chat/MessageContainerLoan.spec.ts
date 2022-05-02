import { mount, shallowMount } from '@vue/test-utils'
import MessageContainerLoan from '../../../../src/components/chat/MessageContainerLoan.vue'
import { describe, expect, it } from 'vitest'

describe('MessageContainerLoan', () => {
	const chatDataMessage = [
		{
			senderId: 1,
			message: 'Test message',
			type: 'CHAT',
			date: new Date().toString(),
			receive: true,
			chatId: '1',
		},
	]

	const chatDataRequest = [
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
	]

	const chatDataAccept = [
		{
			senderId: 1,
			message: 'Test message',
			type: 'ACCEPT',
			date: new Date().toString(),
			receive: true,
			chatId: '1',
			start: 'Start',
			end: 'End',
			price: 100,
		},
	]

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
					messages: chatDataMessage,
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
					messages: chatDataMessage,
					modelValue: loanStatus,
					chat: chat,
					item: item,
				},
			})
			const message = wrapper.find('[data-testid="message"]')
			expect(wrapper.props().messages[0].message).toBe('Test message')
			expect(message.exists()).toBe(true)
			expect(message.element.textContent).toBe('Test message')
		})
		it('Request message is visible with buttons', () => {
			loanStatus = 'PENDING'
			const wrapper = mount(MessageContainerLoan, {
				props: {
					messages: chatDataRequest,
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

		it('Request message is visible without buttons', () => {
			loanStatus = 'PENDING'
			chatDataRequest[0].receive = false
			const wrapper = mount(MessageContainerLoan, {
				props: {
					messages: chatDataRequest,
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
			expect(requestButtonDecline.exists()).toBe(false)
			expect(requestButtonConfirm.exists()).toBe(false)
		})

		it('Request message info is correct receive', () => {
			loanStatus = 'PENDING'

			const wrapper = mount(MessageContainerLoan, {
				props: {
					messages: chatDataRequest,
					modelValue: loanStatus,
					chat: chat,
					item: item,
				},
			})
			const request = wrapper.find('[data-testid="request-h"]')

			expect(request.exists()).toBe(true)
		})

		it('Request message info is correct send', () => {
			loanStatus = 'PENDING'
			chatDataRequest[0].receive = false
			const wrapper = mount(MessageContainerLoan, {
				props: {
					messages: chatDataRequest,
					modelValue: loanStatus,
					chat: chat,
					item: item,
				},
			})
			const request = wrapper.find('[data-testid="request-h"]')

			expect(request.exists()).toBe(true)
			expect(request.element.textContent).toBe(' Forespørsel ')
		})

		it('Accept header comes up when accepted receive', () => {
			loanStatus = 'ACCEPTED'
			//chatDataRequest.messages[0].receive = false
			const wrapper = mount(MessageContainerLoan, {
				props: {
					messages: chatDataAccept,
					modelValue: loanStatus,
					chat: chat,
					item: item,
				},
			})
			const request = wrapper.find('[data-testid="accept-h"]')

			expect(request.exists()).toBe(true)
			expect(request.element.textContent).toBe(' Avtalt lån ')
		})

		it('Accept header comes up when accepted send', () => {
			loanStatus = 'ACCEPTED'
			chatDataRequest[0].receive = false
			const wrapper = mount(MessageContainerLoan, {
				props: {
					messages: chatDataAccept,
					modelValue: loanStatus,
					chat: chat,
					item: item,
				},
			})
			const request = wrapper.find('[data-testid="accept-h"]')

			expect(request.exists()).toBe(true)
			expect(request.element.textContent).toBe(' Avtalt lån ')
		})

		it('Returned header comes up when accepted receive', () => {
			loanStatus = 'RETURNED'
			//chatDataRequest.messages[0].receive = false
			chatDataAccept[0].type = 'RETURNED'
			const wrapper = mount(MessageContainerLoan, {
				props: {
					messages: chatDataAccept,
					modelValue: loanStatus,
					chat: chat,
					item: item,
				},
			})
			const request = wrapper.find('[data-testid="returned-h"]')

			expect(request.exists()).toBe(true)
			expect(request.element.textContent).toBe(' Lån tilbakelevert ')
		})

		it('Returned header comes up when accepted send', () => {
			loanStatus = 'RETURNED'
			chatDataRequest[0].receive = false
			chatDataAccept[0].type = 'RETURNED'
			const wrapper = mount(MessageContainerLoan, {
				props: {
					messages: chatDataAccept,
					modelValue: loanStatus,
					chat: chat,
					item: item,
				},
			})
			const request = wrapper.find('[data-testid="returned-h"]')

			expect(request.exists()).toBe(true)
			expect(request.element.textContent).toBe(' Lån tilbakelevert ')
		})
	})
})
