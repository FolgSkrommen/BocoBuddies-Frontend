import { shallowMount } from '@vue/test-utils'
import Chat from '@/pages/Chat.vue'

describe('Chat', () => {
	describe('when loaded', () => {
		it('has the required elements', () => {
			const wrapper = shallowMount(Chat)
		})
	})
})
