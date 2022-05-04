import { createRouter, createWebHistory } from 'vue-router'
//Check out: https://router.vuejs.org/guide/#javascript

import Home from './pages/Home.vue'
import LoanChat from './pages/loan/LoanChat.vue'
import Chats from './pages/loan/Chats.vue'
import Community from './pages/Community.vue'
import Item from './pages/Item.vue'
import Overview from './pages/Overview.vue'
import MyItem from './pages/MyItem.vue'
import MyLoan from './pages/MyLoan.vue'
import ItemRegister from './pages/ItemRegister.vue'
import MyItems from './pages/MyItems.vue'
import MyLoans from './pages/MyLoans.vue'
import Settings from './pages/Settings.vue'
import UserLogin from './pages/UserLogin.vue'
import UserRegister from './pages/UserRegister.vue'
import ConfirmEmail from './pages/ConfirmEmail.vue'
import User from './pages/User.vue'
import VerifyUser from './pages/VerifyUser.vue'
import Chat from './pages/community/Chat.vue'
import EditItem from './pages/EditItem.vue'
import FAQ from './pages/FAQ.vue'
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
		path: '/community',
		component: Community,
		meta: {
			requiresAuth: true,
		},
	},
	{
		path: '/community/chat/:id',
		component: Chat,
		meta: {
			requiresAuth: true,
		},
	},
	{
		path: '/user/:id',
		component: User,
		meta: {
			requiresAuth: false,
		},
	},
	{
		path: '/user/',
		component: User,
		meta: {
			requiresAuth: true,
		},
	},
	{
		path: '/verify-user/',
		component: VerifyUser,
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
		component: LoanChat,
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
		path: '/my-item/:id',
		component: MyItem,
		meta: {
			requiresAuth: true,
		},
	},
	{
		path: '/edit-item/:id',
		component: EditItem,
		meta: {
			requiresAuth: true,
		},
	},
	{
		path: '/my-loan/:id',
		component: MyLoan,
		meta: {
			requiresAuth: true,
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
		path: '/overview',
		component: Overview,
		meta: {
			requiresAuth: true,
		},
		children: [
			{
				path: 'items',
				name: 'myItems',
				component: MyItems,
			},
			{
				path: 'loans',
				name: 'myLoans',
				component: MyLoans,
			},
		],
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
	{
		path: '/confirmEmail/:confirmEmailString',
		component: ConfirmEmail,
		meta: {
			requiresAuth: false,
		},
	},
	{
		path: '/faq',
		component: FAQ,
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
