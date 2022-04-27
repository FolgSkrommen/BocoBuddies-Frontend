import { shallowMount, RouterLinkStub, flushPromises } from '@vue/test-utils'
import Home from '@/pages/Home.vue'
import axios from 'axios'

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

		jest.spyOn(axios, 'get')
			.mockResolvedValue(mockCategoryList)
			.mockResolvedValue(mockItemList)

		it('has the required elements, including one tag alternative, initially', async () => {
			const mockRoute = {
				params: {
					id: 1,
				},
			}
			const mockRouter = {
				push: jest.fn(),
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
			).toBe(true)
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

	//OLD TESTS
	/*describe('when a user searches for items', () => {
		describe('user pushes search button', () => {
			it('does not search if no word is typed', async () => {
				const wrapper = shallowMount(Home)
				await wrapper
					.find('[data-testid="search-button"]')
					.trigger('click')
				expect(wrapper.vm.items.length).toBe(0)
			})
			it('does search if word is typed', () => {
				const wrapper = shallowMount(Home)
				let searchString = 'sko'
				wrapper.vm.searchWord = searchString

				expect(wrapper.vm.searchWord).toEqual('sko')
				//TODO implement test
			})
		})
		describe('user pushes enter', () => {
			it('does not search if no word is typed', async () => {
				const wrapper = shallowMount(Home)
				await wrapper
					.find('[data-testid="search-field"]')
					.trigger('keypress', { key: 'Enter' })
				expect(wrapper.vm.items.length).toBe(0)
			})
		})
	})*/
})
