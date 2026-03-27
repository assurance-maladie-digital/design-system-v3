import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import SyHeading from './SyHeading.vue'

describe('SyHeading', () => {
	it('renders default heading level 2', () => {
		const wrapper = mount(SyHeading, {
			slots: {
				default: 'Test heading',
			},
		})

		expect(wrapper.find('h2').exists()).toBe(true)
		expect(wrapper.text()).toBe('Test heading')
		expect(wrapper.classes()).toContain('sy-heading')
	})

	it('renders custom heading levels', () => {
		const levels = [1, 2, 3, 4, 5, 6] as const

		levels.forEach((level) => {
			const wrapper = mount(SyHeading, {
				props: {
					level,
				},
				slots: {
					default: `Heading level ${level}`,
				},
			})

			expect(wrapper.find(`h${level}`).exists()).toBe(true)
			expect(wrapper.text()).toBe(`Heading level ${level}`)
		})
	})

	it('applies correct CSS class', () => {
		const wrapper = mount(SyHeading, {
			slots: {
				default: 'Test heading',
			},
		})

		expect(wrapper.classes()).toContain('sy-heading')
	})

	it('renders complex content', () => {
		const wrapper = mount(SyHeading, {
			slots: {
				default: '<span>Complex <strong>content</strong></span>',
			},
		})

		expect(wrapper.text()).toBe('Complex content')
	})

	it('should not have any accessibility violations', async () => {
		const wrapper = mount(SyHeading, {
			props: {
				level: 1,
			},
			slots: {
				default: 'Main heading',
			},
		})

		const results = await axe(wrapper.element)
		assertNoA11yViolations(results, 'SyHeading - main heading')
	})

	it('should not have accessibility violations for all heading levels', async () => {
		const levels = [1, 2, 3, 4, 5, 6] as const

		for (const level of levels) {
			const wrapper = mount(SyHeading, {
				props: {
					level,
				},
				slots: {
					default: `Heading level ${level}`,
				},
			})

			const results = await axe(wrapper.element)
			assertNoA11yViolations(results, `SyHeading - level ${level}`)
		}
	})

	it('should not have accessibility violations with complex content', async () => {
		const wrapper = mount(SyHeading, {
			props: {
				level: 2,
			},
			slots: {
				default: '<span>Heading with <em>emphasis</em> and <strong>strong text</strong></span>',
			},
		})

		const results = await axe(wrapper.element)
		assertNoA11yViolations(results, 'SyHeading - complex content')
	})
})
