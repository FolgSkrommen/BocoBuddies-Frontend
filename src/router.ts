import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
//Check out: https://router.vuejs.org/guide/#javascript

const routes = [{ path: '/', component: Home }]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

export default router
