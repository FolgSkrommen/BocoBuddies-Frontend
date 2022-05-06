import { mount, shallowMount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import AddFriendPopup from '../../../../src/components/community-popups/AddFriendPopup.vue'
import axios from 'axios'
import { User } from '../../../../src/api/schema'

describe('AddFriendPopup', () => {
	let mockUser: User = {
		firstName: '',
		lastName: '',
		rating: 0,
		trusted: false,
		userId: 0,
		username: '',
		verified: false,
	}
	describe('when loaded', () => {
		it('Component loads correctly', () => {
			const wrapper = shallowMount(AddFriendPopup)

			expect(wrapper.exists()).toBe(true)
		})

		it('Loading bar loads', () => {
			const wrapper = mount(AddFriendPopup)

			expect(wrapper.find('[data-testid="loading"]').exists()).not
			wrapper.vm.status = 'loading'
			wrapper.vm.$forceUpdate()
			expect(wrapper.find('[data-testid="loading"]').exists())
		})

		it('All elements loads correctly', () => {
			const wrapper = mount(AddFriendPopup)

			expect(wrapper.exists()).toBe(true)
			wrapper.vm.user = mockUser
			wrapper.vm.status = 'loaded'
			wrapper.vm.$forceUpdate()
			expect(wrapper.find('[data-testid="loading"]').exists()).not
			expect(wrapper.find('[data-testid="usercard"]').exists())
			expect(wrapper.find('[data-testid="load-more"]').exists())
			expect(wrapper.find('[data-testid="searchbar"]').exists())
		})
	})

	describe('Testing functions', () => {
		it('searchForFriends', async () => {
			const wrapper = shallowMount(AddFriendPopup)

			const spy = vi.spyOn(axios, 'get')

			await wrapper.vm.searchForFriends()

			expect(spy).toHaveBeenCalledTimes(1)

			expect(wrapper.vm.status).toBe('error')
		})

		it('addUser', async () => {
			const wrapper = shallowMount(AddFriendPopup)

			const spy = vi.spyOn(axios, 'post')
			wrapper.vm.$forceUpdate()
			await wrapper.vm.addUser(mockUser)

			expect(spy).toHaveBeenCalledTimes(1)

			expect(wrapper.vm.status).toBe('error')
		})
	})
})
