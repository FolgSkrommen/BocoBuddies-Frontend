import { createRouter, createWebHistory } from 'vue-router'
//Check out: https://router.vuejs.org/guide/#javascript

import Home from './pages/Home.vue'
import Chat from './pages/Chat.vue'
import Chats from './pages/Chats.vue'
import Item from './pages/Item.vue'
import ItemRegister from './pages/ItemRegister.vue'
import MyItems from './pages/MyItems.vue'
import MyLoans from './pages/MyLoans.vue'
import Settings from './pages/Settings.vue'
import UserLogin from './pages/UserLogin.vue'
import UserRegister from './pages/UserRegister.vue'
import { store } from './store'

const routes = [
	{
		path: '/',
		component: Home,
		meta: {
			requiresAuth: false,
		},
	},
	{
		path: '/chats',
		component: Chats,
		meta: {
			requiresAuth: true,
		},
	},
	{
		path: '/chat/:id',
		component: Chat,
		meta: {
			requiresAuth: true,
		},
	},
	{
		path: '/item/:id',
		component: Item,
		meta: {
			requiresAuth: false,
		},
	},
	{
		path: '/item/register',
		component: ItemRegister,
		meta: {
			requiresAuth: true,
		},
	},
	{
		path: '/my-items/',
		component: MyItems,
		meta: {
			requiresAuth: true,
		},
	},
	{
		path: '/my-loans',
		component: MyLoans,
		meta: {
			requiresAuth: true,
		},
	},
	{
		path: '/settings',
		component: Settings,
		meta: {
			requiresAuth: true,
		},
	},
	{
		path: '/login',
		component: UserLogin,
		meta: {
			requiresAuth: false,
		},
	},
	{
		path: '/register',
		component: UserRegister,
		meta: {
			requiresAuth: false,
		},
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

router.beforeEach((to, from, next) => {
	const loggedIn = store.getters.loggedIn
	const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

	if (requiresAuth && !loggedIn) {
		return next('/login')
	}
	if (['/register', '/login'].includes(to.path) && loggedIn) {
		return next('/user/settings')
	}
	return next()
})

export default router
