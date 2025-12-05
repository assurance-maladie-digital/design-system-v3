/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterAll, beforeAll, describe, vi } from 'vitest'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import type { IStructureMenuValue } from '../types'
import type { PropType } from 'vue'
import StructureMenu from '../StructureMenu.vue'
import type { StructureTab } from '../StructureTabs/types'
import TestHelper from '@tests/helpers/TestHelper'

// StructureMenu global MutationObserver pour éviter la boucle infinie dans les tests unitaires
class NoopMutationObserver {
	observe = vi.fn()
	disconnect = vi.fn()
	takeRecords = vi.fn(() => [])
}

global.MutationObserver = NoopMutationObserver as any

const expectedPropOptions: ExpectedPropOptions<typeof StructureMenu> = {
	maxStructuresLoadedDefault: {
		type: Number,
		default: 5,
	},
	modelValue: {
		type: Object as PropType<IStructureMenuValue>,
		default: () => ({ dialog: false }),
	},
	structuresTabs: {
		type: Array as PropType<StructureTab[]>,
		default: () => [],
	},
	switchValue: {
		type: String,
		default: 'Structure par défaut',
	},
	uniqueId: {
		type: String,
		required: true,
	},
	userAdeli: {
		type: String,
		required: true,
	},
	userName: {
		type: String,
		required: true,
	},
	userProfession: {
		type: String,
		required: true,
	},
	userRpps: {
		type: String,
		required: true,
	},
}

const structuresTabs = (): StructureTab[] => ([
	{
		label: 'item1',
		listLabel: 'label1',
		structures: [
			{
				address: '39 rue de la Vie',
				idNumber: '1',
				value: 'valeur',
			},
			{
				address: '39 rue de la Vie',
				idNumber: '2',
				value: 'valeur2',
			},
		],
	},
	{
		label: 'item2',
		listLabel: 'label2',
		structures: [
			{
				address: '39 rue de la Vie',
				idNumber: '3',
				value: 'valeur3',
			},
			{
				address: '39 rue de la Vie',
				idNumber: '4',
				value: 'valeur4',
			},
		],
	},
])

// Values pour les props "required"
const requiredPropValues = (): ComponentProps<typeof StructureMenu> => ({
	uniqueId: 'required-unique-id',
	userAdeli: 'required-user-adeli',
	userName: 'required-user-name',
	userProfession: 'required-user-profession',
	userRpps: 'required-user-rpps',
})

// Valeurs pour les props "modified"
const modifiedPropValues = (): ComponentProps<typeof StructureMenu> => ({
	maxStructuresLoadedDefault: 3,
	modelValue: {
		activeTab: 1,
		activeValues: [undefined, 'valeur4'],
		dialog: true,
	} as IStructureMenuValue,
	structuresTabs: structuresTabs(),
	uniqueId: 'modified-unique-id',
	userAdeli: 'adeli',
	userName: 'name',
	userProfession: 'profession',
	userRpps: 'rpps',
})

const testHelper = new TestHelper(StructureMenu)
testHelper.setExpectedPropOptions(expectedPropOptions)
	.setRequiredPropValues(requiredPropValues)
	.setModifiedPropValues(modifiedPropValues)

// Ajout d'un hook global pour les tests pour éviter les warnings "Unable to locate target #..."
// Cela crée dynamiquement un élément cible pour chaque uniqueId utilisé dans les tests.
beforeAll(() => {
	const ids = [
		'required-unique-id-service-menu',
		'modified-unique-id-service-menu',
	]
	ids.forEach((id) => {
		if (!document.getElementById(id)) {
			const el = document.createElement('div')
			el.id = id
			document.body.appendChild(el)
		}
	})
})

afterAll(() => {
	const ids = [
		'required-unique-id-service-menu',
		'modified-unique-id-service-menu',
	]
	ids.forEach((id) => {
		const el = document.getElementById(id)
		if (el) {
			el.remove()
		}
	})
})

describe('StructureMenu', () => {
	describe('Snapshots', () => {
		testHelper.snapshots()
	})

	describe('Properties', () => {
		testHelper.properties()
	})

	// describe.todo('Events')

	// describe.todo('Slots')
})
