import { mount, shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import BaseInput from '../../../../src/components/base/BaseInput.vue'

describe('BaseInput', () => {
	describe('when loaded', () => {
		it('Component exists', () => {
			let inputText = 'Test text'
			const wrapper = mount(BaseInput, {
				props: {
					modelValue: inputText,
				},
			})
			expect(wrapper.props().modelValue).toBe('Test text')
		})
		it('check if input changes when prop value Positive test', () => {
			let inputText = 'Test text'
			const wrapper = mount(BaseInput, {
				props: {
					modelValue: inputText,
				},
			})

			const input = wrapper.find('[data-testid="input"]')

			expect(wrapper.props().modelValue).toBe('Test text')
			expect(input.exists()).toBe(true)
			expect(input.element.value).toBe('Test text')

			inputText = 'New test text'
			input.element.value = inputText
			expect(input.element.value).toBe('New test text')
		})
		it('check if input changes when prop value Negative test', () => {
			let inputText = 'Test text'
			const wrapper = mount(BaseInput, {
				props: {
					modelValue: inputText,
				},
			})
			const input = wrapper.find('[data-testid="input"]')
			expect(input.element.value).toBe('Test text')
			expect(input.exists())
			expect(input.element.value).toBe('Test text')
			expect(input.element.value).not.toBe('Test text2')
		})
	})
	describe('When loaded with label', () => {
		it('Label is loaded and correct', () => {
			let inputText = 'Test text'
			const wrapper = mount(BaseInput, {
				props: {
					label: 'Label',
					modelValue: inputText,
				},
			})
			const label = wrapper.find('[data-testid="label"]')

			expect(label.text()).toBe('Label')
		})
		it('Label is loaded and wrong', () => {
			let inputText = 'Test text'
			const wrapper = mount(BaseInput, {
				props: {
					label: 'Label',
					modelValue: inputText,
				},
			})
			const label = wrapper.find('[data-testid="label"]')

			expect(label.text()).not.toBe('LabelWrong')
		})
	})
})
