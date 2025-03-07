import { createApp } from 'vue'
import Playground from './Playground.vue'
import 'vuetify/styles'
import { createVuetifyInstance } from '../.storybook/vuetifyConfig'
import { router } from './router'

const vuetify = createVuetifyInstance()

createApp(Playground)
	.use(vuetify)
	.use(router)
	.mount('#app')
