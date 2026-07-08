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

// Barre d'actions groupées : le contenu (boutons) est fourni par le projet
// consommateur via le slot `#bulk-actions`, qui reçoit la sélection.
const bulkActionsSlot = (params: { selected: unknown[], count: number, clearSelection: () => void }) =>
	h('button', { class: 'project-action', onClick: () => params.clearSelection() }, `Action ${params.count}`)

function mountTable(
	props: Record<string, unknown> = {},
	slots: Record<string, unknown> = { 'bulk-actions': bulkActionsSlot },
) {
	return mount(SyTable, {
		props: {
			options: {},
			suffix: 'bulk-test',
			showSelect: true,
			selectionKey: 'id',
			...props,
		},
		attrs: { items: makeItems(), headers },
		slots,
	})
}

const BAR = '.sy-table-bulk-actions'

describe('SyTable — barre de sélection multiple (actions pilotées par le projet)', () => {
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

	it('n\'affiche pas la barre si aucun slot #bulk-actions n\'est fourni', () => {
		const wrapper = mountTable({ modelValue: [1, 2] }, {})
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

	it('expose { selected, count, clearSelection } au slot #bulk-actions', () => {
		const wrapper = mountTable({ modelValue: [1, 3] })
		const action = wrapper.find('.project-action')
		expect(action.exists()).toBe(true)
		expect(action.text()).toBe('Action 2')
	})

	it('le helper clearSelection exposé au slot vide la sélection', async () => {
		const wrapper = mountTable({ modelValue: [1, 3] })
		await wrapper.find('.project-action').trigger('click')
		expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual([])
	})

	it('le bouton de désélection intégré vide la sélection', async () => {
		const wrapper = mountTable({ modelValue: [1, 2] })
		const clearBtn = wrapper.find(BAR).findAll('button').at(-1)
		await clearBtn!.trigger('click')
		expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual([])
	})

	it('les checkboxes de sélection de ligne ont un libellé accessible (même cochées)', () => {
		const wrapper = mountTable({ modelValue: [1, 2, 3] })

		const rowChecks = [...wrapper.element.querySelectorAll('td .v-selection-control input[type="checkbox"]')]
		expect(rowChecks).toHaveLength(3)
		rowChecks.forEach((checkbox) => {
			expect(checkbox.getAttribute('aria-label')).toBeTruthy()
		})
	})
})
