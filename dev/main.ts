import 'vuetify/styles'
import { createApp } from 'vue'
import Playground from './Playground.vue'
import { createVuetifyInstance } from '@/vuetifyConfig'
import { router } from './router'

const vuetify = createVuetifyInstance()

createApp(Playground)
	.use(vuetify)
	.use(router)
	.mount('#app')
