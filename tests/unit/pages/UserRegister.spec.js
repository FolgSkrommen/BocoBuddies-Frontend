import { shallowMount } from '@vue/test-utils'
import UserRegister from '@/pages/UserRegister.vue'
import axios from 'axios'

describe('UserRegister', () => {
	it('when loaded has the required elements', () => {
		const wrapper = shallowMount(UserRegister)

		expect(wrapper.find('[data-testid="username-input"]').exists()).toBe(
			true
		)
		expect(wrapper.find('[data-testid="firstName-input"]').exists()).toBe(
			true
		)
		expect(wrapper.find('[data-testid="lastName-input"]').exists()).toBe(
			true
		)
		expect(wrapper.find('[data-testid="email-input"]').exists()).toBe(true)
		expect(wrapper.find('[data-testid="phoneNumber-input"]').exists()).toBe(
			true
		)
		expect(wrapper.find('[data-testid="address-input"]').exists()).toBe(
			true
		)
		expect(wrapper.find('[data-testid="postalCode-input"]').exists()).toBe(
			true
		)
		expect(wrapper.find('[data-testid="password-input"]').exists()).toBe(
			true
		)
		expect(
			wrapper.find('[data-testid="passwordCheck-input"]').exists()
		).toBe(true)
	})
	it('Form not valid if empty', () => {
		const wrapper = shallowMount(UserRegister)

		expect(wrapper.vm.notValid).toBe(true)
		expect(wrapper.vm.notValid).not.toBe(false)
	})
	it('Passwords the same', () => {
		const wrapper = shallowMount(UserRegister)

		wrapper.vm.password = 'same1234'
		wrapper.vm.passwordCheck = 'same1234'
		expect(wrapper.vm.password).toBe(wrapper.vm.passwordCheck)
		expect(wrapper.vm.passwordIsSame).toBe(true)
		expect(wrapper.vm.passwordIsSame).not.toBe(false)
	})
	it('Passwords the different', () => {
		const wrapper = shallowMount(UserRegister)

		wrapper.vm.password = 'same1234Diff'
		wrapper.vm.passwordCheck = 'same1234'
		expect(wrapper.vm.passwordIsSame).toBe(false)
		expect(wrapper.vm.passwordIsSame).not.toBe(true)
	})
	it('button disabled if form invalid', () => {
		const wrapper = shallowMount(UserRegister)

		expect(wrapper.find('[data-testid="submit-button"]').exists()).toBe(
			true
		)

		expect(
			wrapper.find('[data-testid="submit-button"]').attributes().disabled
		).toBeDefined()
		expect(
			wrapper.find('[data-testid="submit-button"]').attributes().enabled
		).not.toBeDefined()
	})

	const mockPostList = [
		{ id: 1, title: 'title1' },
		{ id: 2, title: 'title2' },
	]

	// Following lines tell Jest to mock any call to `axios.get`
	// and to return `mockPostList` instead
	jest.spyOn(axios, 'post').mockResolvedValue(mockPostList)

	it('register api is called when all fialds are valid and submit is clicked', () => {
		const wrapper = shallowMount(UserRegister)
		let username = wrapper.find('[data-testid="username-input"]')
		let firstName = wrapper.find('[data-testid="firstName-input"]')
		let lastName = wrapper.find('[data-testid="lastName-input"]')
		let email = wrapper.find('[data-testid="email-input"]')
		let phoneNumber = wrapper.find('[data-testid="phoneNumber-input"]')
		let address = wrapper.find('[data-testid="address-input"]')
		let postalCode = wrapper.find('[data-testid="postalCode-input"]')
		let password = wrapper.find('[data-testid="password-input"]')
		let passwordCheck = wrapper.find('[data-testid="passwordCheck-input"]')

		wrapper.vm.username = 'username'
		expect(wrapper.vm.username).toBe('username')
		expect(wrapper.vm.username).not.toBe('Wrong value')

		wrapper.vm.firstName = 'First'
		expect(wrapper.vm.firstName).toBe('First')
		expect(wrapper.vm.firstName).not.toBe('Wrong value')

		wrapper.vm.lastName = 'Last'
		expect(wrapper.vm.lastName).toBe('Last')
		expect(wrapper.vm.lastName).not.toBe('Wrong value')

		wrapper.vm.email = 'email@gmail.com'
		expect(wrapper.vm.email).toBe('email@gmail.com')
		expect(wrapper.vm.email).not.toBe('Wrong value')

		wrapper.vm.address = 'Address'
		expect(wrapper.vm.address).toBe('Address')
		expect(wrapper.vm.address).not.toBe('Wrong value')

		wrapper.vm.postalCode = '7003'
		expect(wrapper.vm.postalCode).toBe('7003')
		expect(wrapper.vm.postalCode).not.toBe('Wrong value')

		wrapper.vm.phoneNumber = 95444369
		expect(wrapper.vm.phoneNumber).toBe(95444369)
		expect(wrapper.vm.phoneNumber).not.toBe(0)

		wrapper.vm.password = '12345678'
		expect(wrapper.vm.password).toBe('12345678')
		expect(wrapper.vm.password).not.toBe('Wrong value')

		wrapper.find('[data-testid="submit-button"]').trigger('click')

		expect(axios.post).toHaveBeenCalledTimes(1)
		expect(axios.post).toHaveBeenCalledWith('/user/register', null, {
			params: {
				address: 'Address',
				email: 'email@gmail.com',
				firstName: 'First',
				lastName: 'Last',
				password: '12345678',
				phoneNumber: 95444369,
				postalCode: '7003',
			},
		})
	})
})
