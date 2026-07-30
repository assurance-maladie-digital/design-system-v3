import 'vuetify/styles'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import SandBoxLayout from './SandBoxLayout.vue'
import { createVuetifyInstance } from '@/vuetifyConfig'

const vuetify = createVuetifyInstance()

if (typeof document !== 'undefined') {
	document.documentElement.classList.add('theme-cnam')
}

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			name: 'sandbox-home',
			path: '/sandbox.html',
			component: () => import('./pages/HomePage.vue'),
		},
		{
			name: 'sandbox-form',
			path: '/sandbox.html/form',
			component: () => import('./pages/FormPage.vue'),
		},
		{
			name: 'sandbox-components',
			path: '/sandbox.html/components',
			component: () => import('./pages/ComponentsPage.vue'),
		},
	],
})

createApp(SandBoxLayout)
	.use(vuetify)
	.use(router)
	.mount('#app')
