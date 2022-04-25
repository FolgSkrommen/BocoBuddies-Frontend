import { shallowMount, RouterLinkStub } from '@vue/test-utils'
import Home from '@/pages/Home.vue'

describe('Home', () => {
	describe('when entered', () => {
		it('has the required elements initially', () => {
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

			expect(wrapper.find('[data-testid="search-field"]').exists()).toBe(
				true
			)
			expect(wrapper.find('[data-testid="search-button"]').exists()).toBe(
				true
			)
			expect(
				wrapper.find('[data-testid="categories-tag-chosen"]').exists()
			).toBe(true)
			expect(
				wrapper.find('[data-testid="categories-tag-alts"]').exists()
			).toBe(true)
			//ItemCards are not rendered, because no search has been done
			expect(wrapper.find('[data-testid="item-cards"]').exists()).toBe(
				false
			)
			expect(
				wrapper.find('[data-testid="load-more-items-button"]').exists()
			).toBe(true)
			expect(wrapper.find('[data-testid="sort-dropdown"]').exists()).toBe(
				true
			)
		})

		it('has initial sortChosen value equal to 0', async () => {
			const wrapper = shallowMount(Home)
			expect(wrapper.vm.sortChosen).toBe(0)
		})
	})

	describe('when a user searches for items', () => {
		it('', () => {})
	})
})
