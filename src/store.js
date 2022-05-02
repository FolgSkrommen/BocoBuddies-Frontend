import { createStore, useStore as baseUseStore } from 'vuex'
import axios from 'axios'
export const key = Symbol()
export const store = createStore({
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
			console.log(data)
			state.user = data.user
			localStorage.setItem('userData', JSON.stringify(data))
			axios.defaults.headers.common['authorization'] =
				'Bearer ' + data.token
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
	},
})
export function useStore() {
	return baseUseStore(key)
}
//# sourceMappingURL=store.js.map