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
				dataListGroupItems: dataListGroupItems,
				loading: false,
				renderHtmlValue: false,
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

	it('returns true when the header is not fixed', () => {
		const wrapper = mount(SubHeader, {
			global: {
				plugins: [vuetify],
			},
			props: {
				hideBackBtn: false,
				titleText: 'Test',
			},
		})

		expect(wrapper.vm.fadeWhite).toBe('rgba(255, 255, 255, .7)')
	})

	it('emits itemAction event when called', () => {
		const wrapper = mount(SubHeader, {
			global: {
				plugins: [vuetify],
			},
			props: {
				hideBackBtn: false,
				titleText: 'Test',
			},
		})

		wrapper.vm.emitItemAction({
			dataListIndex: 0,
			itemIndex: 0,
		})

		expect(wrapper.emitted('click:list-item')).toBeTruthy()
	})
})
