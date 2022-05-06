/*import {
	shallowMount,
	RouterLinkStub,
	flushPromises,
	VueWrapper,
} from '@vue/test-utils'
import MyItems from '../../../src/pages/MyItems.vue'
import axios from 'axios'
import { describe, expect, it, vi } from 'vitest'
import qs from 'qs'

describe('MyItems', () => {
	describe('when entered', () => {
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

			//expect(axios.get).toHaveBeenCalledTimes(2) //Both categories and items are gotten with separate calls
			//expect(axios.get).toHaveBeenNthCalledWith(1, '/category/main')
			expect(axios.get).toHaveBeenNthCalledWith(2, '/item/search/'+'', {params: {categories: [],
				sort: 'none',
				amount: wrapper.vm.amountPerPage,
				offset: 0,
				useAuth: false}, 
				paramsSerializer: params => {
					return qs.stringify(params, {
						arrayFormat: 'repeat',
					})
				},})

			await flushPromises()

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

		it('has initial sortChosen value equal to 0', async () => {
			const wrapper = shallowMount(MyItems)
			expect(wrapper.vm.sortChosen).toBe(0)
		})

		it('renders sort dropdown and category alternatives when toggle is clicked', async () => {
			const wrapper = shallowMount(MyItems)
			console.log(wrapper);
			
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
})*/
