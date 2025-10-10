import 'vuetify/styles'
import { createApp } from 'vue'
import Playground from './Playground.vue'
import { createVuetifyInstance } from '@/vuetifyConfig'
import { router } from './router'

const vuetify = createVuetifyInstance()

// Applique theme CNAM par défaut dans le playground
if (typeof document !== 'undefined') {
	document.documentElement.classList.add('theme-cnam')
}

createApp(Playground)
	.use(vuetify)
	.use(router)
	.mount('#app')
