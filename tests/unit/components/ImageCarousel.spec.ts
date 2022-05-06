import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import ImageCarousel from '../../../src/components/ImageCarousel.vue'

describe('ImageCarousel', () => {
	const images = ['image1==', 'image2==', 'image3==']
	it('renders when props are passed', () => {
		const wrapper = mount(ImageCarousel, {
			props: {
				images: images,
			},
		})

		expect(wrapper.findAll('[data-testid="carousel"]').length).toBe(
			images.length
		)
	})

	it('does not render when empty props are passed', () => {
		const wrapper = mount(ImageCarousel, {
			props: {
				images: [],
			},
		})

		expect(wrapper.findAll('[data-testid="carousel"]').length).toBe(0)
	})
})
