import 'vuetify/styles'
import { createApp } from 'vue'
import Playground from './Playground.vue'
import { createVuetifyInstance } from '@/vuetifyConfig'
import { router } from './router'

const vuetify = createVuetifyInstance()

// Ensure typography overrides (scoped under .theme-cnam/.theme-pa) apply in Playground
// By default we start with CNAM theme
if (typeof document !== 'undefined') {
  document.documentElement.classList.add('theme-cnam')
}

createApp(Playground)
	.use(vuetify)
	.use(router)
	.mount('#app')
