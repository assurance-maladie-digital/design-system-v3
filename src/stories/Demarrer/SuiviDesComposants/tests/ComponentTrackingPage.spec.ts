import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ComponentTrackingPage from '../ComponentTrackingPage.vue'
import SyAutocomplete from '@/components/Customs/Selects/SyAutocomplete/SyAutocomplete.vue'
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
			{
				componentName: 'PaginatedTable',
				storybookTitle: 'Composants/Données/PaginatedTable',
				status: 'déprécié',
				functionalVersion: '1.1.2',
				functionalDate: '06/07/2026',
				a11yVersion: '1.1.2',
				a11yDate: '06/07/2026',
				commits: [
					{ date: '2026-07-06', message: 'dépréciation du composant', version: '1.1.2' },
				],
				a11yCommits: [],
			},
		],
	},
}))

/** Sélectionne une version dans le filtre, comme le ferait l'utilisateur. */
async function selectVersion(wrapper: ReturnType<typeof mount>, version: string): Promise<void> {
	const select = wrapper.findAll('select')
		.find(s => s.attributes('aria-label') === locales.filters.versionLabel)
	if (!select) throw new Error('Filtre de version introuvable')
	await select.setValue(version)
}

/** Options proposées par le filtre de version. */
function versionOptions(wrapper: ReturnType<typeof mount>): (string | undefined)[] {
	const select = wrapper.findAll('select')
		.find(s => s.attributes('aria-label') === locales.filters.versionLabel)
	return select?.findAll('option').map(o => o.attributes('value')) ?? []
}

/** Simule un changement de sélection émis par l'autocomplétion des composants. */
async function selectComponents(
	wrapper: ReturnType<typeof mount>,
	selection: string[] | null,
): Promise<void> {
	await wrapper.findComponent(SyAutocomplete).vm.$emit('update:modelValue', selection)
	await wrapper.vm.$nextTick()
}

/** Sélection courante transmise à l'autocomplétion. */
function currentSelection(wrapper: ReturnType<typeof mount>): string[] {
	return wrapper.findComponent(SyAutocomplete).props('modelValue') as string[]
}

/** Active ou désactive le commutateur « Inclure les composants dépréciés ». */
async function toggleDeprecated(wrapper: ReturnType<typeof mount>, included: boolean): Promise<void> {
	await wrapper.find('#include-deprecated').setValue(included)
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

		await selectVersion(wrapper, '1.1.4')

		const text = wrapper.text()
		expect(text).toContain('ajout de la prop density')
		expect(text).not.toContain('correction du focus')
		expect(text).not.toContain('mode compact')

		wrapper.unmount()
	})

	it('n\'affiche que les commits accessibilité de la version sélectionnée', async () => {
		const wrapper = mount(ComponentTrackingPage)

		await selectVersion(wrapper, '1.1.3')
		await openTab(wrapper, locales.tabs.a11y)

		const text = wrapper.text()
		expect(text).toContain('restitution du focus')
		expect(text).not.toContain('libellé du bouton')

		wrapper.unmount()
	})

	it('affiche tout l\'historique quand « Toutes les versions » est sélectionné', async () => {
		const wrapper = mount(ComponentTrackingPage)

		await selectVersion(wrapper, '__ALL__')

		const text = wrapper.text()
		expect(text).toContain('ajout de la prop density')
		expect(text).toContain('correction du focus')
		expect(text).toContain('mode compact')

		wrapper.unmount()
	})

	it('propose les versions absentes des badges, mais présentes dans l\'historique', async () => {
		const wrapper = mount(ComponentTrackingPage)

		const offered = versionOptions(wrapper)

		// 1.1.2 n'est la version de dernière modification d'aucun composant : elle était
		// pourtant proposée à tort comme absente avant le correctif.
		expect(offered).toContain('1.1.2')
		expect(offered).toContain('1.1.4')

		wrapper.unmount()
	})

	it('ne propose pas les pré-versions dans le filtre', async () => {
		const wrapper = mount(ComponentTrackingPage)

		const offered = versionOptions(wrapper)

		expect(offered).not.toContain('0.0.15-alpha')
		expect(offered).toContain('1.1.2')

		wrapper.unmount()
	})

	it('retient les composants qui ont changé dans la version, pas seulement ceux dont c\'est la dernière version', async () => {
		const wrapper = mount(ComponentTrackingPage)

		await selectVersion(wrapper, '1.1.2')

		const text = wrapper.text()
		// Accordion (dernière version 1.1.4) et DataListItem ont tous deux changé en 1.1.2.
		expect(text).toContain('mode compact')
		expect(text).toContain('refonte des espacements')
		expect(text).not.toContain('ajout de la prop density')

		wrapper.unmount()
	})
	it('signale une version sans changement sur l\'onglet concerné', async () => {
		const wrapper = mount(ComponentTrackingPage)

		// 1.1.4 contient un changement fonctionnel pour Accordion, aucun changement a11y.
		await selectVersion(wrapper, '1.1.4')
		await openTab(wrapper, locales.tabs.a11y)

		expect(wrapper.text()).toContain(locales.commits.emptyForVersion('1.1.4'))
		expect(wrapper.text()).not.toContain('restitution du focus')

		wrapper.unmount()
	})

	it('retient un composant dont seul l\'axe accessibilité a changé dans la version', async () => {
		const wrapper = mount(ComponentTrackingPage)

		// 1.0.23 n'apparaît que dans l'historique a11y d'Accordion.
		expect(versionOptions(wrapper)).toContain('1.0.23')

		await selectVersion(wrapper, '1.0.23')
		await openTab(wrapper, locales.tabs.a11y)

		const text = wrapper.text()
		expect(text).toContain('libellé du bouton')
		expect(text).not.toContain('restitution du focus')

		wrapper.unmount()
	})
	it('exclut les composants dépréciés tant que le commutateur est éteint', async () => {
		const wrapper = mount(ComponentTrackingPage)

		await selectVersion(wrapper, '1.1.2')

		const text = wrapper.text()
		expect(text).toContain('mode compact')
		expect(text).not.toContain('dépréciation du composant')

		wrapper.unmount()
	})

	it('affiche les composants dépréciés quand le commutateur est allumé', async () => {
		const wrapper = mount(ComponentTrackingPage)

		await selectVersion(wrapper, '1.1.2')
		await toggleDeprecated(wrapper, true)

		expect(wrapper.text()).toContain('dépréciation du composant')

		wrapper.unmount()
	})

	it('exclut aussi les dépréciés avec « Toutes les versions »', async () => {
		const wrapper = mount(ComponentTrackingPage)

		await selectVersion(wrapper, '__ALL__')

		expect(wrapper.text()).toContain('mode compact')
		expect(wrapper.text()).not.toContain('dépréciation du composant')

		await toggleDeprecated(wrapper, true)

		expect(wrapper.text()).toContain('dépréciation du composant')

		wrapper.unmount()
	})
	it('annonce la dernière mise à jour de l\'axe affiché, devant le tag de version', async () => {
		const wrapper = mount(ComponentTrackingPage)

		await selectVersion(wrapper, '1.1.4')

		const line = wrapper.find('.ci-version-line')
		expect(line.text()).toContain(locales.lastUpdate.functional)
		expect(line.text()).toContain('v1.1.4')
		// Le libellé précède le tag, comme sur les pages de composant.
		expect(line.text().indexOf(locales.lastUpdate.functional)).toBeLessThan(line.text().indexOf('v1.1.4'))

		await openTab(wrapper, locales.tabs.a11y)

		const a11yLine = wrapper.find('.ci-version-line')
		expect(a11yLine.text()).toContain(locales.lastUpdate.a11y)
		expect(a11yLine.text()).toContain('v1.1.3')

		wrapper.unmount()
	})
	it('garde l\'option « tout » cochée après un clic dessus', async () => {
		const wrapper = mount(ComponentTrackingPage)

		await selectComponents(wrapper, ['__ALL__'])

		const selection = currentSelection(wrapper)
		// Sans la sentinelle dans le modèle, la case ne pouvait pas s'afficher cochée.
		expect(selection).toContain('__ALL__')
		expect(selection).toContain('Accordion')
		expect(selection).toContain('DataListItem')

		wrapper.unmount()
	})

	it('vide la sélection quand l\'option « tout » est décochée', async () => {
		const wrapper = mount(ComponentTrackingPage)

		await selectComponents(wrapper, ['__ALL__'])
		await selectComponents(wrapper, currentSelection(wrapper).filter(v => v !== '__ALL__'))

		expect(currentSelection(wrapper)).toEqual([])

		wrapper.unmount()
	})

	it('décoche l\'option « tout » dès qu\'un composant est retiré', async () => {
		const wrapper = mount(ComponentTrackingPage)

		await selectComponents(wrapper, ['__ALL__'])
		await selectComponents(wrapper, currentSelection(wrapper).filter(v => v !== 'Accordion'))

		const selection = currentSelection(wrapper)
		expect(selection).not.toContain('__ALL__')
		expect(selection).not.toContain('Accordion')
		expect(selection).toContain('DataListItem')

		wrapper.unmount()
	})

	it('recoche l\'option « tout » quand tous les composants sont sélectionnés un à un', async () => {
		const wrapper = mount(ComponentTrackingPage)

		// Les dépréciés étant exclus, seuls Accordion et DataListItem sont disponibles.
		await selectComponents(wrapper, ['Accordion'])
		expect(currentSelection(wrapper)).not.toContain('__ALL__')

		await selectComponents(wrapper, ['Accordion', 'DataListItem'])
		expect(currentSelection(wrapper)).toContain('__ALL__')

		wrapper.unmount()
	})

	it('traite une sélection nulle comme une sélection vide', async () => {
		const wrapper = mount(ComponentTrackingPage)

		await selectComponents(wrapper, ['Accordion'])
		await selectComponents(wrapper, null)

		expect(currentSelection(wrapper)).toEqual([])

		wrapper.unmount()
	})
})
