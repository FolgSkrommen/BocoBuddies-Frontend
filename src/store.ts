import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
//Check out: https://vuex.vuejs.org/guide/typescript-support.html#simplifying-usestore-usage

interface User {
	firstName: string
	lastName: string
	email: string
	password: string
	adress: string
	postalCode: string
	phoneNumber: number
	pictureUrl: string
}

export interface State {
	count: number
	user?: User
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
	state: {
		count: 0,
		user: undefined,
	},
})

export function useStore() {
	return baseUseStore(key)
}
