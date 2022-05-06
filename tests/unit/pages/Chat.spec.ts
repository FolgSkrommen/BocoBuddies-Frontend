import { describe, expect, it, vi } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import Chat from '../../../src/pages/community/Chat.vue'
import axios from 'axios'

describe('when loaded', () => {
	it('has the required elements (loading)', async () => {
		const wrapper = mount(Chat)

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

	it('has the required elements (loading)', async () => {
		try {
			const wrapper = await mount(Chat)
			wrapper.vm.status = 'loading'
			await wrapper.vm.$forceUpdate()
			expect(wrapper.exists()).toBe(true)
			expect(wrapper.find('[data-testid="loading"]').exists()).toBe(true)
		} catch (error) {
			expect(true).toBe(false)
		}
	})

	vi.spyOn(axios, 'get')

	it('Axios get is called at start up', async () => {
		const wrapper = await mount(Chat)
		expect(axios.get).toHaveBeenCalledTimes(3)
		expect(axios.get).toBeCalledWith('/message?chatId=undefined')
	})
})
