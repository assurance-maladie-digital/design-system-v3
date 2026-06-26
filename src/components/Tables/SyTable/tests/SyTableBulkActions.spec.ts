import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import SyTable from '../SyTable.vue'

vi.mock('@/utils/localStorageUtility')

const headers = [
	{ title: 'Nom', key: 'lastname' },
	{ title: 'Prénom', key: 'firstname' },
]

function makeItems() {
	return [
		{ id: 1, firstname: 'Virginie', lastname: 'Beauchesne' },
		{ id: 2, firstname: 'Étienne', lastname: 'Salois' },
		{ id: 3, firstname: 'Camille', lastname: 'Tremblay' },
	]
}

function mountTable(props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) {
	return mount(SyTable, {
		props: {
			options: {},
			suffix: 'bulk-test',
			showSelect: true,
			selectionKey: 'id',
			showDeleteSelected: true,
			...props,
		},
		attrs: { items: makeItems(), headers },
		slots,
	})
}

const BAR = '.sy-table-bulk-actions'

describe('SyTable — actions groupées (suppression en masse)', () => {
	beforeAll(() => {
		global.visualViewport = {
			width: 1024,
			height: 768,
			scale: 1,
			offsetLeft: 0,
			offsetTop: 0,
			pageLeft: 0,
			pageTop: 0,
			onresize: null,
			onscroll: null,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		} as unknown as typeof globalThis.visualViewport
	})

	afterEach(() => {
		vi.resetAllMocks()
		document.body.innerHTML = ''
	})

	it('n\'affiche pas la barre sans sélection', () => {
		const wrapper = mountTable({ modelValue: [] })
		expect(wrapper.find(BAR).exists()).toBe(false)
	})

	it('n\'affiche pas la barre si showDeleteSelected=false et aucun slot', () => {
		const wrapper = mountTable({ modelValue: [1, 2], showDeleteSelected: false })
		expect(wrapper.find(BAR).exists()).toBe(false)
	})

	it('affiche la barre avec le bon décompte quand des lignes sont sélectionnées', () => {
		const wrapper = mountTable({ modelValue: [1, 2] })
		expect(wrapper.find(BAR).exists()).toBe(true)
		expect(wrapper.find(BAR).text()).toContain('2 éléments sélectionnés')
	})

	it('accorde le singulier pour une seule sélection', () => {
		const wrapper = mountTable({ modelValue: [1] })
		expect(wrapper.find(BAR).text()).toContain('1 élément sélectionné')
	})

	it('émet @delete-multiple avec les items et vide la sélection', async () => {
		const wrapper = mountTable({ modelValue: [1, 3] })

		const deleteBtn = wrapper.find(BAR).findAll('button').find(b => b.text().includes('Supprimer'))
		await deleteBtn!.trigger('click')

		const payload = wrapper.emitted('delete-multiple')?.[0]?.[0] as Record<string, unknown>[]
		expect(payload).toHaveLength(2)
		expect(payload.map(i => i.id)).toEqual([1, 3])

		// La sélection est vidée (v-model émis à [])
		const lastModel = wrapper.emitted('update:modelValue')?.at(-1)?.[0]
		expect(lastModel).toEqual([])
	})

	it('le bouton de désélection vide la sélection', async () => {
		const wrapper = mountTable({ modelValue: [1, 2] })

		const clearBtn = wrapper.find(BAR).findAll('button').at(-1)
		await clearBtn!.trigger('click')

		expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual([])
	})

	it('slot #bulk-actions : surcharge le contenu et expose les helpers', async () => {
		const wrapper = mountTable(
			{ modelValue: [2], showDeleteSelected: false },
			{
				'bulk-actions': (params: { count: number, deleteSelected: () => void }) =>
					h('button', { class: 'custom-bulk', onClick: () => params.deleteSelected() }, `Custom ${params.count}`),
			},
		)

		// La barre s'affiche grâce au slot (même sans showDeleteSelected)
		expect(wrapper.find(BAR).exists()).toBe(true)
		const custom = wrapper.find('.custom-bulk')
		expect(custom.exists()).toBe(true)
		expect(custom.text()).toBe('Custom 1')

		await custom.trigger('click')
		expect(wrapper.emitted('delete-multiple')?.[0]?.[0]).toHaveLength(1)
	})
})
