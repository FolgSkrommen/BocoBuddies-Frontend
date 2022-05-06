import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import CategoryList from '../../../src/components/UserCardAndBtn.vue'

describe('UserCardAndBtn', () => {
	const user = {
		userId: 1,
		firstName: 'test',
		lastName: 'test',
		username: 'test',
		email: 'test@test.test',
		address: 'test st',
		postalCode: 'test',
		phoneNumber: '500-500-test',
		profilePicture: 'test==',
		friend: false,
		hasPendingInvite: false,
		verified: true,
		trusted: true,
		rating: 5,
	}
	const btnTxt = 'buttonText'
	const btnDsbld = false
	const to = 'route'

	it('renders user card and button', () => {
		const wrapper = mount(CategoryList, {
			props: {
				user: user,
				btnTxt: btnTxt,
				btnDsbld: btnDsbld,
				to: to,
			},
		})

		expect(wrapper.find('[data-testid="user-card"]').exists()).toBeTruthy()
		expect(wrapper.find('[data-testid="button"]').exists()).toBeTruthy()
		expect(wrapper.find('[data-testid="button"]').text()).toEqual(btnTxt)
	})

	it('emits user clicked event when user card is clicked', async () => {
		const wrapper = mount(CategoryList, {
			props: {
				user: user,
				btnTxt: btnTxt,
				btnDsbld: btnDsbld,
				to: to,
			},
		})

		await wrapper.find('[data-testid="user-card"]').trigger('click')

		expect(wrapper.emitted('user-clicked')).toBeTruthy()
		expect(wrapper.emitted('user-clicked')[0]).toEqual([user])
	})

	it('emits button clicked event when button is clicked', async () => {
		const wrapper = mount(CategoryList, {
			props: {
				user: user,
				btnTxt: btnTxt,
				btnDsbld: btnDsbld,
				to: to,
			},
		})

		await wrapper.find('[data-testid="button"]').trigger('click')

		expect(wrapper.emitted('user-clicked')).toBeTruthy()
		expect(wrapper.emitted('user-clicked')[0]).toEqual([user])
	})
})
