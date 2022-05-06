import { mount, shallowMount } from '@vue/test-utils'
import MessageContainerLoan from '../../../../src/components/chat/MessageContainerLoan.vue'
import { describe, expect, it } from 'vitest'
import { Chat, Item, Message, User } from '../../../../src/api/schema'

describe('MessageContainerLoan', () => {
	const chatDataMessage: Message[] = [
		{
			senderId: 1,
			message: 'Test message',
			type: 'CHAT',
			date: new Date().toString(),
			receive: true,
			chatId: 1,
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

	const mockItem: Item = {
		itemId: 1,
		position: {
			lat: 1,
			lng: 2,
		},
		active: true,
		filters: [
			{
				id: 1,
				value: '123',
			},
		],
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

	let mockUser: User = {
		firstName: '',
		lastName: '',
		rating: 0,
		trusted: false,
		userId: 0,
		username: '',
		verified: false,
	}

	const chat: Chat = {
		chatId: 1,
		item: mockItem,
		chatName: 'Test chatName',
		user: mockUser,
	}

	let loanStatus = 'UNDEFINED'

	describe('when loaded', () => {
		it('Component exists', () => {
			const wrapper = mount(MessageContainerLoan, {
				props: {
					messages: chatDataMessage,
					modelValue: loanStatus,
					chat: chat,
					item: mockItem,
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
					item: mockItem,
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
					item: mockItem,
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
					item: mockItem,
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
					item: mockItem,
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
					item: mockItem,
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
					item: mockItem,
				},
			})
			const request = wrapper.find('[data-testid="accept-h"]')

			expect(request.exists()).toBe(true)
			expect(request.element.textContent).toBe('Avtalt lån')
		})

		it('Accept header comes up when accepted send', () => {
			loanStatus = 'ACCEPTED'
			chatDataRequest[0].receive = false
			const wrapper = mount(MessageContainerLoan, {
				props: {
					messages: chatDataAccept,
					modelValue: loanStatus,
					chat: chat,
					item: mockItem,
				},
			})
			const request = wrapper.find('[data-testid="accept-h"]')

			expect(request.exists()).toBe(true)
			expect(request.element.textContent).toBe('Avtalt lån')
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
					item: mockItem,
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
					item: mockItem,
				},
			})
			const request = wrapper.find('[data-testid="returned-h"]')

			expect(request.exists()).toBe(true)
			expect(request.element.textContent).toBe(' Lån tilbakelevert ')
		})
	})

	describe('Function testing', async () => {
		it('getProperDateTime', () => {
			const wrapper = mount(MessageContainerLoan)
			expect(
				wrapper.vm.getProperDateTime(new Date().toISOString())
			).toHaveLength(5)
			expect(
				wrapper.vm.getProperDateTime(
					new Date('05 October 2000 14:48 UTC').toISOString()
				)
			).toHaveLength(10)
		})
		describe('messagePlacement ', () => {
			it('messagePlacement true tests', () => {
				const wrapper = mount(MessageContainerLoan)
				expect(wrapper.vm.messagePlacement(true)).toBe(
					'place-self-start'
				)
				expect(wrapper.vm.messagePlacement(true)).not.toBe(
					'place-self-end'
				)
			})
			it('messagePlacement false tests', () => {
				const wrapper = mount(MessageContainerLoan)
				expect(wrapper.vm.messagePlacement(false)).toBe(
					'place-self-end'
				)
				expect(wrapper.vm.messagePlacement(false)).not.toBe(
					'place-self-start'
				)
			})
			it('messagePlacement undefined tests', () => {
				const wrapper = mount(MessageContainerLoan)
				expect(wrapper.vm.messagePlacement(undefined)).toBe(
					'place-self-end'
				)
				expect(wrapper.vm.messagePlacement(undefined)).not.toBe(
					'place-self-start'
				)
			})
		})

		it('IsValidHttpUrl', () => {
			const wrapper = mount(MessageContainerLoan)

			expect(
				wrapper.vm.isValidHttpUrl(
					'https://vhudyma-blog.eu/3-ways-to-mock-axios-in-jest/'
				)
			).toBe(true)
			expect(
				wrapper.vm.isValidHttpUrl(
					'http://vhudyma-blog.eu/3-ways-to-mock-axios-in-jest/'
				)
			).toBe(true)
			expect(
				wrapper.vm.isValidHttpUrl(
					'hts://vhudyma-blog.eu/3-ways-to-mock-axios-in-jest/'
				)
			).toBe(false)
			expect(
				wrapper.vm.isValidHttpUrl(
					'https://vhudyma-blog/3-ways-to-mock-axios-in-jest/'
				)
			).toBe(true)
			expect(
				wrapper.vm.isValidHttpUrl(
					'https//vhudyma-blog.eu/3-ways-to-mock-axios-in-jest/'
				)
			).toBe(false)
		})

		describe('styleType', () => {
			it('text black (true)', () => {
				const wrapper = mount(MessageContainerLoan)

				expect(wrapper.vm.styleType(true)).toBe(
					'bg-slate-400 text-black '
				)
				expect(wrapper.vm.styleType(true)).not.toBe(
					'bg-blue-500 text-white justify-self-end'
				)
				expect(wrapper.vm.styleType(true)).not.toBe(
					'bg-blue-500 text-white'
				)
			})
			it('text white self-end (false)', () => {
				const wrapper = mount(MessageContainerLoan)

				expect(wrapper.vm.styleType(false)).not.toBe(
					'bg-slate-400 text-black '
				)
				expect(wrapper.vm.styleType(false)).toBe(
					'bg-blue-500 text-white justify-self-end'
				)
				expect(wrapper.vm.styleType(false)).not.toBe(
					'bg-blue-500 text-white'
				)
			})

			it('text white (undefined)', () => {
				const wrapper = mount(MessageContainerLoan)

				expect(wrapper.vm.styleType(undefined)).not.toBe(
					'bg-slate-400 text-black '
				)
				expect(wrapper.vm.styleType(undefined)).not.toBe(
					'bg-blue-500 text-white justify-self-end'
				)
				expect(wrapper.vm.styleType(undefined)).toBe(
					'bg-blue-500 text-white'
				)
			})
		})
	})
})
