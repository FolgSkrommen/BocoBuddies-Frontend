import { describe, expect, it, vi } from 'vitest'
import Community from '../../../src/pages/Community.vue'
import axios from 'axios'
import { flushPromises, RouterLinkStub, shallowMount } from '@vue/test-utils'

describe('Community', () => {
	let mockMembers = [
		{
			userId: 1,
			firstName: 'test',
			lastName: 'test',
			username: 'test',
			email: 'test@test.com',
			address: 'nardobakken 4',
			postalCode: '7032',
			phoneNumber: '12345678',
			profilePicture: null,
			friend: true,
			hasPendingInvite: null,
			verified: false,
			trusted: false,
			rating: 3,
		},
	]
	describe('when entered', () => {
		let mockFriendChats = [
			{
				chatId: 1,
				chatName: 'test',
				members: mockMembers,
			},
		]

		vi.spyOn(axios, 'get')
			.mockResolvedValue(mockMembers)
			.mockResolvedValue(mockFriendChats)

		it('has the required elements', async () => {
			const mockRoute = {}
			const mockRouter = {
				push: vi.fn(),
			}
			const wrapper = shallowMount(Community, {
				stubs: { RouterLink: RouterLinkStub },
			})

			await flushPromises()

			expect(wrapper.findAll('[data-testid="view-button"]')).toHaveLength(
				3
			)
			expect(wrapper.find('[data-testid="add-btn"]').exists()).toBe(true)
		})
	})
})
