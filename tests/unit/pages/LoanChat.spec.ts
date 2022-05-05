import { describe, expect, it, vi } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import Chat from '../../../src/pages/loan/LoanChat.vue'
import {
	Chat as ChatModel,
	Filter,
	Item,
	Loan,
	Message,
	Position,
	User,
} from '../../../src/api/schema'
import axios from 'axios'

let mockPayload: any = {
	body: {
		loaner: 1,
		date: 'date',
		start: 'start',
		end: 'end',
		returned: false,
		active: true,
		price: 100,
	},
}

let mockItem: Item = {
	itemId: 2,
	name: 'Item',
	description: 'Desc',
	price: 100,
	priceUnit: 'DAYS',
	postalCode: '8006',
	address: 'Kongesn',
	position: {
		lat: 10,
		lng: 10,
	},
	images: ['1'],
	active: true,
	availableFrom: 'Date',
	availableTo: 'Date',
	categories: ['test'],
	filters: [
		{
			id: 1,
			value: 'filter',
		},
	],
}
let chatMock: ChatModel = {
	chatId: 1,
	chatName: 'TestChat',
	item: mockItem,
}

let mockUser: User = {
	firstName: 'navn',
	lastName: 'forett',
	rating: 1,
	trusted: false,
	userId: 2,
	username: 'Olav',
	verified: false,
}

let mockLoan: Loan = {
	active: false,
	chatId: 0,
	creationDate: '',
	end: '',
	itemId: 0,
	loaner: 0,
	price: 0,
	returned: false,
	start: '',
}

describe('when loaded', () => {
	it('has the required elements (loading)', async () => {
		const wrapper = mount(Chat)
		wrapper.vm.status = 'loading'
		await wrapper.vm.$forceUpdate()
		expect(wrapper.exists()).toBe(true)
		expect(wrapper.find('[data-testid="loading"]').exists()).toBe(true)
	})
	it('has the required elements', async () => {
		const wrapper = mount(Chat)

		expect(wrapper.exists()).toBe(true)

		wrapper.vm.status = 'loaded'

		await wrapper.vm.$forceUpdate()

		expect(wrapper.find('[data-testid="message-input"]').exists()).toBe(
			true
		)
		expect(wrapper.find('[data-testid="submit-button"]').exists()).toBe(
			true
		)
	})

	it('Loads Request button when', async () => {
		const wrapper = mount(Chat)
		expect(wrapper.exists()).toBe(true)

		wrapper.vm.chat = {
			chatId: 1,
			itemId: 1,
			chatName: 'Name',
		}
		wrapper.vm.item = {
			name: 'Name',
			description: 'Desc',
			price: 100,
			priceUnit: 'Test',
			postalCode: 'code',
			address: 'as',
			images: ['asd', 'asd'],
			availableFrom: 'from',
			availableTo: 'to',
			categories: ['test', 'test'],
		}

		wrapper.vm.loanStatus = 'NOT_SENT'
		expect(wrapper.find('[data-testid="rent-button"]').exists()).toBe(false)
		expect(wrapper.find('[data-testid="loan-modal"]').exists()).toBe(false)
		expect(
			wrapper.find('[data-testid="feedback-button"]').exists()
		).not.toBe(true)
	})

	vi.spyOn(axios, 'get')

	it('Axios get is called at start up', async () => {
		const wrapper = mount(Chat)
		expect(axios.get).toHaveBeenCalledTimes(3)
		expect(axios.get).toBeCalledWith('/message?chatId=undefined')
	})
})

describe('Testing websocket sending functions', async () => {
	vi.spyOn(axios, 'delete')

	it('Testing sendLoanDecline ', async () => {
		const wrapper = mount(Chat)

		wrapper.vm.stompClient = 'test'
		wrapper.vm.chat = chatMock
		wrapper.vm.store.state.user = mockUser

		wrapper.vm.sendLoanDecline()
		expect(axios.delete).toHaveBeenCalledTimes(1)
		expect(axios.delete).toBeCalledWith('/loan?loanId=undefined')
	})

	vi.spyOn(axios, 'post')
	it('Testing sendMessage ', async () => {
		const wrapper = mount(Chat)

		wrapper.vm.stompClient = 'test'
		wrapper.vm.chat = chatMock
		wrapper.vm.store.state.user = mockUser

		wrapper.vm.sendMessage()
		expect(axios.post).toHaveBeenCalledTimes(1)
	})

	vi.spyOn(axios, 'put')
	it('Testing sendLoanAccept ', async () => {
		const wrapper = mount(Chat)

		wrapper.vm.stompClient = 'test'
		wrapper.vm.chat = chatMock
		wrapper.vm.store.state.user = mockUser
		wrapper.vm.loan = mockLoan

		wrapper.vm.sendLoanAccept()
		expect(axios.put).toHaveBeenCalledTimes(1)
	})
})

describe('Testing websocket receiving functions', async () => {
	/*
	const wrapper = mount(Chat)
	wrapper.vm.price = 100
	wrapper.vm.stompClient = 'test'
	wrapper.vm.chat = chatMock
	wrapper.vm.store.state.user = mockUser

	it('Testing onLoanAccept loan accepted', async () => {
		mockPayload.body.active = true
		mockPayload.body.returned = false
		wrapper.vm.onLoanAccept(JSON.stringify(mockPayload))
		expect(wrapper.vm.loanStatus === 'ACCEPTED')
	})
	vi.spyOn(axios, 'get')
	it('Testing onLoanAccept loan accepted', async () => {
		mockPayload.body.active = true
		mockPayload.body.returned = true
		wrapper.vm.onLoanAccept(JSON.stringify(mockPayload))
		expect(wrapper.vm.loanStatus === 'RETURNED')
		expect(axios.get).toHaveBeenCalledTimes(1)
	})

	it('Testing onLoanAccept loan denied', async () => {
		mockPayload.body.active = false
		mockPayload.body.returned = false
		wrapper.vm.onLoanAccept(JSON.stringify(mockPayload))
		expect(wrapper.vm.loanStatus === 'NOT_SENT')
	})


	 */
})

describe('Testing methods for updating views / popups etc', async () => {
	it('Testing reRenderChat is working', async () => {
		const wrapper = mount(Chat)
		expect(wrapper.vm.render).toBe(0)
		wrapper.vm.reRenderChat()
		expect(wrapper.vm.render).toBe(1)
		wrapper.vm.reRenderChat()
		expect(wrapper.vm.render).toBe(2)
	})

	it('Get Price Unit for different units', async () => {
		const wrapper = mount(Chat)
		expect(wrapper.vm.getPriceUnit('DAY')).toBe('Dag')
		expect(wrapper.vm.getPriceUnit('HOUR')).toBe('Time')
		expect(wrapper.vm.getPriceUnit('WEEK')).toBe('Uke')
		expect(wrapper.vm.getPriceUnit('MONTH')).toBe('Måned')
		expect(wrapper.vm.getPriceUnit('YEAR')).toBe('År')
	})

	it('Testing userReviewved', async () => {
		const wrapper = mount(Chat)
		wrapper.vm.userReviewed()
		expect(wrapper.vm.loanStatus).toBe('REVIEWED')
		expect(wrapper.vm.showRateUserPopup).toBe(false)
	})
})
