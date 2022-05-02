import { expect, it, vi } from 'vitest'
import UserLogin from '../../../src/pages/UserLogin.vue'
import { mount, shallowMount } from '@vue/test-utils'
import axios from 'axios'

it('Loads components', async () => {
	const wrapper = mount(UserLogin)

	expect(wrapper.find('[data-testid="email-input"]').exists()).toBe(true)

	expect(wrapper.find('[data-testid="password-input"]').exists()).toBe(true)

	expect(wrapper.find('[data-testid="submit-button"]').exists()).toBe(true)

	expect(wrapper.find('[data-testid="register-link"]').exists()).toBe(true)
})

vi.spyOn(axios, 'post')

it('register api is called when all fields are valid and submit is clicked', () => {
	const wrapper = shallowMount(UserLogin)

	wrapper.vm.username = 'user@mail.com'
	expect(wrapper.vm.username).toBe('user@mail.com')

	wrapper.vm.password = '12345678'
	expect(wrapper.vm.password).toBe('12345678')

	wrapper.find('[data-testid="login-form"]').trigger('submit.prevent')

	expect(axios.post).toHaveBeenCalledTimes(1)
})
