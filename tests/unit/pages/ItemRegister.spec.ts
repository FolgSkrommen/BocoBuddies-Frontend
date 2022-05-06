import UserRegister from '../../../src/pages/ItemRegister.vue'
import { shallowMount } from '@vue/test-utils'
import { expect, it, describe, vi } from 'vitest'

import axios from 'axios'

describe('ItemRegister', () => {
	it('when loaded has the required elements', () => {
		const wrapper = shallowMount(UserRegister)

		const header = wrapper.find('[data-testid="header"]')
		expect(header.exists()).toBe(true)
		expect(header.text()).toBe('Ny gjenstand')

		const form = wrapper.find('[data-testid="form"]')
		expect(form.exists()).toBe(true)

		const titleInput = wrapper.find('[data-testid="title-input"]')
		expect(titleInput.exists()).toBe(true)

		const descriptionInput = wrapper.find(
			'[data-testid="description-input"]'
		)
		expect(descriptionInput.exists()).toBe(true)

		const priceInput = wrapper.find('[data-testid="price-input"]')
		expect(priceInput.exists()).toBe(true)

		//Price Unit
		const priceUnit = wrapper.find('[data-testid="priceUnit-selector"]')
		expect(priceUnit.exists()).toBe(true)

		expect(
			wrapper.findAll('[data-testid="price-unit-option"]').length
		).toBe(wrapper.vm.priceUnits.length)

		const datePicker = wrapper.find('[data-testid="date-picker"]')
		expect(datePicker.exists()).toBe(true)

		const imageInput = wrapper.find('[data-testid="image-input"]')
		expect(imageInput.exists()).toBe(true)

		const addressInput = wrapper.find('[data-testid="address-input"]')
		expect(addressInput.exists()).toBe(true)

		const postalCodeInput = wrapper.find('[data-testid="postalCode-input"]')
		expect(postalCodeInput.exists()).toBe(true)

		const submitButton = wrapper.find('[data-testid="submit-button"]')
		expect(submitButton.exists()).toBe(true)
	})

	vi.spyOn(axios, 'post')

	const wrapper = shallowMount(UserRegister)

	wrapper.vm.title = 'test'
	wrapper.vm.description = 'test description'
	wrapper.vm.price = 100
	wrapper.vm.address = 'testveien 1010'
	wrapper.vm.postalCode = 2020

	it('cannot submit if date is not selected ', async () => {
		await wrapper.find('[data-testid="form"]').trigger('submit.prevent')

		expect(axios.post).toHaveBeenCalledTimes(1)
	})

	vi.spyOn(axios, 'post')
	it('axios post is called when form is submitted with valid data', async () => {
		wrapper.vm.range = {
			start: new Date(2017, 4, 4, 17, 23, 42, 11),
			end: new Date(2017, 4, 4, 17, 23, 42, 11),
		}

		await wrapper.find('[data-testid="form"]').trigger('submit.prevent')

		expect(axios.post).toHaveBeenCalledTimes(2)
	})
})
