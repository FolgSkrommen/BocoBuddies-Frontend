import { expect, it } from 'vitest'
import UserLogin from '../../../src/pages/UserLogin.vue'
import { mount } from '@vue/test-utils'

it('should work as expected', async () => {
	const emailWrapper = mount(UserLogin)
	expect(emailWrapper.find('[data-testid="email-input"]').exists()).toBe(true)

	const passwordWrapper = mount(UserLogin)
	expect(
		passwordWrapper.find('[data-testid="password-input"]').exists()
	).toBe(true)
})
