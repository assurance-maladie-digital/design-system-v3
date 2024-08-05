// lib/composables/vuetify.js
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        }
    },
    theme: {
        options: {
            customProperties: true,
        },
        themes: {
            light: {
                primary: '#0c419a',
                secondary: '#545859',
                accent: '#e7ecf5',
                error: '#b33f2e',
                info: '#0c419a',
                success: '#56c271',
                warning: '#f0b323',
            },
        },
    },
})

export default vuetify