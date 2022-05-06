import { describe, expect, it, vi } from 'vitest'
import NavBar from '../../../src/components/NavBar.vue'
import { flushPromises, mount, shallowMount } from '@vue/test-utils'
import axios from 'axios'
describe('Tests for Navbar', () => {
	it('Renders properly', () => {
		const wrapper = mount(NavBar)
		expect(wrapper.exists())
	})
	it('All Icons loads', () => {
		const wrapper = mount(NavBar)
		expect(wrapper.find('[data-testid="search-icon"]').exists())
		expect(wrapper.find('[data-testid="yours-icon"]').exists())
		expect(wrapper.find('[data-testid="community-icon"]').exists())
		expect(wrapper.find('[data-testid="loan-icon"]').exists())
		expect(wrapper.find('[data-testid="profile-icon"]').exists())
	})
	it('All names under icon loads', () => {
		const wrapper = mount(NavBar)
		expect(wrapper.find('[data-testid="search"]').exists())
		expect(wrapper.find('[data-testid="yours"]').exists())
		expect(wrapper.find('[data-testid="community"]').exists())
		expect(wrapper.find('[data-testid="loan"]').exists())
		expect(wrapper.find('[data-testid="profile"]').exists())
	})
})
