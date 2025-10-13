import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, ref, computed } from 'vue'
import { vuetify } from '../../../../tests/unit/setup'
import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'

/**
 * Setup centralisé pour tous les tests DatePicker
 * Fournit des helpers réutilisables et une configuration commune
 */

// Types communs
export type WrapperType = ReturnType<typeof mount>
export type CustomRule = {
	type: string
	options: Record<string, unknown>
}

// Configuration de base commune
export const baseConfig = {
	global: {
		plugins: [vuetify],
	},
}

// Props par défaut pour différents modes
export const defaultProps = {
	calendar: {
		modelValue: null,
		label: 'Date Test',
	},
	combined: {
		useCombinedMode: true,
		modelValue: null,
		label: 'Date Combined Test',
	},
	textInput: {
		noCalendar: true,
		modelValue: null,
		label: 'Date Text Test',
	},
}

/**
 * Helper pour monter un composant DatePicker avec configuration de base
 */
export function mountDatePicker(props: Record<string, unknown> = {}, config: Record<string, unknown> = {}) {
	return mount(DatePicker, {
		...baseConfig,
		...config,
		props: {
			...defaultProps.calendar,
			...props,
		},
	})
}

/**
 * Helper pour monter un DatePicker en mode calendrier
 */
export function mountCalendarMode(props: Record<string, unknown> = {}) {
	return mountDatePicker({
		...defaultProps.calendar,
		...props,
	})
}

/**
 * Helper pour monter un DatePicker en mode combiné
 */
export function mountCombinedMode(props: Record<string, unknown> = {}) {
	return mountDatePicker({
		...defaultProps.combined,
		...props,
	})
}

/**
 * Helper pour monter un DatePicker en mode saisie texte
 */
export function mountTextInputMode(props: Record<string, unknown> = {}) {
	return mountDatePicker({
		...defaultProps.textInput,
		...props,
	})
}

/**
 * Helper pour créer une règle personnalisée de test
 */
export function createTestRule(validate: () => boolean, message: string = 'Test error'): CustomRule {
	return {
		type: 'custom',
		options: {
			validate,
			message,
		},
	}
}

/**
 * Helper pour créer une règle de warning de test
 */
export function createTestWarningRule(validate: () => boolean, message: string = 'Test warning'): CustomRule {
	return {
		type: 'custom',
		options: {
			validate,
			message,
		},
	}
}

/**
 * Helper pour créer des règles réactives basées sur une date de référence
 */
export function createReactiveRules(referenceDate: { value: string }) {
	return computed(() => [
		{
			type: 'notBeforeDate',
			options: {
				date: referenceDate.value,
				message: `Date ne peut pas être avant le ${referenceDate.value}`,
			},
		},
	])
}

/**
 * Helper pour attendre que le composant soit monté et stable
 */
export async function expectComponentMounted(wrapper: WrapperType) {
	await nextTick()
	expect(wrapper.exists()).toBe(true)
	expect(wrapper.find('input').exists()).toBe(true)
}

/**
 * Helper pour simuler une saisie utilisateur
 */
export async function simulateUserInput(wrapper: WrapperType, value: string) {
	const input = wrapper.find('input')
	await input.setValue(value)
	await input.trigger('blur')
	await nextTick()
}

/**
 * Helper pour déclencher la validation
 */
export async function triggerValidation(wrapper: WrapperType) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	await (wrapper.vm as any).validateOnSubmit()
	await nextTick()
}

/**
 * Helper pour vérifier qu'un événement a été émis
 */
export function expectEventEmitted(wrapper: WrapperType, eventName: string) {
	expect(wrapper.emitted(eventName)).toBeTruthy()
}

/**
 * Helper pour vérifier les messages d'erreur
 */
export function expectErrorMessages(wrapper: WrapperType, expectedCount: number = 1) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	expect((wrapper.vm as any).errorMessages.length).toBeGreaterThanOrEqual(expectedCount)
}

/**
 * Helper pour vérifier les messages de warning
 */
export function expectWarningMessages(wrapper: WrapperType, expectedCount: number = 1) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	expect((wrapper.vm as any).warningMessages.length).toBe(expectedCount)
}

/**
 * Helper pour vérifier les messages de succès
 */
export function expectSuccessMessages(wrapper: WrapperType, expectedCount: number = 1) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	expect((wrapper.vm as any).successMessages.length).toBe(expectedCount)
}

/**
 * Helper pour nettoyer après chaque test
 */
export function setupTestCleanup() {
	let wrapper: WrapperType | null = null

	beforeEach(() => {
		wrapper = null
	})

	afterEach(() => {
		if (wrapper) {
			wrapper.unmount()
			wrapper = null
		}
	})

	return {
		getWrapper: () => wrapper,
		setWrapper: (w: WrapperType) => { wrapper = w },
	}
}

/**
 * Constantes pour les tests
 */
export const TEST_DATES = {
	VALID: '15/06/2024',
	INVALID: '32/13/2024',
	ANCIENT: '01/01/1900',
	FUTURE: '31/12/2100',
	LEAP_YEAR: '29/02/2024',
	NON_LEAP_YEAR: '29/02/2023',
}

export const TEST_FORMATS = {
	DD_MM_YYYY: 'DD/MM/YYYY',
	YYYY_MM_DD: 'YYYY/MM/DD',
	MM_DD_YYYY: 'MM/DD/YYYY',
	DD_MM_YY: 'DD/MM/YY',
}

// Réexporter les utilitaires de test courants
export {
	describe,
	it,
	expect,
	beforeEach,
	afterEach,
	vi,
	nextTick,
	ref,
	computed,
	mount,
	DatePicker,
}
