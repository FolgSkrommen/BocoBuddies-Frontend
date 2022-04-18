import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
//Check out: https://vuex.vuejs.org/guide/typescript-support.html#simplifying-usestore-usage

export interface State {
	count: number
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
	state: {
		count: 0,
	},
})

export function useStore() {
	return baseUseStore(key)
}
