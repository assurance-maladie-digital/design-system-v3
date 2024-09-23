import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { vuetify } from '@tests/unit/setup'

import PageContainer from '../PageContainer.vue'

describe('PageContainer', () => {
    it('render correctly', async () => {
        const wrapper = mount(PageContainer, {
            global: {
                plugins: [vuetify],
            },
        })

        expect(wrapper.html()).toMatchSnapshot()
    })

    it('render correctly with slot', async () => {
        const wrapper = mount(PageContainer, {
            slots: {
                default: 'slot content',
            },
            global: {
                plugins: [vuetify],
            },
        })

        expect(wrapper.html()).toContain('slot content')
    })

    it('render correctly with spacing class', async () => {
        const wrapper = mount(PageContainer, {
            props: {
                spacing: 'ma-4',
            },
            global: {
                plugins: [vuetify],
            },
        })

        expect(wrapper.vm.spacingClass).toBe('ma-4')
    })

    it('containerSize computed property', async () => {
        const wrapper = mount(PageContainer, {
            props: {
               size: 'l',
            },
            global: {
                plugins: [vuetify],
            },
        })

        expect(wrapper.vm.containerSize).toBe(960)
    })
})

