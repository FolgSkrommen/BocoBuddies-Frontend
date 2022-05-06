import { describe, expect, it, vi } from 'vitest'
import RateUserPopup from '../../../src/components/RateUserPopup.vue'
import { flushPromises, mount, shallowMount } from '@vue/test-utils'
import axios from 'axios'
import { Loan, User } from '../../../src/api/schema'
describe('Tests for Navbar', () => {
	const mockUser: User = {
		firstName: 'TestF',
		lastName: 'TestL',
		rating: 2,
		trusted: false,
		userId: 1,
		username: 'Test',
		verified: false,
	}

	const mockLoan: Loan = {
		active: true,
		chatId: 0,
		creationDate: '',
		end: '',
		itemId: 0,
		loaner: 0,
		price: 0,
		returned: true,
		start: '',
	}

	it('Renders properly', () => {
		const wrapper = mount(RateUserPopup, {
			props: {
				user: mockUser,
				loan: mockLoan,
			},
		})
		expect(wrapper.exists())
	})
	it('Renders all info needed', () => {
		const wrapper = mount(RateUserPopup, {
			props: {
				user: mockUser,
				loan: mockLoan,
			},
		})

		expect(
			wrapper.find('[data-testid="last-first-name"]').element.textContent
		).toContain('TestF TestL')
		expect(
			wrapper.find('[data-testid="comment-label"]').element.textContent
		).toContain('Kommentar')
		expect(
			wrapper.find('[data-testid="comment"]').element.textContent
		).toBe('')
		expect(
			wrapper.find('[data-testid="cancel-btn"]').element.textContent
		).toContain('Avbryt')
		expect(
			wrapper.find('[data-testid="rating-btn"]').element.textContent
		).toContain('Ranger')
	})
	it('All names under icon loads', () => {
		const wrapper = mount(RateUserPopup)
	})
})
