import UserRegister from '../../../src/pages/UserRegister.vue'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { expect, it, describe, vi } from 'vitest'

import axios from 'axios'
export default {
	get: vi.fn(() => Promise.resolve({ data: {} })),
}
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
	})
	it('Passwords the different', () => {
		const wrapper = shallowMount(UserRegister)

		wrapper.vm.password = 'same1234Diff'
		wrapper.vm.passwordCheck = 'same1234'
		expect(wrapper.vm.password).not.toEqual(wrapper.vm.passwordCheck)
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

	it('register api is called when all fields are valid and submit is clicked', async () => {
		const wrapper = shallowMount(UserRegister, {
			axios: axios,
		})
		const mockedAxios = vi.spyOn(axios, 'post')

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

		wrapper.vm.passwordCheck = '12345678'
		expect(wrapper.vm.passwordCheck).toBe('12345678')
		expect(wrapper.vm.passwordCheck).not.toBe('Wrong value')

		await wrapper
			.find('[data-testid="register-form"]')
			.trigger('submit.prevent')

		expect(mockedAxios).toHaveBeenCalledTimes(1)
		expect(mockedAxios).toHaveBeenCalledWith('/user/register', {
			address: 'Address',
			email: 'email@gmail.com',
			firstName: 'First',
			lastName: 'Last',
			password: '12345678',
			phoneNumber: 95444369,
			postalCode: '7003',
			username: 'username',
		})
	})
})
