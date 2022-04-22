import { shallowMount } from '@vue/test-utils'
import UserRegister from '@/pages/UserRegister.vue'

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
})
