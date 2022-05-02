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

it('login api is called when all fields are valid and submit is clicked', async () => {
	const wrapper = shallowMount(UserLogin)

	wrapper.vm.username = 'user@mail.com'
	expect(wrapper.vm.username).toBe('user@mail.com')

	wrapper.vm.password = '12345678'

	await wrapper.vm.$forceUpdate()

	const button = wrapper.find('[data-testid="submit-button"')

	expect(button.attributes().disabled).toBe('true')

	await wrapper.find('[data-testid="login-form"]').trigger('submit.prevent')

	expect(axios.post).toHaveBeenCalledTimes(1)
})

it('Form is invalid if password under 8 char', async () => {
	const wrapper = shallowMount(UserLogin)

	wrapper.vm.username = 'user@mail.com'

	wrapper.vm.password = '12345'
	await wrapper.vm.$forceUpdate()

	expect(wrapper.vm.notValid).toBe(true)
})
