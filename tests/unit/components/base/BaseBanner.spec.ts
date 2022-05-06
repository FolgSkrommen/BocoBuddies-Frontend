import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import BaseBanner from '../../../../src/components/base/BaseBanner.vue'

describe('BaseBanner', () => {
	describe('when loaded with no props', () => {
		it('it loads', () => {
			const wrapper = shallowMount(BaseBanner)
			const container = wrapper.find('[data-testid="container"]')
			expect(container.exists()).toBe(true)
			expect(container.attributes().class).include('bg-slate')

			const infoIcon = wrapper.find('[data-testid="info-icon"]')
			expect(infoIcon.exists()).toBe(true)

			const exit = wrapper.find('[data-testid="exit"]')
			expect(exit.exists()).toBe(true)

			const message = wrapper.find('[data-testid="message"]')
			expect(message.exists()).toBe(true)
		})
	})
	describe('when loaded with prop', () => {
		it('type="error" loads correctly', () => {
			const wrapper = shallowMount(BaseBanner, {
				props: {
					type: 'error',
				},
			})

			const container = wrapper.find('[data-testid="container"]')
			expect(container.exists()).toBe(true)
			expect(container.attributes().class).include('bg-red')
			expect(container.attributes().class).include('text-red')

			const icon = wrapper.find('[data-testid="x-icon"]')
			expect(icon.exists()).toBe(true)

			const exit = wrapper.find('[data-testid="exit"]')
			expect(exit.exists()).toBe(true)

			const message = wrapper.find('[data-testid="message"]')
			expect(message.exists()).toBe(true)
		})
		it('type="success" loads correctly', () => {
			const wrapper = shallowMount(BaseBanner, {
				props: {
					type: 'success',
				},
			})

			const container = wrapper.find('[data-testid="container"]')
			expect(container.exists()).toBe(true)
			expect(container.attributes().class).include('bg-green')
			expect(container.attributes().class).include('text-green')

			const icon = wrapper.find('[data-testid="check-icon"]')
			expect(icon.exists()).toBe(true)

			const exit = wrapper.find('[data-testid="exit"]')
			expect(exit.exists()).toBe(true)

			const message = wrapper.find('[data-testid="message"]')
			expect(message.exists()).toBe(true)
		})
		it('type="info" loads correctly', () => {
			const wrapper = shallowMount(BaseBanner, {
				props: {
					type: 'info',
				},
			})

			const container = wrapper.find('[data-testid="container"]')
			expect(container.exists()).toBe(true)
			expect(container.attributes().class).include('bg-slate')
			expect(container.attributes().class).include('text-slate')

			const icon = wrapper.find('[data-testid="info-icon"]')
			expect(icon.exists()).toBe(true)

			const exit = wrapper.find('[data-testid="exit"]')
			expect(exit.exists()).toBe(true)

			const message = wrapper.find('[data-testid="message"]')
			expect(message.exists()).toBe(true)
		})
	})
	describe('when exit button clicked', () => {
		it('emits exit', async () => {
			const wrapper = shallowMount(BaseBanner)

			const exit = wrapper.find('[data-testid="exit"]')
			expect(exit.exists()).toBe(true)

			await exit.trigger('click')

			expect(wrapper.emitted('exit')).toBeTruthy()
		})
	})
})
