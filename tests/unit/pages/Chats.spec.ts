import { describe, expect, it, vi } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import Chat from '../../../src/pages/loan/Chats.vue'
import axios from 'axios'

describe('when loaded', () => {
	it('has the required elements and loader is loaded', async () => {
		const wrapper = shallowMount(Chat)
		expect(wrapper.exists()).toBe(true)
		expect(wrapper.find('[data-testid="error"]').exists()).toBe(false)
		expect(wrapper.find('[data-testid="loader"]').exists()).toBe(true)
	})

	vi.spyOn(axios, 'get')

	it('Axios get is called at start up', async () => {
		const wrapper = shallowMount(Chat)
		expect(axios.get).toHaveBeenCalledTimes(2)
		expect(axios.get).toBeCalledWith('/chat/getByUser/market')
	})

	it('Check header is loaded if loading is set to false', async () => {
		const wrapper = shallowMount(Chat)
		expect(wrapper.exists()).toBe(true)
		wrapper.vm.status = 'loaded'
		await wrapper.vm.$forceUpdate()
		expect(wrapper.find('[data-testid="header"]').exists()).toBe(true)
		expect(wrapper.find('[data-testid="header"]').text()).toBe('Samtaler')
	})

	it('Check base banner error is loaded', async () => {
		const wrapper = shallowMount(Chat)
		expect(wrapper.exists()).toBe(true)
		expect(wrapper.find('[data-testid="error"]').exists()).toBe(false)
		wrapper.vm.status = 'error'
		await wrapper.vm.$forceUpdate()
		expect(wrapper.find('[data-testid="error"]').exists()).toBe(true)
	})
})
