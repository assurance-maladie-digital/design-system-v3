import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import SyServerTable from '../SyServerTable.vue'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
import DialogBox from '@/components/DialogBox/DialogBox.vue'

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

	describe('édition séquentielle', () => {
		const editableHeaders = [
			{ title: 'Nom', key: 'lastname', editable: true },
			{ title: 'Prénom', key: 'firstname', editable: true },
		]

		async function mountEditable(props: Record<string, unknown> = {}) {
			const items = makeItems()
			const wrapper = mount(SyServerTable, {
				props: {
					options: {},
					suffix: 'server-bulk-edit-test',
					serverItemsLength: items.length,
					showSelect: true,
					selectionKey: 'id',
					showEditSelected: true,
					modelValue: [1, 2, 3],
					...props,
				},
				attrs: { items, headers: editableHeaders },
			})
			await wrapper.vm.$nextTick()
			await flushPromises()
			return wrapper
		}

		it('ouvre la boîte de dialogue avec un champ par colonne éditable', async () => {
			const wrapper = await mountEditable()
			const editBtn = wrapper.find(BAR).findAll('button').find(b => b.text().includes('Modifier'))
			await editBtn!.trigger('click')

			expect(wrapper.findComponent(DialogBox).props('modelValue')).toBe(true)
			expect(wrapper.findAllComponents(SyTextField).length).toBe(2)
		})

		it('modifier la 1re ligne n\'affecte QUE cette ligne et vide la sélection', async () => {
			const wrapper = await mountEditable()
			const editBtn = wrapper.find(BAR).findAll('button').find(b => b.text().includes('Modifier'))
			await editBtn!.trigger('click')

			await wrapper.findAllComponents(SyTextField)[0].vm.$emit('update:modelValue', 'Nouveau')
			await wrapper.findComponent(DialogBox).vm.$emit('confirm')

			const saved = wrapper.emitted('save-multiple')?.[0]?.[0] as Record<string, unknown>[]
			expect(saved).toHaveLength(1)
			expect(saved[0]).toMatchObject({ id: 1, lastname: 'Nouveau' })
			expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual([])
		})

		it('navigue vers la 2e ligne et n\'édite que celle-ci', async () => {
			const wrapper = await mountEditable({ modelValue: [1, 2] })
			const editBtn = wrapper.find(BAR).findAll('button').find(b => b.text().includes('Modifier'))
			await editBtn!.trigger('click')

			const nextBtn = wrapper.findAllComponents({ name: 'VBtn' })
				.find(b => b.attributes('aria-label') === 'Ligne suivante')
			await nextBtn!.trigger('click')

			const fields = wrapper.findAllComponents(SyTextField)
			expect(fields[0].props('modelValue')).toBe('Salois')

			await fields[1].vm.$emit('update:modelValue', 'Steve')
			await wrapper.findComponent(DialogBox).vm.$emit('confirm')

			const saved = wrapper.emitted('save-multiple')?.[0]?.[0] as Record<string, unknown>[]
			expect(saved).toHaveLength(1)
			expect(saved[0]).toMatchObject({ id: 2, firstname: 'Steve' })
		})
	})
})
