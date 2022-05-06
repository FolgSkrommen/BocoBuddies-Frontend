import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import CategoryList from '../../../src/components/CategoryList.vue'

describe('CategoryList', () => {
	const categories = [
		{
			categoryName: 'Category 1',
			categoryId: 1,
			superCategoryId: null,
			filterTypes: [],
		},
		{
			categoryName: 'Category 2',
			categoryId: 2,
			superCategoryId: null,
			filterTypes: [],
		},
	]

	it('loads all its categories, and they are not removable', () => {
		const wrapper = mount(CategoryList, {
			props: {
				modelValue: categories,
				removable: false,
				color: 'red',
			},
		})

		expect(wrapper.findAll('[data-testid="item-instance"]').length).toBe(
			categories.length
		)
		expect(wrapper.find('[data-testid="x-icon"]').exists()).toBe(false)
		expect(wrapper.find('[data-testid="span"]').exists()).toBe(true)
	})

	/*it('loads all its categories, and they are removable', () => {
        const wrapper = mount(CategoryList, {
            props: {
                modelValue: categories,
                removable: true,
                color: 'red'
            },
        })

        expect(wrapper.findAll('[data-testid="item-instance"]').length).toBe(categories.length)
        expect(wrapper.find('[data-testid="x-icon"]').exists()).toBe(true)
        expect(wrapper.find('[data-testid="span"]').exists()).toBe(true)
    })*/

	it('emits the proper event when a span is clicked', async () => {
		const wrapper = mount(CategoryList, {
			props: {
				modelValue: categories,
				removable: false,
				color: 'red',
			},
		})

		expect(wrapper.findAll('[data-testid="item-instance"]').length).toBe(
			categories.length
		)
		expect(wrapper.find('[data-testid="x-icon"]').exists()).toBe(false)
		await wrapper.findAll('[data-testid="span"]')[0].trigger('click')

		expect(wrapper.emitted('add-category-event')).toBeTruthy()
		expect(wrapper.emitted('add-category-event')[0]).toEqual([
			categories[0],
		])
	})
})
