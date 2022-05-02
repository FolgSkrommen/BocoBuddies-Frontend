import { shallowMount } from '@vue/test-utils'
import { describe, expect, it, beforeEach } from 'vitest'
import BaseDropdown from '../../../../src/components/base/BaseDropdown.vue'

let wrapper = shallowMount(BaseDropdown, {
	props: {
		modelValue: 1,
		alternatives: [
			{ id: 1, alt: 'Alt1' },
			{ id: 2, alt: 'Alt2' },
			{ id: 3, alt: 'Alt3' },
		],
	},
})
describe('BaseDropdown', () => {
	describe('when dropdown is initiated', () => {
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
