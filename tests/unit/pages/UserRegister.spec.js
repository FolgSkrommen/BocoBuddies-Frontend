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
		expect(wrapper.find('[data-testid="phonenumber-input"]').exists()).toBe(
			true
		)
		expect(wrapper.find('[data-testid="address-input"]').exists()).toBe(
			true
		)
		expect(wrapper.find('[data-testid="postalcode-input"]').exists()).toBe(
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

	// Following lines tell Jest to mock any call to `axios.get`
	// and to return `mockPostList` instead
	jest.spyOn(axios, 'post')

	it('register api is called when all fialds are valid and submit is clicked', () => {
		const wrapper = shallowMount(UserRegister)

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

		wrapper.vm.postalcode = '7003'
		expect(wrapper.vm.postalcode).toBe('7003')
		expect(wrapper.vm.postalcode).not.toBe('Wrong value')

		wrapper.vm.phonenumber = 95444369
		expect(wrapper.vm.phonenumber).toBe(95444369)
		expect(wrapper.vm.phonenumber).not.toBe(0)

		wrapper.vm.password = '12345678'
		expect(wrapper.vm.password).toBe('12345678')
		expect(wrapper.vm.password).not.toBe('Wrong value')

		wrapper.vm.passwordCheck = '12345678'
		expect(wrapper.vm.passwordCheck).toBe('12345678')
		expect(wrapper.vm.passwordCheck).not.toBe('Wrong value')

		wrapper.find('[data-testid="register-form"]').trigger('submit.prevent')

		expect(axios.post).toHaveBeenCalledTimes(1)
		expect(axios.post).toHaveBeenCalledWith('/user/register', {
			address: 'Address',
			email: 'email@gmail.com',
			firstName: 'First',
			lastName: 'Last',
			password: '12345678',
			phonenumber: 95444369,
			postalcode: '7003',
			username: 'username',
		})
	})
})
