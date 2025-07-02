import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { config } from '@vue/test-utils'
import { createVuetify } from 'vuetify'

const vuetify = createVuetify({
	components,
	directives,
})

config.global.plugins = [vuetify]
