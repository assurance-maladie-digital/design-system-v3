// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import AmeliproClickableTile from '../AmeliproClickableTile.vue'

describe('AmeliproClickableTile – accessibility (axe)', () => {
	describe('default state', () => {
		it('has no obvious axe violations with icon in default state', async () => {
			const wrapper = mount(AmeliproClickableTile, {
				props: {
					icon: 'utilisateur',
					tileTitle: 'Mon profil',
				},
				attachTo: document.body,
			})

			const results = await axe(wrapper.element as HTMLElement)
			assertNoA11yViolations(results, 'AmeliproClickableTile – icon default state')

			wrapper.unmount()
		})

		it('has no obvious axe violations with image in default state', async () => {
			const wrapper = mount(AmeliproClickableTile, {
				props: {
					imgSrc: 'https://via.placeholder.com/100',
					tileTitle: 'Documents',
				},
				attachTo: document.body,
			})

			const results = await axe(wrapper.element as HTMLElement)
			assertNoA11yViolations(results, 'AmeliproClickableTile – image default state')

			wrapper.unmount()
		})

		it('has no obvious axe violations with href', async () => {
			const wrapper = mount(AmeliproClickableTile, {
				props: {
					icon: 'utilisateur',
					tileTitle: 'Lien externe',
					href: 'https://example.com',
				},
				attachTo: document.body,
			})

			const results = await axe(wrapper.element as HTMLElement)
			assertNoA11yViolations(results, 'AmeliproClickableTile – with href')

			wrapper.unmount()
		})

		it('has no obvious axe violations with to (router link)', async () => {
			const wrapper = mount(AmeliproClickableTile, {
				props: {
					icon: 'document',
					tileTitle: 'Navigation interne',
					to: '/dashboard',
				},
				attachTo: document.body,
			})

			const results = await axe(wrapper.element as HTMLElement)
			assertNoA11yViolations(results, 'AmeliproClickableTile – with to')

			wrapper.unmount()
		})
	})

	describe('disabled state', () => {
		it('has no obvious axe violations when disabled', async () => {
			const wrapper = mount(AmeliproClickableTile, {
				props: {
					icon: 'utilisateur',
					tileTitle: 'Tuile désactivée',
					disabled: true,
				},
				attachTo: document.body,
			})

			const results = await axe(wrapper.element as HTMLElement)
			assertNoA11yViolations(results, 'AmeliproClickableTile – disabled state')

			wrapper.unmount()
		})
	})

	describe('bordered icon state', () => {
		it('has no obvious axe violations with bordered icon', async () => {
			const wrapper = mount(AmeliproClickableTile, {
				props: {
					icon: 'utilisateur',
					tileTitle: 'Icône bordée',
					borderedIcon: true,
				},
				attachTo: document.body,
			})

			const results = await axe(wrapper.element as HTMLElement)
			assertNoA11yViolations(results, 'AmeliproClickableTile – bordered icon')

			wrapper.unmount()
		})
	})

	describe('onlyIconIsClickable mode', () => {
		it('has no obvious axe violations when onlyIconIsClickable is true', async () => {
			const wrapper = mount(AmeliproClickableTile, {
				props: {
					icon: 'utilisateur',
					tileTitle: 'Seule icône cliquable',
					onlyIconIsClickable: true,
				},
				attachTo: document.body,
			})

			const results = await axe(wrapper.element as HTMLElement)
			assertNoA11yViolations(results, 'AmeliproClickableTile – onlyIconIsClickable mode')

			wrapper.unmount()
		})

		it('has no obvious axe violations when onlyIconIsClickable with href', async () => {
			const wrapper = mount(AmeliproClickableTile, {
				props: {
					icon: 'document',
					tileTitle: 'Mode spécial avec lien',
					onlyIconIsClickable: true,
					href: 'https://example.com',
				},
				attachTo: document.body,
			})

			const results = await axe(wrapper.element as HTMLElement)
			assertNoA11yViolations(results, 'AmeliproClickableTile – onlyIconIsClickable with href')

			wrapper.unmount()
		})
	})

	describe('with uniqueId', () => {
		it('has no obvious axe violations with uniqueId', async () => {
			const wrapper = mount(AmeliproClickableTile, {
				props: {
					icon: 'utilisateur',
					tileTitle: 'Avec ID unique',
					uniqueId: 'profile-tile',
				},
				attachTo: document.body,
			})

			const results = await axe(wrapper.element as HTMLElement)
			assertNoA11yViolations(results, 'AmeliproClickableTile – with uniqueId')

			wrapper.unmount()
		})

		it('has no obvious axe violations with uniqueId in onlyIconIsClickable mode', async () => {
			const wrapper = mount(AmeliproClickableTile, {
				props: {
					icon: 'utilisateur',
					tileTitle: 'Avec ID unique en mode spécial',
					uniqueId: 'special-tile',
					onlyIconIsClickable: true,
				},
				attachTo: document.body,
			})

			const results = await axe(wrapper.element as HTMLElement)
			assertNoA11yViolations(results, 'AmeliproClickableTile – uniqueId with onlyIconIsClickable')

			wrapper.unmount()
		})
	})

	describe('image sizing', () => {
		it('has no obvious axe violations with image sizing props', async () => {
			const wrapper = mount(AmeliproClickableTile, {
				props: {
					imgSrc: 'https://via.placeholder.com/100',
					tileTitle: 'Image avec tailles',
					imgWidth: '80px',
					imgMaxWidth: '150px',
					imgMinWidth: '50px',
				},
				attachTo: document.body,
			})

			const results = await axe(wrapper.element as HTMLElement)
			assertNoA11yViolations(results, 'AmeliproClickableTile – image with sizing')

			wrapper.unmount()
		})
	})

	describe('with custom width', () => {
		it('has no obvious axe violations with custom tileWidth', async () => {
			const wrapper = mount(AmeliproClickableTile, {
				props: {
					icon: 'utilisateur',
					tileTitle: 'Largeur personnalisée',
					tileWidth: '50%',
				},
				attachTo: document.body,
			})

			const results = await axe(wrapper.element as HTMLElement)
			assertNoA11yViolations(results, 'AmeliproClickableTile – custom width')

			wrapper.unmount()
		})
	})

	describe('with slot content', () => {
		it('has no obvious axe violations with slot content', async () => {
			const wrapper = mount(AmeliproClickableTile, {
				props: {
					icon: 'utilisateur',
				},
				slots: {
					default: '<span>Contenu du slot</span>',
				},
				attachTo: document.body,
			})

			const results = await axe(wrapper.element as HTMLElement)
			assertNoA11yViolations(results, 'AmeliproClickableTile – with slot content')

			wrapper.unmount()
		})
	})

	describe('multiple instances', () => {
		it('has no obvious axe violations with multiple instances on same page', async () => {
			const container = document.createElement('div')
			container.id = 'test-container'
			document.body.appendChild(container)

			const wrapper1 = mount(AmeliproClickableTile, {
				props: {
					icon: 'utilisateur',
					tileTitle: 'Tuile 1',
					uniqueId: 'tile-1',
				},
				attachTo: container,
			})

			const wrapper2 = mount(AmeliproClickableTile, {
				props: {
					icon: 'document',
					tileTitle: 'Tuile 2',
					uniqueId: 'tile-2',
				},
				attachTo: container,
			})

			const results = await axe(container as HTMLElement)
			assertNoA11yViolations(results, 'AmeliproClickableTile – multiple instances')

			wrapper1.unmount()
			wrapper2.unmount()
			document.body.removeChild(container)
		})
	})

	describe('color contrast', () => {
		it('has no obvious axe violations with default colors', async () => {
			const wrapper = mount(AmeliproClickableTile, {
				props: {
					icon: 'utilisateur',
					tileTitle: 'Contraste de couleur par défaut',
				},
				attachTo: document.body,
			})

			const results = await axe(wrapper.element as HTMLElement)
			assertNoA11yViolations(results, 'AmeliproClickableTile – color contrast default')

			wrapper.unmount()
		})
	})

	describe('keyboard navigation', () => {
		it('has no obvious axe violations for keyboard navigation', async () => {
			const wrapper = mount(AmeliproClickableTile, {
				props: {
					icon: 'utilisateur',
					tileTitle: 'Navigation au clavier',
					uniqueId: 'keyboard-test',
				},
				attachTo: document.body,
			})

			const results = await axe(wrapper.element as HTMLElement)
			assertNoA11yViolations(results, 'AmeliproClickableTile – keyboard navigation')

			wrapper.unmount()
		})
	})
})
