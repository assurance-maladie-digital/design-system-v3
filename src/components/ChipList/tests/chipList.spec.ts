import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import ChipList from '../ChipList.vue'
import type { ChipItem, ChipState } from '../types'

const vuetify = createVuetify({
	components,
	directives,
})

describe('ChipList', () => {
	const defaultItems: ChipItem[] = [
		{
			text: 'Email',
			value: 'email',
			state: 'success' as ChipState,
		},
		{
			text: 'SMS',
			value: 'sms',
			state: 'info' as ChipState,
		},
	]

	// Test du rendu de base
	it('rend correctement les items', () => {
		const wrapper = mount(ChipList, {
			props: {
				items: defaultItems,
			},
			global: {
				plugins: [vuetify],
			},
		})

		// Vérifie que tous les items sont rendus
		const chips = wrapper.findAll('.v-chip')
		expect(chips).toHaveLength(defaultItems.length)

		// Vérifie le contenu des chips
		defaultItems.forEach((item, index) => {
			expect(chips[index].text()).toContain(item.text)
		})
	})

	// Test des états visuels
	it('applique les bonnes classes selon l\'état', () => {
		const items: ChipItem[] = [
			{
				text: 'Email',
				value: 'email',
				state: 'success' as ChipState,
			},
			{
				text: 'SMS',
				value: 'sms',
				state: 'info' as ChipState,
			},
			{
				text: 'Téléphone',
				value: 'telephone',
				state: 'warning' as ChipState,
			},
			{
				text: 'Courrier',
				value: 'mail',
				state: 'error' as ChipState,
			},
			{
				text: 'Autre',
				value: 'other',
				state: '' as ChipState,
			},
		]

		const wrapper = mount(ChipList, {
			props: {
				items,
				overflowLimit: 6, // Augmenté pour voir tous les chips
			},
			global: {
				plugins: [vuetify],
			},
		})

		// Vérifie les classes d'état
		const chips = wrapper.findAll('.v-chip')
		expect(chips[0].classes()).toContain('sy-chip-success')
		expect(chips[1].classes()).toContain('sy-chip-info')
		expect(chips[2].classes()).toContain('sy-chip-warning')
		expect(chips[3].classes()).toContain('sy-chip-error')

		// Vérifie les couleurs de fond via les classes
		expect(chips[0].classes()).toContain('bg-backgroundSuccessSubdued')
		expect(chips[1].classes()).toContain('bg-backgroundInfoSubdued')
		expect(chips[2].classes()).toContain('bg-backgroundWarningSubdued')
		expect(chips[3].classes()).toContain('bg-backgroundErrorSubdued')
		expect(chips[4].classes()).toContain('bg-primary') // État par défaut
	})

	it('applique les bonnes classes selon l\'état', () => {
		const wrapper = mount(ChipList, {
			props: {
				items: defaultItems,
			},
			global: {
				plugins: [vuetify],
			},
		})

		const successChip = wrapper.find('.sy-chip-success')
		const infoChip = wrapper.find('.sy-chip-info')

		expect(successChip.exists()).toBe(true)
		expect(infoChip.exists()).toBe(true)
	})

	// Test du mode readonly
	it('cache les boutons de suppression en mode readonly', () => {
		const wrapper = mount(ChipList, {
			props: {
				items: defaultItems,
				readonly: true,
			},
			global: {
				plugins: [vuetify],
			},
		})

		const removeButtons = wrapper.findAll('.remove-chip')
		expect(removeButtons).toHaveLength(0)

		const resetButton = wrapper.find('[data-test-id="reset-btn"]')
		expect(resetButton.exists()).toBe(false)
	})

	// Test de l'overflow
	it('gère correctement le débordement', () => {
		const manyItems: ChipItem[] = [
			...defaultItems,
			{
				text: 'Téléphone',
				value: 'telephone',
				state: 'warning' as ChipState,
			},
			{
				text: 'Courrier',
				value: 'mail',
				state: 'error' as ChipState,
			},
		]

		const wrapper = mount(ChipList, {
			props: {
				items: manyItems,
				overflowLimit: 3,
			},
			global: {
				plugins: [vuetify],
			},
		})

		// Vérifie que le nombre de chips visibles est correct
		const visibleChips = wrapper.findAll('.v-chip').filter(chip =>
			!chip.classes().includes('overflow-chip'),
		)
		expect(visibleChips).toHaveLength(2) // overflowLimit - 1

		// Vérifie la présence du chip de débordement
		const overflowChip = wrapper.find('.overflow-chip')
		expect(overflowChip.exists()).toBe(true)
		expect(overflowChip.text()).toContain('+2') // nombre d'items restants
	})

	// Test des événements
	it('émet les événements remove et reset', async () => {
		const wrapper = mount(ChipList, {
			props: {
				items: defaultItems,
			},
			global: {
				plugins: [vuetify],
			},
		})

		// Test de l'événement remove
		const removeButton = wrapper.find('.remove-chip')
		await removeButton.trigger('click')
		expect(wrapper.emitted('remove')).toBeTruthy()
		expect(wrapper.emitted('remove')?.[0]).toEqual([defaultItems[0]])

		// Test de l'événement reset
		const resetButton = wrapper.find('[data-test-id="reset-btn"]')
		await resetButton.trigger('click')
		expect(wrapper.emitted('reset')).toBeTruthy()
	})

	// Test du texte personnalisé du bouton reset
	it('affiche le texte personnalisé du bouton reset', () => {
		const customResetText = 'Tout effacer'
		const wrapper = mount(ChipList, {
			props: {
				items: defaultItems,
				resetText: customResetText,
			},
			global: {
				plugins: [vuetify],
			},
		})

		const resetButton = wrapper.find('[data-test-id="reset-btn"]')
		expect(resetButton.text()).toBe(customResetText)
	})

	// Test de l'accessibilité
	it('inclut les attributs d\'accessibilité appropriés', () => {
		const wrapper = mount(ChipList, {
			props: {
				items: defaultItems,
			},
			global: {
				plugins: [vuetify],
			},
		})

		// Vérifie la présence de la structure HTML native
		expect(wrapper.find('ul').exists()).toBe(true)
		expect(wrapper.findAll('li')).toHaveLength(defaultItems.length)

		// Vérifie l'aria-label sur la liste
		const list = wrapper.find('ul')
		expect(list.attributes('aria-label')).toBeTruthy()

		// Vérifie les labels ARIA des boutons
		const removeButton = wrapper.find('.remove-chip')
		expect(removeButton.attributes('aria-label')).toBeTruthy()
	})

	// Test du rendu conditionnel
	it('ne rend rien quand la liste est vide', () => {
		const wrapper = mount(ChipList, {
			props: {
				items: [],
			},
			global: {
				plugins: [vuetify],
			},
		})

		expect(wrapper.find('.vd-chip-list').exists()).toBe(false)
	})

	// Test des différentes combinaisons de showOverflowChip et readonly
	it.each([
		{ readonly: true, hasOverflow: true, expectedRemoveButtons: 0, showsOverflowChip: true },
		{ readonly: true, hasOverflow: false, expectedRemoveButtons: 0, showsOverflowChip: false },
		{ readonly: false, hasOverflow: true, expectedRemoveButtons: 2, showsOverflowChip: true },
		{ readonly: false, hasOverflow: false, expectedRemoveButtons: 2, showsOverflowChip: false },
	])('gère correctement la combinaison readonly=$readonly et overflow=$hasOverflow', ({
		readonly,
		hasOverflow,
		expectedRemoveButtons,
		showsOverflowChip,
	}) => {
		const items = hasOverflow
			? [
					{ text: '1', value: '1', state: 'success' as ChipState },
					{ text: '2', value: '2', state: 'info' as ChipState },
					{ text: '3', value: '3', state: 'warning' as ChipState },
					{ text: '4', value: '4', state: 'error' as ChipState },
				]
			: [
					{ text: '1', value: '1', state: 'success' as ChipState },
					{ text: '2', value: '2', state: 'info' as ChipState },
				]

		const wrapper = mount(ChipList, {
			props: {
				items,
				readonly,
				overflowLimit: 3,
			},
			global: {
				plugins: [vuetify],
			},
		})

		// Vérifie la présence des boutons de suppression
		const removeButtons = wrapper.findAll('.remove-chip')
		expect(removeButtons).toHaveLength(expectedRemoveButtons)

		// Vérifie la présence du chip de débordement
		const overflowChip = wrapper.find('.overflow-chip')
		expect(overflowChip.exists()).toBe(showsOverflowChip)

		// Vérifie la présence du bouton reset
		const resetButton = wrapper.find('[data-test-id="reset-btn"]')
		expect(resetButton.exists()).toBe(!readonly)
	})
})
