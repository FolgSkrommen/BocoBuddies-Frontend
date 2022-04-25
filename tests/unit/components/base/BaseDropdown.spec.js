import { shallowMount, mount } from '@vue/test-utils'
import BaseDropdown from '@/components/base/BaseDropdown.vue'

let wrapper
beforeEach(() => {
	wrapper = shallowMount(BaseDropdown, {
		propsData: {
			modelValue: 1,
			alternatives: [
				{ id: 1, alt: 'Alt1' },
				{ id: 2, alt: 'Alt2' },
				{ id: 3, alt: 'Alt3' },
			],
		},
	})
	return wrapper
})
describe('BaseDropdown', () => {
	describe('when dropwodn is initiated', () => {
		it('exists and modelValue is 1', async () => {
			expect(
				wrapper.find('[data-testid="dropdown-container"]').exists()
			).toBe(true)
			expect(
				wrapper.findAll('[data-testid="dropdown-option"]')
			).toHaveLength(3)
			expect(wrapper.props('modelValue')).toBe(1)
		})
	})
	describe('when dropdown is clicked', () => {
		it('emits an event and data', async () => {
			wrapper
				.findAll('[data-testid="dropdown-option"]')
				.at(2)
				.trigger('click')
			wrapper.vm.$emit('update', 3) //NB! This results in a warning, but passing 'update:modelValue' as an emit is not compatible with later code
			await wrapper.vm.$nextTick()

			// assert event has been emitted
			expect(wrapper.emitted().update).toBeTruthy()

			// assert event count|
			expect(wrapper.emitted().update.length).toBe(1)

			// assert event payload
			expect(wrapper.emitted().update[0]).toEqual([3])
		})
	})
})
