import { mount, shallowMount } from '@vue/test-utils'
import BaseInput from '@/components/Base/BaseInput.vue'

describe('BaseModal', () => {
	describe('when loaded', () => {
		it('with show popup exists', () => {
			let inputText = 'Test text'
			const wrapper = mount(BaseInput, {
				props: {
					modelValue: inputText,
				},
			})
			expect(wrapper.props().modelValue).toBe(true)
		})
		it('with dont show popup doesnt exist', () => {
			let inputText = 'Test text'
			const wrapper = mount(BaseInput, {
				props: {
					label: 'Label',
					modelValue: inputText,
				},
			})
			expect(wrapper.props().modelValue).toBe(false)
			expect(wrapper.find('[data-testid="input"]').exists())
		})
	})
})
