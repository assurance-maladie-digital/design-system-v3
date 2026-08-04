import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SyIconButton from '../SyIconButton.vue'

const globalStubs = {
	global: {
		stubs: {
			'v-btn': {
				template: '<button :aria-label="ariaLabel" :disabled="disabled" @click="$emit(\'click\', $event)"><slot></slot></button>',
				props: ['ariaLabel', 'disabled', 'size', 'variant', 'icon', 'color'],
				emits: ['click'],
			},
			'SyIcon': {
				template: '<span class="sy-icon" :aria-hidden="decorative ? true : undefined"></span>',
				props: ['icon', 'size', 'decorative'],
			},
		},
	},
}

describe('SyIconButton', () => {
	it('renders correctly', () => {
		const wrapper = mount(SyIconButton, {
			props: {
				icon: 'mdi-close',
				label: 'Fermer',
			},
			...globalStubs,
		})

		expect(wrapper.html()).toMatchSnapshot()
	})

	it('renders a button with the correct aria-label', () => {
		const wrapper = mount(SyIconButton, {
			props: {
				icon: 'mdi-close',
				label: 'Fermer',
			},
			...globalStubs,
		})

		const button = wrapper.find('button')
		expect(button.exists()).toBe(true)
		expect(button.attributes('aria-label')).toBe('Fermer')
	})

	it('renders the icon as decorative (aria-hidden="true")', () => {
		const wrapper = mount(SyIconButton, {
			props: {
				icon: 'mdi-close',
				label: 'Fermer',
			},
			...globalStubs,
		})

		const icon = wrapper.find('.sy-icon')
		expect(icon.exists()).toBe(true)
		expect(icon.attributes('aria-hidden')).toBe('true')
	})

	it('renders the correct icon', () => {
		const wrapper = mount(SyIconButton, {
			props: {
				icon: 'mdi-close',
				label: 'Fermer',
			},
			...globalStubs,
		})

		expect(wrapper.find('.sy-icon').exists()).toBe(true)
	})

	it('disables the button when disabled prop is true', () => {
		const wrapper = mount(SyIconButton, {
			props: {
				icon: 'mdi-close',
				label: 'Fermer',
				disabled: true,
			},
			...globalStubs,
		})

		expect(wrapper.find('button').attributes('disabled')).toBeDefined()
	})

	it('emits click-icon-button when clicked', async () => {
		const wrapper = mount(SyIconButton, {
			props: {
				icon: 'mdi-close',
				label: 'Fermer',
			},
			...globalStubs,
		})

		await wrapper.find('button').trigger('click')
		expect(wrapper.emitted('click-icon-button')).toBeTruthy()
	})

	it('passes the size prop to v-btn', () => {
		const wrapper = mount(SyIconButton, {
			props: {
				icon: 'mdi-close',
				label: 'Fermer',
				size: 'large',
			},
			...globalStubs,
		})

		expect(wrapper.html()).toMatchSnapshot()
	})


    it('passes the color prop to v-btn', () => {
        const wrapper = mount(SyIconButton, {
            props: {
                icon: 'mdi-close',
                label: 'Fermer',
                variant: 'outlined',
                color: 'primary',
            },
            ...globalStubs,
        })

        expect(wrapper.html()).toMatchSnapshot()
    })

	it('passes the variant prop to v-btn', () => {
		const wrapper = mount(SyIconButton, {
			props: {
				icon: 'mdi-close',
				label: 'Fermer',
				variant: 'outlined',
			},
			...globalStubs,
		})

		expect(wrapper.html()).toMatchSnapshot()
	})

	it('uses text variant by default', () => {
		const wrapper = mount(SyIconButton, {
			props: {
				icon: 'mdi-close',
				label: 'Fermer',
			},
			...globalStubs,
		})

		const button = wrapper.find('button')
		expect(button.exists()).toBe(true)
		expect(wrapper.html()).toMatchSnapshot()
	})
})

// SyIconButton est un wrapper de <v-btn icon> : le ring de focus vient de l'override
// global (_btns.scss). jsdom ne calcule pas :focus-visible : on vérifie le prérequis —
// un <button> natif focusable.
describe('SyIconButton - focus', () => {
	it('renders a native <button> so the global focus ring applies', () => {
		const wrapper = mount(SyIconButton, { props: { icon: 'mdi-pencil', label: 'Modifier' } })
		expect(wrapper.get('.v-btn').element.tagName).toBe('BUTTON')
		wrapper.unmount()
	})

	it('is focusable', () => {
		const wrapper = mount(SyIconButton, {
			props: { icon: 'mdi-pencil', label: 'Modifier' },
			attachTo: document.body,
		})
		const button = wrapper.get('.v-btn').element as HTMLButtonElement
		button.focus()
		expect(document.activeElement).toBe(button)
		wrapper.unmount()
	})
})
