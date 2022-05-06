import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import SearchbarAndButton from '../../../src/components/SearchbarAndButton.vue'

describe('SearchbarAndButton', () => {
	let modelValue = 'modelValue'

	it('renders properly', async () => {
		const wrapper = mount(SearchbarAndButton, {
			props: {
				modelValue: modelValue,
			},
		})

		expect(
			wrapper.find('[data-testid="search-button"]').exists()
		).toBeTruthy()
		expect(
			wrapper.find('[data-testid="search-field"]').exists()
		).toBeTruthy()
		expect(wrapper.props()).toEqual({ modelValue: modelValue })
		await wrapper.find('[data-testid="search-field"]').setValue('Hello')
		expect(wrapper.emitted('update:modelValue')).toBeTruthy()
		//expect(wrapper.find('[data-testid="search-field"]').text()).toEqual('Hello')
	})

	it('emits modelvalue update when input is updated, but not before', async () => {
		const wrapper = mount(SearchbarAndButton, {
			props: {
				modelValue: modelValue,
			},
		})

		expect(wrapper.emitted('update:modelValue')).toBeFalsy()
		await wrapper.find('[data-testid="search-field"]').setValue('Hello')
		expect(wrapper.emitted('update:modelValue')).toBeTruthy()
	})

	it('emits search when input registers on keyup.enter, but not before', async () => {
		const wrapper = mount(SearchbarAndButton, {
			props: {
				modelValue: modelValue,
			},
		})

		expect(wrapper.emitted('search')).toBeFalsy()
		await wrapper
			.find('[data-testid="search-field"]')
			.trigger('keyup.enter')
		expect(wrapper.emitted('search')).toBeTruthy()
	})

	it('emits search when button is clicked, but not before', async () => {
		const wrapper = mount(SearchbarAndButton, {
			props: {
				modelValue: modelValue,
			},
		})

		expect(wrapper.emitted('search')).toBeFalsy()
		await wrapper.find('[data-testid="search-button"]').trigger('click')
		expect(wrapper.emitted('search')).toBeTruthy()
	})
})
