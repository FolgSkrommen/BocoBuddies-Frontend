import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import axios from 'axios'

interface User {
	id: number
	firstName: string
	lastName: string
	username: string
	email: string
	address: string
	postalcode: string
	phonenumber: string
	pictureUrl: string
	verified: boolean
	trusted: boolean
}

export interface State {
	count: number
	user?: User
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
	state: {
		count: 0,
		user: {
			id: 3,
			firstName: 'Erlend',
			lastName: 'Ryan',
			username: 'user420',
			email: 'example2@example.com',
			address: 'Gløshaugen',
			postalcode: '1001',
			phonenumber: '12345678',
			pictureUrl:
				'https://lh3.googleusercontent.com/ogw/ADea4I4hTP63iOB0qP6o2RbORisNmqEKSDa9shpDI8qqPw=s64-c-mo',
			verified: false,
			trusted: false,
		},
	},

	getters: {
		loggedIn(state) {
			return !!state.user
		},
	},

	mutations: {
		SET_USER_DATA(state, user) {
			state.user = user
			localStorage.setItem('user', JSON.stringify(user))
			axios.defaults.headers.common['authorization'] =
				'Bearer ' + user.token
		},
		async CLEAR_USER_DATA(state) {
			state.user = undefined
			await localStorage.removeItem('user')
			location.reload()
		},
	},
	actions: {
		login({ commit }, credentials: { email: String; password: String }) {
			return axios
				.post('/user/login', null, {
					params: {
						email: credentials.email,
						password: credentials.password,
					},
				})
				.then(response => {
					commit('SET_USER_DATA', response.data)
				})
		},
		logout({ commit }) {
			commit('CLEAR_USER_DATA')
		},
	},
})

export function useStore() {
	return baseUseStore(key)
}
