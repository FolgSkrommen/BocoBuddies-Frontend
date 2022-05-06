import { mount, shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import BaseBtn from '../../../../src/components/base/BaseBtn.vue'

describe('BaseBtn', () => {
	describe('when loaded', () => {
		it('without "to" it is button and default color', () => {
			const wrapper = mount(BaseBtn)
			const button = wrapper.find('[data-testid="button"]')
			expect(button.exists()).toBe(true)
			expect(button.attributes().class).include('bg-blue-700 text-white')
		})
		it('with "to" it is router-link and default color', () => {
			const wrapper = mount(BaseBtn, {
				props: {
					to: '/',
				},
			})

			const routerLink = wrapper.find('[data-testid="router-link"]')
			expect(routerLink.exists()).toBe(true)

			expect(routerLink.attributes().class).include(
				'bg-blue-700 text-white'
			)
		})
	})
	describe('when disabled', () => {
		it('is disabled', () => {
			const wrapper = mount(BaseBtn, {
				props: {
					disabled: true,
				},
			})

			const button = wrapper.find('[data-testid="button"]')
			expect(button.exists()).toBe(true)
			expect(button.attributes().disabled).toBe('')
		})
	})

	describe('when given color', () => {
		it('gray', () => {
			it('is gray', () => {
				const wrapper = mount(BaseBtn, {
					props: {
						color: 'gray',
					},
				})

				const button = wrapper.find('[data-testid="button"]')
				expect(button.exists()).toBe(true)
				expect(button.attributes().class).include('bg-slate')
			})
		})
		it('red', () => {
			it('is red', () => {
				const wrapper = mount(BaseBtn, {
					props: {
						color: 'red',
					},
				})

				const button = wrapper.find('[data-testid="button"]')
				expect(button.exists()).toBe(true)
				expect(button.attributes().class).include('bg-red')
			})
		})
		it('blue', () => {
			it('is blue', () => {
				const wrapper = mount(BaseBtn, {
					props: {
						color: 'blue',
					},
				})

				const button = wrapper.find('[data-testid="button"]')
				expect(button.exists()).toBe(true)
				expect(button.attributes().class).include('bg-blue')
			})
		})
		it('green', () => {
			it('is green', () => {
				const wrapper = mount(BaseBtn, {
					props: {
						color: 'green',
					},
				})

				const button = wrapper.find('[data-testid="button"]')
				expect(button.exists()).toBe(true)
				expect(button.attributes().class).include('bg-green')
			})
		})
	})
	describe('if given type', () => {
		describe('submit', () => {
			it('is type submit', () => {
				const wrapper = mount(BaseBtn, {
					props: {
						type: 'submit',
					},
				})

				const button = wrapper.find('[data-testid="button"]')
				expect(button.exists()).toBe(true)
				expect(button.attributes().type).toBe('submit')
			})
		})
	})
})
