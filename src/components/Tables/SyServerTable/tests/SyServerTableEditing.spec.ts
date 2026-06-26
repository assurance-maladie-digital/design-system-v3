import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { h } from 'vue'
import SyServerTable from '../SyServerTable.vue'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'

vi.mock('@/utils/localStorageUtility')

const headers = [
	{ title: 'Nom', key: 'lastname', editable: true },
	{ title: 'Prénom', key: 'firstname', editable: true },
	{ title: 'Email', key: 'email' }, // non éditable
	{ title: 'Actions', key: 'actions', sortable: false },
]

function makeItems() {
	return [
		{ id: 1, firstname: 'Virginie', lastname: 'Beauchesne', email: 'virginie@example.com' },
		{ id: 2, firstname: 'Étienne', lastname: 'Salois', email: 'etienne@example.com' },
	]
}

interface ActionSlotProps {
	edit: () => void
	save: () => void
	cancel: () => void
	remove: () => void
}
const actionsSlot = (params: ActionSlotProps) =>
	h('div', [
		h('button', { class: 'edit-btn', onClick: () => params.edit() }),
		h('button', { class: 'save-btn', onClick: () => params.save() }),
		h('button', { class: 'cancel-btn', onClick: () => params.cancel() }),
		h('button', { class: 'remove-btn', onClick: () => params.remove() }),
	])

async function mountTable(props: Record<string, unknown> = {}, items = makeItems()) {
	const wrapper = mount(SyServerTable, {
		props: {
			options: {},
			suffix: 'server-editing-test',
			serverItemsLength: items.length,
			editable: true,
			selectionKey: 'id',
			...props,
		},
		attrs: { items, headers },
		slots: { 'item.actions': actionsSlot },
	})
	await wrapper.vm.$nextTick()
	await flushPromises()
	return wrapper
}

describe('SyServerTable — édition inline', () => {
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

	it('editable=false : aucune cellule d\'édition n\'est rendue', async () => {
		const wrapper = await mountTable({ editable: false })
		expect(wrapper.findComponent(SyTextField).exists()).toBe(false)
		expect(wrapper.text()).toContain('Beauchesne')
	})

	it('passe une ligne en édition et rend un SyTextField par colonne éditable', async () => {
		const wrapper = await mountTable()
		expect(wrapper.findComponent(SyTextField).exists()).toBe(false)

		await wrapper.find('.edit-btn').trigger('click')

		expect(wrapper.findAllComponents(SyTextField).length).toBe(2)
		expect(wrapper.text()).toContain('etienne@example.com')
	})

	it('émet @edit avec l\'item ciblé', async () => {
		const wrapper = await mountTable()
		await wrapper.find('.edit-btn').trigger('click')

		expect(wrapper.emitted('edit')?.[0]?.[0]).toMatchObject({ id: 1, lastname: 'Beauchesne' })
	})

	it('émet @save(updated, original) sans muter la prop items', async () => {
		const items = makeItems()
		const wrapper = await mountTable({}, items)

		await wrapper.find('.edit-btn').trigger('click')
		await wrapper.findComponent(SyTextField).vm.$emit('update:modelValue', 'Nouveau')
		await wrapper.find('.save-btn').trigger('click')

		const saved = wrapper.emitted('save')?.[0]
		expect(saved?.[0]).toMatchObject({ id: 1, lastname: 'Nouveau' })
		expect(saved?.[1]).toMatchObject({ id: 1, lastname: 'Beauchesne' })
		expect(items[0].lastname).toBe('Beauchesne')
	})

	it('émet @cancel et quitte le mode édition', async () => {
		const wrapper = await mountTable()
		await wrapper.find('.edit-btn').trigger('click')
		await wrapper.find('.cancel-btn').trigger('click')

		expect(wrapper.emitted('cancel')).toBeTruthy()
		expect(wrapper.findComponent(SyTextField).exists()).toBe(false)
	})

	it('émet @delete avec l\'item ciblé', async () => {
		const wrapper = await mountTable()
		await wrapper.find('.remove-btn').trigger('click')

		expect(wrapper.emitted('delete')?.[0]?.[0]).toMatchObject({ id: 1 })
	})
})
