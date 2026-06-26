import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import SyServerTable from '../SyServerTable.vue'

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

async function mountTable(props: Record<string, unknown> = {}) {
	const items = makeItems()
	const wrapper = mount(SyServerTable, {
		props: {
			options: {},
			suffix: 'server-bulk-test',
			serverItemsLength: items.length,
			showSelect: true,
			selectionKey: 'id',
			showDeleteSelected: true,
			...props,
		},
		attrs: { items, headers },
	})
	await wrapper.vm.$nextTick()
	await flushPromises()
	return wrapper
}

const BAR = '.sy-table-bulk-actions'

describe('SyServerTable — actions groupées (suppression en masse)', () => {
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

	it('affiche la barre avec le bon décompte', async () => {
		const wrapper = await mountTable({ modelValue: [1, 2] })
		expect(wrapper.find(BAR).exists()).toBe(true)
		expect(wrapper.find(BAR).text()).toContain('2 éléments sélectionnés')
	})

	it('n\'affiche pas la barre sans sélection', async () => {
		const wrapper = await mountTable({ modelValue: [] })
		expect(wrapper.find(BAR).exists()).toBe(false)
	})

	it('émet @delete-multiple avec les items et vide la sélection', async () => {
		const wrapper = await mountTable({ modelValue: [1, 3] })

		const deleteBtn = wrapper.find(BAR).findAll('button').find(b => b.text().includes('Supprimer'))
		await deleteBtn!.trigger('click')

		const payload = wrapper.emitted('delete-multiple')?.[0]?.[0] as Record<string, unknown>[]
		expect(payload.map(i => i.id)).toEqual([1, 3])
		expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual([])
	})
})
