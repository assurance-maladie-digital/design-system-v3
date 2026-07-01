import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'
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

	it('valeur non primitive sans slot #edit : n\'affiche pas d\'éditeur par défaut (+ avertit)', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
		const objHeaders = [
			{ title: 'Nom', key: 'lastname', editable: true },
			{ title: 'Rôle', key: 'role', editable: true },
			{ title: 'Actions', key: 'actions', sortable: false },
		]
		const objItems = [{ id: 1, lastname: 'Beauchesne', role: { code: 'admin' } }]
		const wrapper = mount(SyTable, {
			props: { options: {}, suffix: 'editing-obj', editable: true, selectionKey: 'id' },
			attrs: { items: objItems, headers: objHeaders },
			slots: { 'item.actions': actionsSlot },
		})

		await wrapper.find('.edit-btn').trigger('click')

		// lastname (chaîne) → 1 éditeur ; role (objet, sans slot #edit) → aucun
		expect(wrapper.findAllComponents(SyTextField)).toHaveLength(1)
		// un avertissement guide le dev vers #edit.role
		expect(warn).toHaveBeenCalledWith(expect.stringContaining('#edit.role'))
		warn.mockRestore()
	})
})

// Composant hôte réaliste : il rend un SyTable éditable et **persiste** lui-même
// les changements sur `items` via `@save` (le tableau ne mute jamais `items`).
const Host = defineComponent({
	components: { SyTable },
	setup() {
		const items = ref([
			{ id: 1, firstname: 'Virginie', lastname: 'Beauchesne' },
			{ id: 2, firstname: 'Étienne', lastname: 'Salois' },
		])
		const hostHeaders = [
			{ title: 'Nom', key: 'lastname', editable: true },
			{ title: 'Prénom', key: 'firstname', editable: true },
			{ title: 'Actions', key: 'actions', sortable: false },
		]
		function onSave(updated: Record<string, unknown>) {
			const i = items.value.findIndex(x => x.id === updated.id)
			if (i !== -1) {
				items.value[i] = { ...items.value[i], ...updated } as typeof items.value[number]
			}
		}
		return { items, hostHeaders, onSave }
	},
	template: `
		<SyTable suffix="edit-integration" editable selection-key="id" hide-default-footer :headers="hostHeaders" :items="items" @save="onSave">
			<template #item.actions="{ isEditing, edit, save, cancel }">
				<button v-if="!isEditing" class="edit-btn" type="button" @click="edit">Éditer</button>
				<template v-else>
					<button class="save-btn" type="button" @click="save">Valider</button>
					<button class="cancel-btn" type="button" @click="cancel">Annuler</button>
				</template>
			</template>
		</SyTable>
	`,
})

describe('SyTable — édition inline (intégration bout-en-bout, rendu HTML)', () => {
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

	it('affiche les valeurs initiales dans le tableau', () => {
		const wrapper = mount(Host)
		const body = wrapper.find('tbody').text()
		expect(body).toContain('Beauchesne')
		expect(body).toContain('Virginie')
	})

	it('édite une ligne de bout en bout : la nouvelle valeur remplace l\'ancienne dans le HTML', async () => {
		const wrapper = mount(Host)

		// 1) Entre en édition sur la 1re ligne (clic réel sur le bouton du slot)
		await wrapper.findAll('.edit-btn')[0].trigger('click')

		// 2) L'éditeur de la colonne "Nom" est un vrai <input> du DOM, pré-rempli
		const input = wrapper.find('tbody tr input')
		expect((input.element as HTMLInputElement).value).toBe('Beauchesne')

		// 3) Saisie via le DOM (pas via $emit) puis validation
		await input.setValue('Dupont')
		await wrapper.find('.save-btn').trigger('click')
		await flushPromises()

		// 4) Contrôle depuis le HTML rendu : nouvelle valeur affichée, ancienne partie
		const body = wrapper.find('tbody').text()
		expect(body).toContain('Dupont')
		expect(body).not.toContain('Beauchesne')
		// La ligne est repassée en lecture (le bouton Éditer est de retour)
		expect(wrapper.findAll('.edit-btn')).toHaveLength(2)
	})

	it('annuler l\'édition laisse le HTML inchangé', async () => {
		const wrapper = mount(Host)

		await wrapper.findAll('.edit-btn')[0].trigger('click')
		const input = wrapper.find('tbody tr input')
		await input.setValue('Zzz')
		await wrapper.find('.cancel-btn').trigger('click')
		await flushPromises()

		const body = wrapper.find('tbody').text()
		expect(body).toContain('Beauchesne')
		expect(body).not.toContain('Zzz')
	})

	it('n\'édite qu\'une seule ligne à la fois (les autres restent en lecture)', async () => {
		const wrapper = mount(Host)

		await wrapper.findAll('.edit-btn')[0].trigger('click')

		const rowsWithInput = wrapper.findAll('tbody tr').filter(r => r.find('input').exists())
		expect(rowsWithInput).toHaveLength(1)
		expect(wrapper.find('tbody').text()).toContain('Salois')
	})
})
