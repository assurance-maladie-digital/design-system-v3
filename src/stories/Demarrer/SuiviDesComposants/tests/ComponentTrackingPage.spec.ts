import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ComponentTrackingPage from '../ComponentTrackingPage.vue'
import { locales } from '../locales'

vi.mock('../../component-info.json', () => ({
	default: {
		date: '2026-09-03T00:00:00.000Z',
		totalCount: 2,
		results: [
			{
				componentName: 'Accordion',
				storybookTitle: 'Composants/Données/Accordion',
				status: 'actif',
				functionalVersion: '1.1.4',
				functionalDate: '07/08/2026',
				a11yVersion: '1.1.3',
				a11yDate: '22/07/2026',
				commits: [
					{ date: '2026-08-07', message: 'ajout de la prop density', version: '1.1.4' },
					{ date: '2026-07-22', message: 'correction du focus', version: '1.1.3' },
					{ date: '2026-07-06', message: 'mode compact', version: '1.1.2' },
					{ date: '2025-11-03', message: 'création du composant', version: '0.0.15-alpha' },
				],
				a11yCommits: [
					{ date: '2026-07-22', message: 'restitution du focus', version: '1.1.3' },
					{ date: '2026-03-25', message: 'libellé du bouton', version: '1.0.23' },
				],
			},
			{
				// Version de badge issue d'un override manuel : aucun commit ne la porte.
				componentName: 'DataListItem',
				storybookTitle: 'Composants/Données/DataListItem',
				status: 'actif',
				functionalVersion: '1.1.4',
				functionalDate: '07/08/2026',
				a11yVersion: '1.0.23',
				a11yDate: '30/03/2026',
				commits: [
					{ date: '2026-07-06', message: 'refonte des espacements', version: '1.1.2' },
				],
				a11yCommits: [],
			},
		],
	},
}))

/** Sélectionne une version dans l'un des deux filtres, comme le ferait l'utilisateur. */
async function selectVersion(
	wrapper: ReturnType<typeof mount>,
	ariaLabel: string,
	version: string,
): Promise<void> {
	const select = wrapper.findAll('select').find(s => s.attributes('aria-label') === ariaLabel)
	if (!select) throw new Error(`Filtre introuvable : ${ariaLabel}`)
	await select.setValue(version)
}

/** Bascule la première carte sur l'onglet demandé, comme le ferait l'utilisateur. */
async function openTab(wrapper: ReturnType<typeof mount>, label: string): Promise<void> {
	const button = wrapper.findAll('button').find(b => b.text() === label)
	if (!button) throw new Error(`Onglet introuvable : ${label}`)
	await button.trigger('click')
}

describe('ComponentTrackingPage — filtrage des changements par version', () => {
	it('n\'affiche que les commits de la version fonctionnelle sélectionnée', async () => {
		const wrapper = mount(ComponentTrackingPage)

		await selectVersion(wrapper, locales.filters.functionalLabel, '1.1.4')

		const text = wrapper.text()
		expect(text).toContain('ajout de la prop density')
		expect(text).not.toContain('correction du focus')
		expect(text).not.toContain('mode compact')

		wrapper.unmount()
	})

	it('n\'affiche que les commits de la version accessibilité sélectionnée', async () => {
		const wrapper = mount(ComponentTrackingPage)

		await selectVersion(wrapper, locales.filters.a11yLabel, '1.1.3')

		const text = wrapper.text()
		expect(text).toContain('restitution du focus')
		expect(text).not.toContain('libellé du bouton')

		wrapper.unmount()
	})

	it('affiche tout l\'historique quand « Toutes les versions » est sélectionné', async () => {
		const wrapper = mount(ComponentTrackingPage)

		await selectVersion(wrapper, locales.filters.functionalLabel, '__ALL__')

		const text = wrapper.text()
		expect(text).toContain('ajout de la prop density')
		expect(text).toContain('correction du focus')
		expect(text).toContain('mode compact')

		wrapper.unmount()
	})

	it('propose les versions absentes des badges, mais présentes dans l\'historique', async () => {
		const wrapper = mount(ComponentTrackingPage)

		const select = wrapper.findAll('select')
			.find(s => s.attributes('aria-label') === locales.filters.functionalLabel)
		const offered = select?.findAll('option').map(o => o.attributes('value'))

		// 1.1.2 n'est la version de dernière modification d'aucun composant : elle était
		// pourtant proposée à tort comme absente avant le correctif.
		expect(offered).toContain('1.1.2')
		expect(offered).toContain('1.1.4')

		wrapper.unmount()
	})

	it('ne propose pas les pré-versions dans le filtre', async () => {
		const wrapper = mount(ComponentTrackingPage)

		const select = wrapper.findAll('select')
			.find(s => s.attributes('aria-label') === locales.filters.functionalLabel)
		const offered = select?.findAll('option').map(o => o.attributes('value'))

		expect(offered).not.toContain('0.0.15-alpha')
		expect(offered).toContain('1.1.2')

		wrapper.unmount()
	})

	it('retient les composants qui ont changé dans la version, pas seulement ceux dont c\'est la dernière version', async () => {
		const wrapper = mount(ComponentTrackingPage)

		await selectVersion(wrapper, locales.filters.functionalLabel, '1.1.2')

		const text = wrapper.text()
		// Accordion (dernière version 1.1.4) et DataListItem ont tous deux changé en 1.1.2.
		expect(text).toContain('mode compact')
		expect(text).toContain('refonte des espacements')
		expect(text).not.toContain('ajout de la prop density')

		wrapper.unmount()
	})
	it('applique la version fonctionnelle sélectionnée à l\'onglet accessibilité', async () => {
		const wrapper = mount(ComponentTrackingPage)

		await selectVersion(wrapper, locales.filters.functionalLabel, '1.1.3')
		await openTab(wrapper, locales.tabs.a11y)

		const text = wrapper.text()
		expect(text).toContain('restitution du focus')
		expect(text).not.toContain('libellé du bouton')

		wrapper.unmount()
	})

	it('signale une version sans changement sur l\'onglet concerné', async () => {
		const wrapper = mount(ComponentTrackingPage)

		// 1.1.4 contient un changement fonctionnel pour Accordion, aucun changement a11y.
		await selectVersion(wrapper, locales.filters.functionalLabel, '1.1.4')
		await openTab(wrapper, locales.tabs.a11y)

		expect(wrapper.text()).toContain(locales.commits.emptyForVersion('1.1.4'))
		expect(wrapper.text()).not.toContain('restitution du focus')

		wrapper.unmount()
	})

	it('respecte « Toutes les versions » choisi explicitement sur l\'autre axe', async () => {
		const wrapper = mount(ComponentTrackingPage)

		await selectVersion(wrapper, locales.filters.functionalLabel, '1.1.3')
		await selectVersion(wrapper, locales.filters.a11yLabel, '__ALL__')
		await openTab(wrapper, locales.tabs.a11y)

		const text = wrapper.text()
		expect(text).toContain('restitution du focus')
		expect(text).toContain('libellé du bouton')

		wrapper.unmount()
	})
})
