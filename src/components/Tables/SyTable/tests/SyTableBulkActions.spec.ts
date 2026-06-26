import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import SyTable from '../SyTable.vue'
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

	it('les checkboxes de sélection de ligne ont un libellé accessible (même cochées)', () => {
		const wrapper = mountTable({ modelValue: [1, 2, 3] })

		const rowChecks = [...wrapper.element.querySelectorAll('td .v-selection-control input[type="checkbox"]')]
		expect(rowChecks).toHaveLength(3)
		rowChecks.forEach((checkbox) => {
			expect(checkbox.getAttribute('aria-label')).toBeTruthy()
		})
	})

	describe('édition groupée', () => {
		const editableHeaders = [
			{ title: 'Nom', key: 'lastname', editable: true },
			{ title: 'Prénom', key: 'firstname', editable: true },
		]

		function mountEditable(props: Record<string, unknown> = {}) {
			return mount(SyTable, {
				props: {
					options: {},
					suffix: 'bulk-edit-test',
					showSelect: true,
					selectionKey: 'id',
					showEditSelected: true,
					modelValue: [1, 2],
					...props,
				},
				attrs: { items: makeItems(), headers: editableHeaders },
			})
		}

		it('affiche le bouton « Modifier la sélection »', () => {
			const wrapper = mountEditable()
			const editBtn = wrapper.find(BAR).findAll('button').find(b => b.text().includes('Modifier'))
			expect(editBtn).toBeTruthy()
		})

		it('ouvre la boîte de dialogue avec un champ par colonne éditable', async () => {
			const wrapper = mountEditable()
			const editBtn = wrapper.find(BAR).findAll('button').find(b => b.text().includes('Modifier'))
			await editBtn!.trigger('click')

			expect(wrapper.findComponent(DialogBox).props('modelValue')).toBe(true)
			expect(wrapper.findAllComponents(SyTextField).length).toBe(2)
		})

		it('chaque champ d\'édition a un libellé accessible', async () => {
			const wrapper = mountEditable()
			const editBtn = wrapper.find(BAR).findAll('button').find(b => b.text().includes('Modifier'))
			await editBtn!.trigger('click')
			await wrapper.vm.$nextTick()

			const textInputs = [...document.body.querySelectorAll('input[type="text"]')]
			expect(textInputs).toHaveLength(2)

			textInputs.forEach((input) => {
				const labelledby = input.getAttribute('aria-labelledby')
				const name = input.getAttribute('aria-label')
					|| (labelledby ? document.getElementById(labelledby)?.textContent?.trim() : '')
				expect(name).toBeTruthy()
			})
		})

		it('pré-remplit le formulaire avec les valeurs de la ligne (sélection unique)', async () => {
			const wrapper = mountEditable({ modelValue: [1] })
			const editBtn = wrapper.find(BAR).findAll('button').find(b => b.text().includes('Modifier'))
			await editBtn!.trigger('click')

			const fields = wrapper.findAllComponents(SyTextField)
			expect(fields[0].props('modelValue')).toBe('Beauchesne') // lastname
			expect(fields[1].props('modelValue')).toBe('Virginie') // firstname
		})

		it('pré-remplit avec la première ligne en sélection multiple', async () => {
			const wrapper = mountEditable({ modelValue: [1, 2] })
			const editBtn = wrapper.find(BAR).findAll('button').find(b => b.text().includes('Modifier'))
			await editBtn!.trigger('click')

			const fields = wrapper.findAllComponents(SyTextField)
			expect(fields[0].props('modelValue')).toBe('Beauchesne') // 1re ligne (id 1)
			expect(fields[1].props('modelValue')).toBe('Virginie')
		})

		it('affiche la navigation entre lignes en sélection multiple', async () => {
			const wrapper = mountEditable({ modelValue: [1, 2, 3] })
			const editBtn = wrapper.find(BAR).findAll('button').find(b => b.text().includes('Modifier'))
			await editBtn!.trigger('click')

			// Boutons de navigation présents (contenu téléporté par VDialog)
			const nextBtn = wrapper.findAllComponents({ name: 'VBtn' })
				.find(b => b.attributes('aria-label') === 'Ligne suivante')
			expect(nextBtn).toBeTruthy()
			expect(document.body.textContent).toContain('Ligne 1 sur 3')
		})

		it('modifier la 1re ligne n\'affecte QUE cette ligne (bug corrigé) et vide la sélection', async () => {
			const wrapper = mountEditable({ modelValue: [1, 2, 3] })
			const editBtn = wrapper.find(BAR).findAll('button').find(b => b.text().includes('Modifier'))
			await editBtn!.trigger('click')

			// Modifie le champ "lastname" de la ligne courante (id 1)
			await wrapper.findAllComponents(SyTextField)[0].vm.$emit('update:modelValue', 'Nouveau')
			await wrapper.findComponent(DialogBox).vm.$emit('confirm')

			const saved = wrapper.emitted('save-multiple')?.[0]?.[0] as Record<string, unknown>[]
			expect(saved).toHaveLength(1) // seule la ligne 1 est modifiée (id 2 et 3 intacts)
			expect(saved[0]).toMatchObject({ id: 1, lastname: 'Nouveau' })
			expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual([])
		})

		it('navigue vers la 2e ligne et n\'édite que celle-ci', async () => {
			const wrapper = mountEditable({ modelValue: [1, 2] })
			const editBtn = wrapper.find(BAR).findAll('button').find(b => b.text().includes('Modifier'))
			await editBtn!.trigger('click')

			// Va à la ligne suivante (id 2)
			const nextBtn = wrapper.findAllComponents({ name: 'VBtn' })
				.find(b => b.attributes('aria-label') === 'Ligne suivante')
			await nextBtn!.trigger('click')

			// Les champs reflètent la 2e ligne (Salois / Étienne)
			const fields = wrapper.findAllComponents(SyTextField)
			expect(fields[0].props('modelValue')).toBe('Salois')

			await fields[1].vm.$emit('update:modelValue', 'Steve')
			await wrapper.findComponent(DialogBox).vm.$emit('confirm')

			const saved = wrapper.emitted('save-multiple')?.[0]?.[0] as Record<string, unknown>[]
			expect(saved).toHaveLength(1)
			expect(saved[0]).toMatchObject({ id: 2, firstname: 'Steve' })
		})

		it('applique les libellés personnalisés (décompte, titre, position)', async () => {
			const wrapper = mountEditable({
				modelValue: [1, 2],
				bulkSelectedLabel: (count: number) => `${count} patients`,
				bulkEditTitle: (count: number) => `Éditer ${count} patients`,
				bulkEditPositionLabel: (current: number, total: number) => `Patient ${current}/${total}`,
			})

			// Décompte personnalisé dans la barre (non téléportée)
			expect(wrapper.find(BAR).text()).toContain('2 patients')

			const editBtn = wrapper.find(BAR).findAll('button').find(b => b.text().includes('Modifier'))
			await editBtn!.trigger('click')

			// Titre + position personnalisés (contenu téléporté par VDialog)
			expect(document.body.textContent).toContain('Éditer 2 patients')
			expect(document.body.textContent).toContain('Patient 1/2')
		})
	})
})
