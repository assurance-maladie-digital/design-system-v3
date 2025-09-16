import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproErrorTemplate from '../AmeliproErrorTemplate.vue'
import { vuetify } from '@tests/unit/setup'

describe('AmeliproErrorTemplate', () => {
    it('render correctly', async () => {
        const wrapper = mount(AmeliproErrorTemplate, {
            global: {
                plugins: [vuetify],
            },
            props: {
                btnHref: '#modified-btn-href',
                customBtnText: 'Modified custom btn text',
                customContentText: 'Modified content text',
                customContentTitle: 'Modified content title',
                customImgUrl: 'modified-custom-img-url',
                customTitleText: 'Modified title',
                errorType: 'error500',
                imgMinWidth: '300',
                imgWidth: '350',
                uniqueId: 'error-template-unique-id',
            },
            slots: {
                default: 'My Button',
            },
        })

        expect(wrapper.html()).toMatchSnapshot()
    })
})
