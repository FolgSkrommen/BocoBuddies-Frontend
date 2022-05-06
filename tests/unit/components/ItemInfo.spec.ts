import { describe, expect, it, vi } from 'vitest'
import ItemInfo from '../../../src/components/ItemInfo.vue'
import { flushPromises, mount, shallowMount } from '@vue/test-utils'
import axios from 'axios'
import Vue from '@vitejs/plugin-vue'
import { Item } from '../../../src/api/schema'

describe('Tests for ItemInfo', () => {
	const mockItem: Item = {
		itemId: 1,
		position: {
			lat: 1,
			lng: 2,
		},
		active: true,
		filters: [
			{
				id: 1,
				value: '123',
			},
		],
		name: 'Item name',
		description: 'description',
		price: 100,
		priceUnit: 'DAYS',
		postalCode: '8006',
		address: 'Gate',
		images: ['img'],
		availableFrom: 'from',
		availableTo: 'to',
		categories: ['cat1', 'cat2'],
	}

	describe('Tests to make sure it renders properly when', () => {
		it('Standard render', async () => {
			const wrapper = mount(ItemInfo, {
				props: {
					item: mockItem,
				},
			})
			expect(wrapper.exists())
		})
	})
})
