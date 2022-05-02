import { mount, shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import BaseLabel from '../../../../src/components/base/BaseLabel.vue'

describe('BaseLabel', () => {
	describe('when loaded', () => {
		it('Component loads correctly', () => {
			let inputText = 'Test text'
			const wrapper = shallowMount(BaseLabel, {
				props: {
					modelValue: inputText,
				},
			})

			const label = wrapper.find('[data-testid="label"')

			expect(label.exists()).toBe(true)

			expect(label.text()).toEqual('Test text')
		})
	})
})
