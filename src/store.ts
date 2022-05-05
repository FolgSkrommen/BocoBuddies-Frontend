import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import axios from 'axios'
import { User } from './api/schema'

export interface State {
	user?: User
	token?: string
	banners: {
		error: {
			show: boolean
			message: string
		}
		info: {
			show: boolean
			message: string
		}
		success: {
			show: boolean
			message: string
		}
	}
}

export const key: InjectionKey<Store<State>> = Symbol()
export const store = createStore<State>({
	state: {
		user: undefined,
		token: undefined,
		banners: {
			error: {
				show: false,
				message: '',
			},
			info: {
				show: false,
				message: '',
			},
			success: {
				show: false,
				message: '',
			},
		},
	},

	getters: {
		loggedIn(state) {
			return !!state.user
		},
	},

	mutations: {
		SET_USER_DATA(state, user) {
			console.log('Setting user data...')
			state.user = user
			localStorage.setItem('userData', JSON.stringify(user))
		},

		SET_TOKEN(state, token) {
			localStorage.setItem('token', JSON.stringify(token))
			state.token = token
			axios.defaults.headers.common['authorization'] = 'Bearer ' + token
		},

		async SET_NEW_USER_DATA(state, data) {
			state.user = data
			await localStorage.removeItem('userData')
			await localStorage.setItem('userData', JSON.stringify(data))
		},
		//TODO: Fjern asynkron kode i mutations
		async CLEAR_USER_DATA(state) {
			state.user = undefined
			await localStorage.removeItem('userData')
		},
		SHOW_BANNER(
			{ banners },
			{
				banner,
				message,
			}: { message: string; banner: 'error' | 'info' | 'success' }
		) {
			banners[banner].show = true
			banners[banner].message = message
		},
		HIDE_BANNER({ banners }, banner: 'error' | 'info' | 'success') {
			banners[banner].show = false
			banners[banner].message = ''
		},
	},
	actions: {
		async login({ commit }, data) {
			const res = await axios.post('/user/login', data)
			commit('SET_USER_DATA', res.data.user)
			commit('SET_TOKEN', res.data.token)
		},
		logout({ commit }) {
			commit('CLEAR_USER_DATA')
		},
		edit({ commit }, data) {
			commit('SET_NEW_USER_DATA', data)
		},
		error({ commit }, message: string) {
			commit('SHOW_BANNER', { banner: 'error', message })
		},
		info({ commit }, message: string) {
			commit('SHOW_BANNER', { banner: 'info', message })
		},
		infoWithTimeout(
			{ commit },
			{ message, timeout }: { message: string; timeout: number }
		) {
			commit('SHOW_BANNER', { banner: 'info', message })
			setTimeout(() => {
				commit('HIDE_BANNER', 'info')
			}, timeout)
		},
		success({ commit }, message: string) {
			commit('SHOW_BANNER', { banner: 'success', message })
		},
		successWithTimeout(
			{ commit },
			{ message, timeout = 2000 }: { message: string; timeout?: number }
		) {
			commit('SHOW_BANNER', { banner: 'success', message })
			setTimeout(() => {
				commit('HIDE_BANNER', 'success')
			}, timeout)
		},
		hideBanner({ commit }, banner: 'error' | 'info' | 'success') {
			commit('HIDE_BANNER', banner)
		},
	},
})

export function useStore() {
	return baseUseStore(key)
}
