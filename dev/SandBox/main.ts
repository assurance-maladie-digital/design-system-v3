import 'vuetify/styles'
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import SandBoxLayout from './SandBoxLayout.vue'
import { createVuetifyInstance } from '@/vuetifyConfig'

const vuetify = createVuetifyInstance()

if (typeof document !== 'undefined') {
	document.documentElement.classList.add('theme-cnam')
}

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			name: 'sandbox-home',
			path: '/',
			component: () => import('./pages/HomePage.vue'),
		},
		{
			name: 'sandbox-form',
			path: '/form',
			component: () => import('./pages/FormPage.vue'),
		},
		{
			name: 'sandbox-components',
			path: '/components',
			component: () => import('./pages/ComponentsPage.vue'),
		},
		{
			name: 'sandbox-validation',
			path: '/validation',
			component: () => import('./pages/ValidationComparisonPage.vue'),
		},
	],
})

createApp(SandBoxLayout)
	.use(vuetify)
	.use(router)
	.mount('#app')
