import { mount, shallowMount } from '@vue/test-utils'
import MessageContainer from '../../../../src/components/chat/MessageContainer.vue'
import { describe, expect, it } from 'vitest'
import { User } from '../../../../src/api/schema'

describe('MessageContainerLoan', () => {
	describe('when loaded', () => {
		const user: User = {
			firstName: '',
			lastName: '',
			rating: 0,
			trusted: false,
			userId: 0,
			username: '',
			verified: false,
		}
		const users: User[] = [user]
		const messages = [
			{
				senderId: 1,
				message: 'Test message',
				type: 'CHAT',
				date: new Date().toString(),
				receive: true,
				chatId: '1',
			},
		]

		it('Component exists', () => {
			const wrapper = mount(MessageContainer, {
				props: {
					messages,
					users,
				},
			})
			expect(wrapper.exists()).toBe(true)
		})
		it('Message is rendered', () => {
			const wrapper = mount(MessageContainer, {
				props: {
					messages,
					users,
				},
			})
			const message = wrapper.findAll('[data-testid="message"]')

			expect(message.length).toBe(1)
		})
		it('Message info is rendered', () => {
			const wrapper = mount(MessageContainer, {
				props: {
					messages,
					users,
				},
			})
			const messageInfo = wrapper.find('[data-testid="message-info"]')
			expect(wrapper.props().messages[0].senderId).toBe(1)
			expect(messageInfo.exists()).toBe(true)
			expect(messageInfo.element.textContent).toContain('Test message')
		})
		it('Chat box is rendered', () => {
			const wrapper = mount(MessageContainer, {
				props: {
					messages,
					users,
				},
			})
			const messageInfo = wrapper.find('[data-testid="chat"]')
			expect(messageInfo.exists()).toBe(true)
		})

		describe('Function testing', async () => {
			it('getProperDateTime', () => {
				const wrapper = mount(MessageContainer, {
					props: {
						messages,
						users,
					},
				})
				expect(
					wrapper.vm.getProperDateTime(new Date().toISOString())
				).toHaveLength(5)
				expect(
					wrapper.vm.getProperDateTime(
						new Date('05 October 2000 14:48 UTC').toISOString()
					)
				).toHaveLength(10)
			})
			describe('messagePlacement ', () => {
				it('messagePlacement true tests', () => {
					const wrapper = mount(MessageContainer, {
						props: {
							messages,
							users,
						},
					})
					expect(wrapper.vm.messagePlacement(true)).toBe(
						'place-self-start'
					)
					expect(wrapper.vm.messagePlacement(true)).not.toBe(
						'place-self-end'
					)
				})
				it('messagePlacement false tests', () => {
					const wrapper = mount(MessageContainer, {
						props: {
							messages,
							users,
						},
					})
					expect(wrapper.vm.messagePlacement(false)).toBe(
						'place-self-end'
					)
					expect(wrapper.vm.messagePlacement(false)).not.toBe(
						'place-self-start'
					)
				})
				it('messagePlacement undefined tests', () => {
					const wrapper = mount(MessageContainer, {
						props: {
							messages,
							users,
						},
					})
					expect(wrapper.vm.messagePlacement(undefined)).toBe(
						'place-self-end'
					)
					expect(wrapper.vm.messagePlacement(undefined)).not.toBe(
						'place-self-start'
					)
				})
			})

			it('IsValidHttpUrl', () => {
				const wrapper = mount(MessageContainer, {
					props: {
						messages,
						users,
					},
				})

				expect(
					wrapper.vm.isValidHttpUrl(
						'https://vhudyma-blog.eu/3-ways-to-mock-axios-in-jest/'
					)
				).toBe(true)
				expect(
					wrapper.vm.isValidHttpUrl(
						'http://vhudyma-blog.eu/3-ways-to-mock-axios-in-jest/'
					)
				).toBe(true)
				expect(
					wrapper.vm.isValidHttpUrl(
						'hts://vhudyma-blog.eu/3-ways-to-mock-axios-in-jest/'
					)
				).toBe(false)
				expect(
					wrapper.vm.isValidHttpUrl(
						'https://vhudyma-blog/3-ways-to-mock-axios-in-jest/'
					)
				).toBe(true)
				expect(
					wrapper.vm.isValidHttpUrl(
						'https//vhudyma-blog.eu/3-ways-to-mock-axios-in-jest/'
					)
				).toBe(false)
			})

			describe('styleType', () => {
				it('text black (true)', () => {
					const wrapper = mount(MessageContainer, {
						props: {
							messages,
							users,
						},
					})

					expect(wrapper.vm.styleType(true)).toBe(
						'bg-slate-400 text-black '
					)
					expect(wrapper.vm.styleType(true)).not.toBe(
						'bg-blue-500 text-white justify-self-end'
					)
					expect(wrapper.vm.styleType(true)).not.toBe(
						'bg-blue-500 text-white'
					)
				})
				it('text white self-end (false)', () => {
					const wrapper = mount(MessageContainer, {
						props: {
							messages,
							users,
						},
					})

					expect(wrapper.vm.styleType(false)).not.toBe(
						'bg-slate-400 text-black '
					)
					expect(wrapper.vm.styleType(false)).toBe(
						'bg-blue-500 text-white justify-self-end'
					)
					expect(wrapper.vm.styleType(false)).not.toBe(
						'bg-blue-500 text-white'
					)
				})

				it('text white (undefined)', () => {
					const wrapper = mount(MessageContainer, {
						props: {
							messages,
							users,
						},
					})

					expect(wrapper.vm.styleType(undefined)).not.toBe(
						'bg-slate-400 text-black '
					)
					expect(wrapper.vm.styleType(undefined)).not.toBe(
						'bg-blue-500 text-white justify-self-end'
					)
					expect(wrapper.vm.styleType(undefined)).toBe(
						'bg-blue-500 text-white'
					)
				})
			})
		})
	})
})
