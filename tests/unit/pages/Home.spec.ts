import { shallowMount, RouterLinkStub, flushPromises } from '@vue/test-utils'
import Home from '../../../src/pages/Home.vue'
import axios from 'axios'
import { describe, expect, it, vi } from 'vitest'

describe('Home', () => {
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
			.mockResolvedValue(mockCategoryList)
			.mockResolvedValue(mockItemList)

		it('has the required elements, including one tag alternative, initially', async () => {
			const mockRoute = {
				params: {
					id: 1,
				},
			}
			const mockRouter = {
				push: vi.fn(),
			}
			const wrapper = shallowMount(Home, {
				stubs: { RouterLink: RouterLinkStub },
			})

			expect(axios.get).toHaveBeenCalledTimes(2) //Both categories and items are gotten with separate calls
			expect(axios.get).toHaveBeenCalledWith('/category/main')

			await flushPromises()

			expect(
				wrapper.findAll('[data-testid="categories-tag-alts"]')
			).toHaveLength(1)

			expect(
				wrapper.find('[data-testid="searchbar-and-button"]').exists()
			).toBe(true)
			expect(
				wrapper.find('[data-testid="categories-tag-chosen"]').exists()
			).toBe(false)
			expect(
				wrapper.find('[data-testid="categories-tag-alts"]').exists()
			).toBe(true)
			expect(wrapper.find('[data-testid="item-list"]').exists()).toBe(
				true
			)
			expect(wrapper.find('[data-testid="sort-dropdown"]').exists()).toBe(
				true
			)
		})

		it('has initial sortChosen value equal to 0', async () => {
			const wrapper = shallowMount(Home)
			expect(wrapper.vm.sortChosen).toBe(0)
		})
	})
})
