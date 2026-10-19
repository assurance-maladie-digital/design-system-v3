import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SubHeader from '../SubHeader.vue'
import type { DataList } from '@/components/DataList/types'
import type { DataListGroupItems } from '@/components/DataListGroup/types'

const dataListItems: DataList = [
	{
		key: 'Libellé',
		value: 'Texte saisi',
	},
	{
		key: 'Libellé',
		value: 'Texte saisi',
	},
]

const dataListItemsActions: DataList = [
	{
		key: 'Libellé',
		value: 'Texte à modifier',
		action: 'Modifier',
	},
	{
		key: 'Libellé',
		value: 'Texte à modifier',
		action: 'Modifier',
	},
]

const dataListGroupItems: DataListGroupItems = [
	{
		title: 'Catégorie 1',
		items: dataListItems,
		itemsNumberLoading: 2,
		headingLoading: true,
	},
	{
		title: 'Catégorie 2',
		items: dataListItemsActions,
		itemsNumberLoading: 2,
		headingLoading: true,
	},
]

describe('SubHeader', () => {
	it('renders correctly', () => {
		const wrapper = mount(SubHeader, {
			props: {
				hideBackBtn: false,
				backBtnText: 'Retour',
				loading: false,
				renderHtmlValue: false,
				dataListGroupItems,
			},
		})

		const elExists = wrapper.find('.vd-sub-header').exists()
		expect(elExists).toBe(true)
	})

	it('renders loading state correctly', async () => {
		const wrapper = mount(SubHeader, {
			props: {
				hideBackBtn: false,
				titleText: 'Test',
				loading: true,
				dataListGroupItems,
			},
		})

		const elExists = wrapper.find('.vd-subheader-loading').exists()
		expect(elExists).toBe(true)
	})

	it('get subTitleText is defined', async () => {
		const wrapper = mount(SubHeader, {
			props: {
				hideBackBtn: false,
				titleText: 'Test',
				subTitleText: 'SubTitle',
				dataListGroupItems,
			},
		})

		const subTitleText = wrapper.vm.subTitleText
		expect(subTitleText).toBe('SubTitle')
	})

	it('emits itemAction event when called', async () => {
		const wrapper = mount(SubHeader, {
			props: {
				hideBackBtn: false,
				titleText: 'Test',
				dataListGroupItems,
			},
		})

		const btn = wrapper.find('.sy-data-list-item-action-btn')
		await btn.trigger('click')

		await wrapper.vm.$nextTick()

		expect(wrapper.emitted('click:list-item')).toBeTruthy()
	})

	it('emits back event when called in slot', async () => {
		const wrapper = mount(SubHeader, {
			props: {
				hideBackBtn: false,
				titleText: 'Test',
				dataListGroupItems,
			},
			slots: {
				backBtn: '<div class="vd-back-btn">Back</div>',
			},
		})

		const btn = wrapper.find('.vd-sub-header-back-btn')
		await btn.trigger('click')

		await wrapper.vm.$nextTick()

		expect(wrapper.emitted('back')).toBeTruthy()
	})

	// Le back button a un ring on-primary scopé (fond primary). jsdom ne calcule pas
	// :focus-visible : on vérifie le prérequis — c'est un <button> natif focusable.
	it('renders the back button as a native <button> (focus ring target)', () => {
		const wrapper = mount(SubHeader, {
			props: { titleText: 'Titre' },
		})

		expect(wrapper.find('.vd-sub-header-back-btn').element.tagName).toBe('BUTTON')
	})

	// RGAA 7.5 : le chargement et sa fin doivent être annoncés par un message de statut.
	describe('loading status message', () => {
		// Une zone live insérée avec son contenu n'est pas restituée : elle doit être vide au rendu initial.
		it('renders the status region empty before announcing an initial loading', async () => {
			const wrapper = mount(SubHeader, {
				props: { titleText: 'Titre', loading: true },
			})

			expect(wrapper.get('[role="status"]').text()).toBe('')

			await nextTick()

			expect(wrapper.get('[role="status"]').text()).toBe('Chargement en cours…')
		})

		it('marks the content as busy and announces the loading', async () => {
			const wrapper = mount(SubHeader, {
				props: { titleText: 'Titre', loading: true, dataListGroupItems },
			})
			await nextTick()

			const status = wrapper.get('[role="status"]')
			expect(wrapper.find('[aria-busy="true"]').exists()).toBe(true)
			expect(status.text()).toBe('Chargement en cours…')
			// Un message de statut dans une zone aria-busy n'est pas restitué
			expect(status.element.closest('[aria-busy="true"]')).toBeNull()
		})

		it('does not expose competing alerts while loading', () => {
			const wrapper = mount(SubHeader, {
				props: { titleText: 'Titre', loading: true, dataListGroupItems },
			})

			const exposedAlerts = wrapper.findAll('[role="alert"]')
				.filter(alert => !alert.element.closest('[aria-hidden="true"]'))
			expect(exposedAlerts).toHaveLength(0)
		})

		it('keeps the status message empty when the content is not loading', () => {
			const wrapper = mount(SubHeader, {
				props: { titleText: 'Titre' },
			})

			expect(wrapper.find('[aria-busy]').exists()).toBe(false)
			expect(wrapper.get('[role="status"]').text()).toBe('')
		})

		it('announces the end of the loading', async () => {
			const wrapper = mount(SubHeader, {
				props: { titleText: 'Titre', loading: true },
			})

			await wrapper.setProps({ loading: false })

			expect(wrapper.find('[aria-busy]').exists()).toBe(false)
			expect(wrapper.get('[role="status"]').text()).toBe('Chargement terminé')
		})
	})

	// RGAA 9.1 : sans configuration, les titres des listes suivent le titre principal.
	describe('heading hierarchy', () => {
		it('places the data list titles right below the main title by default', () => {
			const wrapper = mount(SubHeader, {
				props: { titleText: 'Titre', dataListGroupItems },
			})

			expect(wrapper.find('h1').text()).toBe('Titre')
			expect(wrapper.findAll('h2').map(h => h.text())).toEqual(['Catégorie 1', 'Catégorie 2'])
		})

		it('follows a custom headingLevel', () => {
			const wrapper = mount(SubHeader, {
				props: { titleText: 'Titre', headingLevel: 2, dataListGroupItems },
			})

			expect(wrapper.find('h2').text()).toBe('Titre')
			expect(wrapper.findAll('h3')).toHaveLength(2)
		})

		it('caps the data list titles at level 6', () => {
			const wrapper = mount(SubHeader, {
				props: { titleText: 'Titre', headingLevel: 6, dataListGroupItems },
			})

			expect(wrapper.findAll('h6')).toHaveLength(3)
		})

		it('keeps an explicit dataListTitleLevel', () => {
			const wrapper = mount(SubHeader, {
				props: { titleText: 'Titre', headingLevel: 2, dataListTitleLevel: 4, dataListGroupItems },
			})

			expect(wrapper.findAll('h4')).toHaveLength(2)
		})
	})

	// RGAA 9.2 : l'en-tête est exposé comme une région nommée par son titre.
	describe('landmark', () => {
		it('exposes a region named by the title', () => {
			const wrapper = mount(SubHeader, {
				props: { titleText: 'Paul Dupont' },
			})

			expect(wrapper.attributes('role')).toBe('region')
			expect(wrapper.attributes('aria-label')).toBe('Paul Dupont')
		})

		it('keeps the region named while the title is loading', () => {
			const wrapper = mount(SubHeader, {
				props: { titleText: 'Paul Dupont', titleAccessibleName: 'Dossier de Paul Dupont', loading: true },
			})

			expect(wrapper.attributes('role')).toBe('region')
			expect(wrapper.attributes('aria-label')).toBe('Dossier de Paul Dupont')
		})

		it('does not expose an unnamed region without title', () => {
			const wrapper = mount(SubHeader)

			expect(wrapper.attributes('role')).toBeUndefined()
			expect(wrapper.attributes('aria-label')).toBeUndefined()
		})
	})

	// RGAA 10.5 : la couleur du texte suit la couleur de fond personnalisable.
	it('does not hard-code the subtitle color', () => {
		const wrapper = mount(SubHeader, {
			props: { titleText: 'Titre', subTitleText: 'Sous-titre', vuetifyOptions: { sheet: { color: 'secondary' } } },
		})

		const subtitle = wrapper.get('.vd-sub-header-subtitle')
		expect(subtitle.attributes('style')).toBeUndefined()
	})
})
