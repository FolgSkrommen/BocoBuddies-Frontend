import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import axios from 'axios'

interface User {
	firstName: string
	lastName: string
	email: string
	password: string
	address: string
	postalCode: string
	phoneNumber: number
	pictureUrl: string
}

export interface State {
	user?: User
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
	state: {
		user: undefined,
	},

	getters: {
		loggedIn(state) {
			return !!state.user;
		},
	},

	mutations: {
		SET_USER_DATA(state, user) {
			state.user = user;
			localStorage.setItem("user", JSON.stringify(user));
			axios.defaults.headers.common["authorization"] = "Bearer " + user.token;
		},
		async CLEAR_USER_DATA(state) {
			state.user = undefined;
			await localStorage.removeItem("user");
			location.reload();
		},
	},
	actions:{
		login({ commit }, parameters){
			return axios.post("/user/login", null, {
				params:{
					email: parameters.email,
					password: parameters.password,
				}})
				.then((response) => {
					commit("SET_USER_DATA", response.data);
			})
		},
		logout({ commit }) {
			commit("CLEAR_USER_DATA");
		},
	}
})

export function useStore() {
	return baseUseStore(key)
}
