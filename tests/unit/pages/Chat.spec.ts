import { describe, expect, it, vi } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import Chat from '../../../src/pages/community/Chat.vue'
import axios from 'axios'
import { Chat as ChatModel, User } from '../../../src/api/schema'

describe('when loaded', () => {
	let mockUser: User = {
		firstName: 'navn',
		lastName: 'forett',
		rating: 1,
		trusted: false,
		userId: 2,
		username: 'Olav',
		verified: false,
	}

	let chatMock: ChatModel = {
		user: mockUser,
		chatId: 1,
		chatName: 'TestChat',
	}
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

	it('Websocket on receive message', () => {
		const wrapper = mount(Chat)
		it('onMessageReceived', () => {
			let mockPayload2 = {
				body: '{"id":0, "chatId":20, "senderId":1, "recipientId":null, "type":"CHAT", "message":"test", "date":"2022-05-06T14:13:18.066+00:00", "status":null}',
			}

			expect(wrapper.vm.messages.length).toBe(0)
			wrapper.vm.onMessageReceived(mockPayload2)
			expect(wrapper.vm.messages.length).toBe(1)
		})
	})

	it('Rerender', () => {
		const wrapper = mount(Chat)
		expect(wrapper.vm.render).toBe(0)
		wrapper.vm.reRenderChat()
		expect(wrapper.vm.render).toBe(1)
	})
})
