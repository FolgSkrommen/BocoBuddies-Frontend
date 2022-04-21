import { shallowMount } from '@vue/test-utils'
import UserLogin from '@/pages/UserLogin.vue'

describe('Login', () => {
	describe('when loaded', () => {
		it('has the required elements', () => {
			const wrapper = shallowMount(UserLogin)
			expect(wrapper.find('[data-testid="email-input"]').exists()).toBe(
				true
			)
		})
	})
})
