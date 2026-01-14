import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			name: 'home',
			path: '/',
			component: () => import('./Home.vue'),
		},
		{
			name: 'about',
			path: '/about',
			component: () => import('./About.vue'),
		},
	],
})
