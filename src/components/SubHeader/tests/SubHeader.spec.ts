import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
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
})
