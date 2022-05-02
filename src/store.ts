import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import axios from 'axios'
import { User } from './api/schema'

export interface State {
	user?: User
	token?: string
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
	state: {
		user: undefined,
		token: undefined,
	},

	getters: {
		loggedIn(state) {
			return !!state.user
		},
	},

	mutations: {
		SET_USER_DATA(state, data) {
			console.log('Setting user data...')
			console.log(data)
			state.user = data.user
			localStorage.setItem('userData', JSON.stringify(data))
			axios.defaults.headers.common['authorization'] =
				'Bearer ' + data.token
		},
		SET_NEW_USER_DATA(state, data) {
			state.user = data
		},
		//TODO: Fjern asynkron kode i mutations
		async CLEAR_USER_DATA(state) {
			state.user = undefined
			await localStorage.removeItem('userData')
		},
	},
	actions: {
		async login({ commit }, data) {
			const res = await axios.post('/user/login', data)
			commit('SET_USER_DATA', res.data)
		},
		logout({ commit }) {
			commit('CLEAR_USER_DATA')
		},
		edit({ commit }, data) {
			commit('SET_NEW_USER_DATA', data)
		},
	},
})

export function useStore() {
	return baseUseStore(key)
}
