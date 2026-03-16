// @vitest-environment jsdom
import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import SyIconButton from '../SyIconButton.vue'

const globalStubs = {
	global: {
		stubs: {
			'v-btn': {
				template: '<button :aria-label="ariaLabel" :disabled="disabled"><slot></slot></button>',
				props: ['ariaLabel', 'disabled', 'size', 'variant', 'icon'],
			},
			'SyIcon': {
				template: '<span class="sy-icon" :aria-hidden="decorative ? true : undefined"></span>',
				props: ['icon', 'color', 'size', 'decorative'],
			},
		},
	},
}

describe('SyIconButton – accessibility (axe)', () => {
	it('has no obvious axe violations in default state', async () => {
		const wrapper = mount(SyIconButton, {
			props: {
				icon: 'mdi-close',
				label: 'Fermer',
			},
			...globalStubs,
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyIconButton – default state', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations when disabled', async () => {
		const wrapper = mount(SyIconButton, {
			props: {
				icon: 'mdi-close',
				label: 'Fermer',
				disabled: true,
			},
			...globalStubs,
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyIconButton – disabled', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations with color and size', async () => {
		const wrapper = mount(SyIconButton, {
			props: {
				icon: 'mdi-alert',
				label: 'Alerte importante',
				color: 'primary',
				size: 'large',
			},
			...globalStubs,
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyIconButton – color and size', {
			ignoreRules: ['region'],
		})
	})

	it('has aria-label on the button', async () => {
		const wrapper = mount(SyIconButton, {
			props: {
				icon: 'mdi-close',
				label: 'Fermer',
			},
			...globalStubs,
		})

		const results = await axe(wrapper.element as HTMLElement)

		assertNoA11yViolations(results, 'SyIconButton – aria-label on button', {
			ignoreRules: ['region'],
		})
	})
})
