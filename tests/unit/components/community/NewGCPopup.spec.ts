import { mount, shallowMount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import NewGCPopup from '../../../../src/components/community-popups/NewGCPopup.vue'
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
			const wrapper = shallowMount(NewGCPopup)

			expect(wrapper.exists()).toBe(true)
		})

		it('Loading bar loads', () => {
			const wrapper = mount(NewGCPopup)

			expect(wrapper.find('[data-testid="loading"]').exists()).not
			wrapper.vm.status = 'loading'
			wrapper.vm.$forceUpdate()
			expect(wrapper.find('[data-testid="loading"]').exists())
		})

		it('All elements loads correctly', () => {
			const wrapper = mount(NewGCPopup)

			wrapper.vm.user = mockUser
			wrapper.vm.status = 'loaded'
			wrapper.vm.$forceUpdate()
			expect(wrapper.find('[data-testid="loading"]').exists()).not
			expect(wrapper.find('[data-testid="usercard"]').exists())
			expect(wrapper.find('[data-testid="input"]').exists())
			expect(wrapper.find('[data-testid="user-btn"]').exists())
			expect(wrapper.find('[data-testid="add-btn"]').exists())
			expect(wrapper.find('[data-testid="load-btn"]').exists())
			expect(wrapper.find('[data-testid="create-btn"]').exists())
			expect(wrapper.find('[data-testid="searchbar"]').exists())
		})
	})

	describe('Testing functions', () => {
		it('searchForFriends', async () => {
			const wrapper = shallowMount(NewGCPopup)

			const spy = vi.spyOn(axios, 'get')

			await wrapper.vm.searchForFriends()

			expect(spy).toHaveBeenCalledTimes(1)

			expect(wrapper.vm.status).toBe('error')
		})

		it('createGC', async () => {
			const wrapper = shallowMount(NewGCPopup)

			const spy = vi.spyOn(axios, 'post')
			wrapper.vm.$forceUpdate()
			await wrapper.vm.createGC()

			expect(spy).toHaveBeenCalledTimes(1)

			expect(wrapper.vm.status).toBe('error')
		})
	})
})
