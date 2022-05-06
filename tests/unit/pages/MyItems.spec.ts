import { mount, shallowMount, flushPromises, VueWrapper } from '@vue/test-utils'
import { createStore } from 'vuex'
import MyItems from '../../../src/pages/MyItems.vue'
import axios from 'axios'
import { describe, expect, it, vi } from 'vitest'
import qs from 'qs'
import { User } from '../../../src/api/schema'

describe('MyItems', () => {
	describe('when entered', () => {
		let mockUser: User = {
			firstName: 'navn',
			lastName: 'forett',
			rating: 1,
			trusted: false,
			userId: 2,
			username: 'Olav',
			verified: false,
		}

		let mockCategoryList = [
			{
				categoryId: 1,
				name: 'test',
				superCategoryId: undefined,
			},
		]

		let mockItemList = [
			{
				id: 1,
				image: 'Image',
				name: 'Name',
				price: 100,
				availableFrom: 'Today',
				availableTo: 'Tomorrow',
				priceUnit: 'Unit',
				address: 'Here',
				postalCode: 'Code',
			},
		]

		vi.spyOn(axios, 'get')
			.mockResolvedValueOnce(mockCategoryList)
			.mockResolvedValueOnce(mockItemList)

		it('has the required elements, including one tag alternative, initially', async () => {
			const wrapper = shallowMount(MyItems)

			expect(
				wrapper.find('[data-testid="searchbar-and-button"]').exists()
			).toBe(true)
			expect(
				wrapper.find('[data-testid="filter-and-sort-toggle"]').exists()
			).toBe(true)
			expect(
				wrapper.find('[data-testid="categories-tag-chosen"]').exists()
			).toBe(false)
			expect(
				wrapper.find('[data-testid="categories-tag-alts"]').exists()
			).toBe(false)

			expect(wrapper.find('[data-testid="sort-dropdown"]').exists()).toBe(
				false
			)
		})

		it('fetches categories', async () => {
			mount(MyItems)
			expect(axios.get).toHaveBeenNthCalledWith(1, '/category/main')
		})

		it('has initial sortChosen value equal to 0', async () => {
			const wrapper = shallowMount(MyItems)
			expect(wrapper.vm.sortChosen).toBe(0)
		})

		it('renders sort dropdown and category alternatives when toggle is clicked', async () => {
			const wrapper = shallowMount(MyItems)
			console.log(wrapper)

			await wrapper
				.find('[data-testid="filter-and-sort-toggle"]')
				.trigger('click')

			expect(
				wrapper.find('[data-testid="categories-tag-alts"]').exists()
			).toBe(true)
			expect(
				wrapper.findAll('[data-testid="categories-tag-alts"]')
			).toHaveLength(1)
			expect(wrapper.find('[data-testid="sort-dropdown"]').exists()).toBe(
				true
			)
			expect(
				wrapper.find('[data-testid="categories-tag-chosen"]').exists()
			).toBe(false)
		})
	})
})
