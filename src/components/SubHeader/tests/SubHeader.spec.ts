import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { vuetify } from '@tests/unit/setup'

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
			global: {
				plugins: [vuetify],
			},
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
			global: {
				plugins: [vuetify],
			},
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
			global: {
				plugins: [vuetify],
			},
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
			global: {
				plugins: [vuetify],
			},
			props: {
				hideBackBtn: false,
				titleText: 'Test',
				dataListGroupItems,
			},
		})

		const btn = wrapper.find('.vd-data-list-item-action-btn')
		await btn.trigger('click')

		await wrapper.vm.$nextTick()

		expect(wrapper.emitted('click:list-item')).toBeTruthy()
	})

	it('emits back event when called in slot', async () => {
		const wrapper = mount(SubHeader, {
			global: {
				plugins: [vuetify],
			},
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
})
