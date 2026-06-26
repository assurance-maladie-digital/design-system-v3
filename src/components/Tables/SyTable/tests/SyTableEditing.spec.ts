import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import SyTable from '../SyTable.vue'
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

// Slot d'actions qui expose les helpers d'édition via des boutons cliquables
interface ActionSlotProps {
	isEditing: boolean
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

function mountTable(props: Record<string, unknown> = {}, items = makeItems()) {
	return mount(SyTable, {
		props: {
			options: {},
			suffix: 'editing-test',
			editable: true,
			selectionKey: 'id',
			...props,
		},
		attrs: { items, headers },
		slots: { 'item.actions': actionsSlot },
	})
}

describe('SyTable — édition inline', () => {
	beforeAll(() => {
		// Mock visualViewport pour les composants Vuetify (VMenu)
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

	it('editable=false : aucune cellule d\'édition n\'est rendue', () => {
		const wrapper = mountTable({ editable: false })
		expect(wrapper.findComponent(SyTextField).exists()).toBe(false)
		expect(wrapper.text()).toContain('Beauchesne')
	})

	it('passe une ligne en édition et rend un SyTextField par colonne éditable', async () => {
		const wrapper = mountTable()
		expect(wrapper.findComponent(SyTextField).exists()).toBe(false)

		await wrapper.find('.edit-btn').trigger('click')

		// Les 2 colonnes `editable` de la 1re ligne deviennent des champs ;
		// la colonne `email` (non éditable) reste en texte.
		const fields = wrapper.findAllComponents(SyTextField)
		expect(fields.length).toBe(2)
		expect(wrapper.text()).toContain('etienne@example.com') // ligne 2 inchangée
	})

	it('émet @edit avec l\'item ciblé', async () => {
		const wrapper = mountTable()
		await wrapper.find('.edit-btn').trigger('click')

		expect(wrapper.emitted('edit')?.[0]?.[0]).toMatchObject({ id: 1, lastname: 'Beauchesne' })
	})

	it('émet @save(updated, original) sans muter la prop items', async () => {
		const items = makeItems()
		const wrapper = mountTable({}, items)

		await wrapper.find('.edit-btn').trigger('click')
		// Modifie le premier champ éditable (lastname) via son SyTextField
		await wrapper.findComponent(SyTextField).vm.$emit('update:modelValue', 'Nouveau')
		await wrapper.find('.save-btn').trigger('click')

		const saved = wrapper.emitted('save')?.[0]
		expect(saved).toBeTruthy()
		expect(saved?.[0]).toMatchObject({ id: 1, lastname: 'Nouveau' }) // updated
		expect(saved?.[1]).toMatchObject({ id: 1, lastname: 'Beauchesne' }) // original

		// La prop items n'est jamais mutée par le composant
		expect(items[0].lastname).toBe('Beauchesne')
	})

	it('quitte le mode édition après save', async () => {
		const wrapper = mountTable()
		await wrapper.find('.edit-btn').trigger('click')
		expect(wrapper.findAllComponents(SyTextField).length).toBe(2)

		await wrapper.find('.save-btn').trigger('click')
		expect(wrapper.findComponent(SyTextField).exists()).toBe(false)
	})

	it('émet @cancel et quitte le mode édition sans modifier l\'item', async () => {
		const items = makeItems()
		const wrapper = mountTable({}, items)

		await wrapper.find('.edit-btn').trigger('click')
		await wrapper.findComponent(SyTextField).vm.$emit('update:modelValue', 'Ignoré')
		await wrapper.find('.cancel-btn').trigger('click')

		expect(wrapper.emitted('cancel')).toBeTruthy()
		expect(wrapper.findComponent(SyTextField).exists()).toBe(false)
		expect(items[0].lastname).toBe('Beauchesne')
	})

	it('émet @delete avec l\'item ciblé', async () => {
		const wrapper = mountTable()
		await wrapper.find('.remove-btn').trigger('click')

		expect(wrapper.emitted('delete')?.[0]?.[0]).toMatchObject({ id: 1 })
	})
})
