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

const routes = [
	{ path: '/', component: Home },
	{ path: '/chats', component: Chats },
	{ path: '/chat/:id', component: Chat },
	{ path: '/item/:id', component: Item },
	{ path: '/item-register/', component: ItemRegister },
	{ path: '/my-items/', component: MyItems },
	{ path: '/my-loans', component: MyLoans },
	{ path: '/settings', component: Settings },
	{ path: '/user-login', component: UserLogin },
	{ path: '/user-register', component: UserRegister },
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

export default router
