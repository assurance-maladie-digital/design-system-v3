import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import SyHeading from './SyHeading.vue'

describe('SyHeading - Accessibility', () => {
	it('should not have any accessibility violations with default props', async () => {
		const wrapper = mount(SyHeading, {
			slots: {
				default: 'Default heading',
			},
		})

		const results = await axe(wrapper.element)
		assertNoA11yViolations(results, 'SyHeading - default props')
	})

	it('should not have accessibility violations with all heading levels', async () => {
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
			assertNoA11yViolations(results, 'SyHeading - default props')
		}
	})

	it('should not have accessibility violations with complex content', async () => {
		const wrapper = mount(SyHeading, {
			props: {
				level: 3,
			},
			slots: {
				default: '<span>Heading with <em>emphasis</em> and <strong>strong text</strong></span>',
			},
		})

		const results = await axe(wrapper.element)
		assertNoA11yViolations(results, 'SyHeading - default props')
	})

	it('should not have accessibility violations with very long content', async () => {
		const longContent = 'This is a very long heading text that might wrap across multiple lines and should still be accessible to screen readers and other assistive technologies without any issues.'

		const wrapper = mount(SyHeading, {
			props: {
				level: 2,
			},
			slots: {
				default: longContent,
			},
		})

		const results = await axe(wrapper.element)
		assertNoA11yViolations(results, 'SyHeading - default props')
	})

	it('should not have accessibility violations with special characters', async () => {
		const wrapper = mount(SyHeading, {
			props: {
				level: 1,
			},
			slots: {
				default: 'Heading with special chars: éàüßñ & symbols @#$%',
			},
		})

		const results = await axe(wrapper.element)
		assertNoA11yViolations(results, 'SyHeading - default props')
	})

	it('should use semantic heading elements correctly', async () => {
		const levels = [1, 2, 3, 4, 5, 6] as const

		for (const level of levels) {
			const wrapper = mount(SyHeading, {
				props: {
					level,
				},
				slots: {
					default: `Semantic heading level ${level}`,
				},
			})

			// Verify the correct semantic heading element is used
			expect(wrapper.find(`h${level}`).exists()).toBe(true)

			// Verify no accessibility violations
			const results = await axe(wrapper.element)
			assertNoA11yViolations(results, 'SyHeading - default props')
		}
	})

	it('should maintain heading hierarchy for screen readers', async () => {
		const wrapper = mount(SyHeading, {
			props: {
				level: 2,
			},
			slots: {
				default: 'Important section heading',
			},
		})

		// Verify the heading is properly structured for screen readers
		const heading = wrapper.find('h2')
		expect(heading.exists()).toBe(true)
		expect(heading.text()).toBe('Important section heading')

		const results = await axe(wrapper.element)
		assertNoA11yViolations(results, 'SyHeading - default props')
	})
})
