import { describe, expect, it, vi } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import Chat from '../../../src/pages/community/Chat.vue'
import axios from 'axios'

describe('when loaded', () => {
	it('has the required elements', async () => {
		const wrapper = mount(Chat)

		expect(wrapper.exists()).toBe(true)
		expect(wrapper.find('[data-testid="message-input"]').exists()).toBe(
			true
		)
		expect(wrapper.find('[data-testid="submit-button"]').exists()).toBe(
			true
		)
	})

	it('Loads as expected with correct values', async () => {
		const wrapper = mount(Chat)

		/*
		expect(wrapper.exists()).toBe(true)
		wrapper.vm.chat = {
			chatId: 1,
			itemId: 1,
			chatName: "Name"
		}
		wrapper.vm.item = {
			name: "Name",
			description: "Desc",
			price: 100,
			priceUnit: "Test",
			postalCode: "code",
			address: "as",
			images: ["asd", "asd"],
			availableFrom: "from",
			availableTo: "to",
			categories: ["test", "test"]
		}

		wrapper.vm.chatData = {
			userId: "1",
			messages: [
				{
					type: 'CHAT',
					receive: true,
				}
			]
		}

		await wrapper.setData({
			chatData:{
				userId: "1",
				messages: [
					{
						type: 'CHAT',
						receive: true,
					}
				]
			}
		})
		*/

		expect(wrapper.find('[data-testid="message-input"]').exists()).toBe(
			true
		)
		expect(wrapper.find('[data-testid="submit-button"]').exists()).toBe(
			true
		)
		/*
		expect(wrapper.find('[data-testid="rent-button"]').exists()).toBe(true)
		expect(wrapper.find('[data-testid="loan-modal"]').exists()).toBe(true)
		expect(
			wrapper.find('[data-testid="feedback-button"]').exists()
		).not.toBe(true)

		 */
	})

	vi.spyOn(axios, 'get')

	it('Axios get is called at start up', async () => {
		const wrapper = mount(Chat)
		expect(axios.get).toHaveBeenCalledTimes(2)
		expect(axios.get).toBeCalledWith('/message?chatId=undefined')
	})
})
