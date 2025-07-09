import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { config } from '@vue/test-utils'
import { createVuetify } from 'vuetify'

export const vuetify = createVuetify({
	components,
	directives,
})

config.global.plugins = [vuetify]
