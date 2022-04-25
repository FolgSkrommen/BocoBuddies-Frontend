import { mount, shallowMount } from '@vue/test-utils'
import BaseModal from '@/components/base/BaseModal.vue'

describe('BaseModal', () => {
	describe('when loaded', () => {
		it('with show popup exists', () => {
			let showModal = true
			const wrapper = mount(BaseModal, {
				props: {
					modelValue: showModal,
				},
			})
			expect(wrapper.find('[data-testid="modal-frame"]').exists())
			expect(wrapper.props().modelValue).toBe(true)
		})
		it('with dont show popup doesnt exist', () => {
			let showModal = false
			const wrapper = mount(BaseModal, {
				props: {
					modelValue: showModal,
				},
			})
			expect(wrapper.props().modelValue).toBe(false)
			expect(!wrapper.find('[data-testid="modal-frame"]').exists())
		})
	})
})
