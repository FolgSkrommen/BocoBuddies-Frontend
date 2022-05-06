import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import ItemList from '../../../src/components/ItemList.vue'

describe('ItemList', () => {
	const items = [
		{
			itemId: 1,
			name: 'item',
			description: 'desc',
			price: 100,
			priceUnit: 'DAY',
			postalCode: '3440',
			address: 'Here',
			position: { lat: 1, lng: 1 },
			images: ['img1=='],
			active: true,
			availableFrom: 'now',
			availableTo: 'later',
			categories: ['cat1', 'subcat1'],
			filters: [],
		},
	]
	const searchHits = '1 resultat'
	const redirect = 'route'
	const renderLoadButton = true

	it('renders properly, when not editing and having redirect', () => {
		const wrapper = mount(ItemList, {
			props: {
				edit: false,
				items: items,
				searchHits: searchHits,
				redirect: redirect,
				renderLoadButton: renderLoadButton,
			},
		})

		expect(wrapper.findAll('[data-testid="item-card"]').length).toBe(
			items.length
		)

		expect(wrapper.find('[data-testid="item-price"]').exists()).toBeTruthy()
		expect(wrapper.find('[data-testid="item-name"]').exists()).toBeTruthy()
		expect(wrapper.find('[data-testid="item-image"]').exists()).toBeTruthy()

		expect(wrapper.find('[data-testid="edit-button"]').exists()).toBeFalsy()

		expect(
			wrapper.find('[data-testid="load-more-items-button"]').exists()
		).toBeTruthy()
	})

	it('renders properly, when editing and having redirect', () => {
		const wrapper = mount(ItemList, {
			props: {
				edit: true,
				items: items,
				searchHits: searchHits,
				redirect: redirect,
				renderLoadButton: renderLoadButton,
			},
		})

		expect(wrapper.findAll('[data-testid="item-card"]').length).toBe(
			items.length
		)

		expect(wrapper.find('[data-testid="item-price"]').exists()).toBeTruthy()
		expect(wrapper.find('[data-testid="item-name"]').exists()).toBeTruthy()
		expect(wrapper.find('[data-testid="item-image"]').exists()).toBeTruthy()

		expect(
			wrapper.find('[data-testid="edit-button"]').exists()
		).toBeTruthy()

		expect(
			wrapper.find('[data-testid="load-more-items-button"]').exists()
		).toBeTruthy()
	})

	it('renders properly, when not editing and not having redirect', () => {
		const wrapper = mount(ItemList, {
			props: {
				edit: false,
				items: items,
				searchHits: searchHits,
				renderLoadButton: renderLoadButton,
			},
		})

		expect(wrapper.findAll('[data-testid="item-card"]').length).toBe(
			items.length
		)

		expect(wrapper.find('[data-testid="item-price"]').exists()).toBeTruthy()
		expect(wrapper.find('[data-testid="item-name"]').exists()).toBeTruthy()
		expect(wrapper.find('[data-testid="item-image"]').exists()).toBeTruthy()

		expect(wrapper.find('[data-testid="edit-button"]').exists()).toBeFalsy()

		expect(
			wrapper.find('[data-testid="load-more-items-button"]').exists()
		).toBeTruthy()
	})

	it('renders properly, when not editing and not having redirect', () => {
		const wrapper = mount(ItemList, {
			props: {
				edit: true,
				items: items,
				searchHits: searchHits,
				renderLoadButton: renderLoadButton,
			},
		})

		expect(wrapper.findAll('[data-testid="item-card"]').length).toBe(
			items.length
		)

		expect(wrapper.find('[data-testid="item-price"]').exists()).toBeTruthy()
		expect(wrapper.find('[data-testid="item-name"]').exists()).toBeTruthy()
		expect(wrapper.find('[data-testid="item-image"]').exists()).toBeTruthy()

		expect(
			wrapper.find('[data-testid="edit-button"]').exists()
		).toBeTruthy()

		expect(
			wrapper.find('[data-testid="load-more-items-button"]').exists()
		).toBeTruthy()
	})

	it('emits proper event when load more items button is clicked', async () => {
		const wrapper = mount(ItemList, {
			props: {
				edit: false,
				items: items,
				searchHits: searchHits,
				renderLoadButton: renderLoadButton,
			},
		})

		await wrapper
			.find('[data-testid="load-more-items-button"]')
			.trigger('click')
		expect(wrapper.emitted('load-more-items')).toBeTruthy()
	})

	it('emits proper event when item is clicked and redirect is not included', async () => {
		const wrapper = mount(ItemList, {
			props: {
				edit: false,
				items: items,
				searchHits: searchHits,
				renderLoadButton: renderLoadButton,
			},
		})

		await wrapper.find('[data-testid="not-redirect"]').trigger('click')
		expect(wrapper.emitted('item-clicked')).toBeTruthy()
	})

	it('does not emit item-clicked event when redirect is included', async () => {
		const wrapper = mount(ItemList, {
			props: {
				edit: false,
				items: items,
				searchHits: searchHits,
				redirect: redirect,
				renderLoadButton: renderLoadButton,
			},
		})

		await wrapper.find('[data-testid="redirect"]').trigger('click')
		expect(wrapper.emitted('item-clicked')).toBeFalsy()
	})
})
