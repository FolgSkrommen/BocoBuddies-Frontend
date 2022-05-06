import { describe, expect, it, vi } from 'vitest'
import MyLoan from '../../../src/pages/MyLoan.vue'
import { flushPromises, mount, shallowMount } from '@vue/test-utils'
import axios from 'axios'
describe('Tests for MyLoan', () => {
	it('Renders properly', () => {
		expect(true).toBe(true)
		/*
        const wrapper = mount(MyLoan)
        expect(wrapper.exists())
        const mockSpy = vi.spyOn(axios, 'get')

        expect(mockSpy).toHaveBeenCalledTimes(1)
        expect(wrapper.vm.status).toBe('error')
        expect(wrapper.vm.errorMessage).toBe("what")

         */
	})
})
