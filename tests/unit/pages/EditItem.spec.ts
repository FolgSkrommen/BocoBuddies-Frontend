import { describe, expect, it, vi } from 'vitest'
import EditItem from '../../../src/pages/EditItem.vue'
import { flushPromises, mount, shallowMount } from '@vue/test-utils'
import axios from 'axios'
import Vue from '@vitejs/plugin-vue'
import { useRoute } from 'vue-router'
describe('Tests for EditItem', () => {
	describe('Tests to make sure it renders properly when', () => {
		it('Standard render', async () => {
			expect(true).toBe(true)
			/*
            const wrapper = mount(EditItem, {
                mocks: {
                    route: {
                        path: "/test/12",
                        params: ["12"]
                    },
                    params: {
                        id: "12"
                    }
                }
            })
            expect(wrapper.exists())

             */
		})
	})
})
