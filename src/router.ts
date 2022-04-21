import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import Chat from './pages/Chat.vue'
//Check out: https://router.vuejs.org/guide/#javascript

const routes = [{ path: '/', component: Home }, { path: '/chat', component: Chat}]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

export default router
