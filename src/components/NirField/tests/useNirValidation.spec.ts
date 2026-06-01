import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import NirField from '../NirField.vue'
import { locales } from '../locales'
import { useValidation } from '@/composables/unifyValidation/useValidation'

describe('useNirValidation via NirField component', () => {
	let wrapper: ReturnType<typeof mount<typeof NirField & {
		numberValidation: ReturnType<typeof useValidation>
		keyValidation: ReturnType<typeof useValidation>
		validateOnSubmit: () => Promise<boolean>
	}>>
	let activeWrappers: ReturnType<typeof mount>[] = []

	async function flushPromises() {
		return new Promise(resolve => setTimeout(resolve, 0))
	}

	const createWrapper = async (props = {}) => {
		const w = mount(NirField, {
			props: {
				modelValue: undefined,
				...props,
			},
		})
		activeWrappers.push(w)
		await w.vm.$nextTick()
		await flushPromises()
		return w
	}

	beforeEach(() => {
		activeWrappers = []
	})

	afterEach(async () => {
		await flushPromises()
		for (const w of activeWrappers) {
			if (w && typeof w.unmount === 'function') {
				w.unmount()
				await flushPromises()
			}
		}
		activeWrappers = []
	})

	it('ne devrait pas afficher d\'erreurs custom si useVuetifyValidation est vrai', async () => {
		wrapper = await createWrapper({ useVuetifyValidation: true, required: true })

		await wrapper.find('.number-field input').trigger('focus')
		await wrapper.find('.number-field input').trigger('blur')
		await wrapper.vm.$nextTick()
		await flushPromises()

		// Les règles custom ne sont pas appliquées, donc le système de validation custom ne remonte pas d'erreur
		expect(wrapper.vm.numberValidation.errors.value).toEqual([])
	})

	it('devrait afficher une erreur required si le champ est vide et required est vrai', async () => {
		wrapper = await createWrapper({ required: true })

		await wrapper.find('.number-field input').trigger('focus')
		await wrapper.find('.number-field input').trigger('blur')
		await wrapper.vm.$nextTick()
		await flushPromises()

		expect(wrapper.vm.numberValidation.errors.value).toContain(locales.errorRequiredNumber)

		await wrapper.find('.key-field input').trigger('focus')
		await wrapper.find('.key-field input').trigger('blur')
		await wrapper.vm.$nextTick()
		await flushPromises()

		expect(wrapper.vm.keyValidation.errors.value).toContain(locales.errorRequiredKey)
	})

	it('devrait valider correctement le NIR (valide et invalide)', async () => {
		wrapper = await createWrapper()

		const numberInput = wrapper.find('.number-field input')

		// Test invalide (trop court)
		await numberInput.trigger('focus')
		await numberInput.setValue('123456789012')
		await numberInput.trigger('blur')
		await wrapper.vm.$nextTick()
		await flushPromises()
		expect(wrapper.vm.numberValidation.errors.value).toContain(locales.errorInvalidNumber)

		// Test invalide (mauvais NIR - sexe 0 invalide)
		await numberInput.trigger('focus')
		await numberInput.setValue('0000000000000')
		await numberInput.trigger('blur')
		await wrapper.vm.$nextTick()
		await flushPromises()
		expect(wrapper.vm.numberValidation.errors.value).toContain(locales.errorInvalidNumber)

		// Test valide
		await numberInput.trigger('focus')
		await numberInput.setValue('2940375120005')
		await numberInput.trigger('blur')
		await wrapper.vm.$nextTick()
		await flushPromises()
		expect(wrapper.vm.numberValidation.errors.value).toEqual([])
	})

	it('devrait valider correctement la clé', async () => {
		wrapper = await createWrapper()

		const numberInput = wrapper.find('.number-field input')
		const keyInput = wrapper.find('.key-field input')

		// Remplissons d'abord le NIR
		await numberInput.setValue('2940375120005')
		await wrapper.vm.$nextTick()
		await flushPromises()

		// Test clé invalide
		await keyInput.trigger('focus')
		await keyInput.setValue('90')
		await keyInput.trigger('blur')
		await wrapper.vm.$nextTick()
		await flushPromises()
		expect(wrapper.vm.keyValidation.errors.value).toContain(locales.errorInvalidKey)

		// Test clé valide (clé attendue pour 2940375120005 est 91)
		await keyInput.trigger('focus')
		await keyInput.setValue('91')
		await keyInput.trigger('blur')
		await wrapper.vm.$nextTick()
		await flushPromises()
		expect(wrapper.vm.keyValidation.errors.value).toEqual([])
	})

	it('devrait appliquer la précédence des règles customNumberRules si customRulesPrecedence est vrai', async () => {
		const customMessage = 'Erreur custom en premier'
		const customRule1 = {
			type: 'custom',
			options: {
				validate: () => customMessage,
				message: customMessage,
			},
		}

		wrapper = await createWrapper({
			customRulesPrecedence: true,
			customNumberRules: [customRule1],
		})

		const numberInput = wrapper.find('.number-field input')
		await numberInput.trigger('focus')
		await numberInput.setValue('0000000000000') // Valeur invalide selon checkNIR
		await numberInput.trigger('blur')
		await wrapper.vm.$nextTick()
		await flushPromises()

		// Comme la règle custom a la précédence, c'est son erreur qui s'affiche en premier
		// (useValidation s'arrête à la première erreur)
		expect(wrapper.vm.numberValidation.errors.value[0]).toBe(customMessage)
	})

	it('devrait appliquer les règles customNumberRules à la fin si customRulesPrecedence est faux', async () => {
		const customMessage = 'Erreur custom en dernier'
		const customRule1 = {
			type: 'custom',
			options: {
				validate: () => customMessage,
				message: customMessage,
			},
		}

		wrapper = await createWrapper({
			customRulesPrecedence: false,
			customNumberRules: [customRule1],
		})

		const numberInput = wrapper.find('.number-field input')
		await numberInput.trigger('focus')
		await numberInput.setValue('0000000000000') // Valeur invalide selon checkNIR
		await numberInput.trigger('blur')
		await wrapper.vm.$nextTick()
		await flushPromises()

		// L'erreur par défaut checkNIR s'affiche en premier (useValidation s'arrête à la première)
		expect(wrapper.vm.numberValidation.errors.value[0]).toBe(locales.errorInvalidNumber)
	})

	it('devrait utiliser customKeyRules et masquer la règle par défaut si elle a validate', async () => {
		const customMessage = 'Clé custom invalide'
		const customKeyRule = {
			type: 'custom',
			options: {
				validate: () => customMessage,
				message: customMessage,
			},
		}

		wrapper = await createWrapper({
			customKeyRules: [customKeyRule],
		})

		const keyInput = wrapper.find('.key-field input')
		await keyInput.trigger('focus')
		await keyInput.setValue('91')
		await keyInput.trigger('blur')
		await wrapper.vm.$nextTick()
		await flushPromises()

		// Seule la règle custom est appliquée (et elle retourne une erreur)
		expect(wrapper.vm.keyValidation.errors.value[0]).toBe(customMessage)
	})

	it('devrait valider correctement les deux champs lors de l\'appel à validateOnSubmit()', async () => {
		wrapper = await createWrapper()

		// Set valid values
		await wrapper.find('.number-field input').setValue('2940375120005')
		await wrapper.find('.key-field input').setValue('91')
		await wrapper.vm.$nextTick()
		await flushPromises()

		const isValid = await wrapper.vm.validateOnSubmit()
		expect(isValid).toBe(true)

		// Si on a des valeurs invalides
		await wrapper.find('.key-field input').setValue('90')
		await wrapper.vm.$nextTick()
		await flushPromises()

		const isInvalid = await wrapper.vm.validateOnSubmit()
		expect(isInvalid).toBe(false)
	})

	it('devrait valider correctement un NIR avec un département corse (2A / 2B)', async () => {
		wrapper = await createWrapper()

		const numberInput = wrapper.find('.number-field input')
		const keyInput = wrapper.find('.key-field input')

		// Corsica suttana
		// 1 90 01 2A 001 001 (remplace 2A par 19 -> 1900119001001)
		// 1900119001001 % 97 = 41 -> Clé attendue: 97 - 41 = 56
		await numberInput.trigger('focus')
		await numberInput.setValue('190012A001001')
		await numberInput.trigger('blur')

		await keyInput.trigger('focus')
		await keyInput.setValue('56')
		await keyInput.trigger('blur')

		await wrapper.vm.$nextTick()
		await flushPromises()

		expect(wrapper.vm.numberValidation.errors.value).toEqual([])
		expect(wrapper.vm.keyValidation.errors.value).toEqual([])

		// Corsica suprana
		// 1 90 01 2B 001 001 (remplace 2B par 18 -> 1900118001001)
		// 1900118001001 % 97 = 14 -> Clé attendue: 97 - 14 = 83
		await numberInput.trigger('focus')
		await numberInput.setValue('190012B001001')
		await numberInput.trigger('blur')

		await keyInput.trigger('focus')
		await keyInput.setValue('83')
		await keyInput.trigger('blur')

		await wrapper.vm.$nextTick()
		await flushPromises()

		expect(wrapper.vm.numberValidation.errors.value).toEqual([])
		expect(wrapper.vm.keyValidation.errors.value).toEqual([])
	})

	it('devrait appliquer des règles différentes selon le nirType (simple vs complexe)', async () => {
		// Le mois '50' est valide pour 'simple' (accepte de 20 à 99 pour le mois)
		// mais invalide pour 'complexe' (n'accepte que jusqu'à 42 pour les pseudo-mois)
		// Format: S AA MM DDD C C C
		// Homme (1), 90, mois 50, corse 2A, 001, 001
		const invalidComplexNir = '190502A001001'

		// Par défaut, nirType est 'simple' donc le NIR doit être valide
		wrapper = await createWrapper()
		let numberInput = wrapper.find('.number-field input')

		await numberInput.trigger('focus')
		await numberInput.setValue(invalidComplexNir)
		await numberInput.trigger('blur')
		await wrapper.vm.$nextTick()
		await flushPromises()

		expect(wrapper.vm.numberValidation.errors.value).toEqual([])

		// On change le type à 'complexe', le NIR devient invalide
		wrapper = await createWrapper({ nirType: 'complexe' })
		numberInput = wrapper.find('.number-field input')

		await numberInput.trigger('focus')
		await numberInput.setValue(invalidComplexNir)
		await numberInput.trigger('blur')
		await wrapper.vm.$nextTick()
		await flushPromises()

		expect(wrapper.vm.numberValidation.errors.value).toContain(locales.errorInvalidNumber)
	})

	it('ne devrait appliquer les customWarningRules que si la longueur est complète', async () => {
		const numberWarning = 'Attention numéro'
		const keyWarning = 'Attention clé'

		wrapper = await createWrapper({
			customNumberWarningRules: [{ type: 'custom', options: { validate: () => numberWarning, message: numberWarning } }],
			customKeyWarningRules: [{ type: 'custom', options: { validate: () => keyWarning, message: keyWarning } }],
		})

		const numberInput = wrapper.find('.number-field input')
		const keyInput = wrapper.find('.key-field input')

		// Saisie partielle du numéro
		await numberInput.trigger('focus')
		await numberInput.setValue('123456789012') // 12 caractères
		await numberInput.trigger('blur')
		await wrapper.vm.$nextTick()
		await flushPromises()

		// Le warning n'est pas appliqué car < 13 caractères
		expect(wrapper.vm.numberValidation.warnings.value).toEqual([])

		// Saisie complète du numéro
		await numberInput.trigger('focus')
		await numberInput.setValue('1234567890123') // 13 caractères
		await numberInput.trigger('blur')
		await wrapper.vm.$nextTick()
		await flushPromises()

		expect(wrapper.vm.numberValidation.warnings.value).toContain(numberWarning)

		// Saisie partielle de la clé
		await keyInput.trigger('focus')
		await keyInput.setValue('9') // 1 caractère
		await keyInput.trigger('blur')
		await wrapper.vm.$nextTick()
		await flushPromises()

		// Le warning n'est pas appliqué car < 2 caractères
		expect(wrapper.vm.keyValidation.warnings.value).toEqual([])

		// Saisie complète de la clé (le numéro doit être aussi complet pour valider la clé et déclencher le watch)
		await numberInput.trigger('focus')
		await numberInput.setValue('2940375120005') // on s'assure d'avoir un NIR valide
		await numberInput.trigger('blur')
		await wrapper.vm.$nextTick()
		await flushPromises()

		await keyInput.trigger('focus')
		await keyInput.setValue('91') // 2 caractères (clé valide)
		await keyInput.trigger('blur')
		await wrapper.vm.$nextTick()
		await flushPromises()

		// Validation explicite pour forcer l'évaluation
		await wrapper.vm.keyValidation.validate()
		await wrapper.vm.$nextTick()
		await flushPromises()

		expect(wrapper.vm.keyValidation.warnings.value).toContain(keyWarning)
	})

	it('devrait mettre le focus sur le champ en erreur lors d\'une validation globale', async () => {
		wrapper = await createWrapper({ required: true })

		// Espionner le focus sur les inputs natifs
		const numberInputEl = wrapper.find('.number-field input').element as HTMLInputElement
		const keyInputEl = wrapper.find('.key-field input').element as HTMLInputElement

		const numberFocusSpy = vi.spyOn(numberInputEl, 'focus')
		const keyFocusSpy = vi.spyOn(keyInputEl, 'focus')

		// Les champs sont vides, donc number sera en erreur en premier
		await wrapper.vm.validateOnSubmit()
		await wrapper.vm.$nextTick()
		await flushPromises()

		expect(numberFocusSpy).toHaveBeenCalled()
		expect(keyFocusSpy).not.toHaveBeenCalled()

		// On remplit le NIR mais la clé est vide (ou invalide)
		numberFocusSpy.mockClear()
		keyFocusSpy.mockClear()

		await wrapper.find('.number-field input').setValue('2940375120005')
		await wrapper.vm.$nextTick()
		await flushPromises()

		await wrapper.vm.validateOnSubmit()
		await wrapper.vm.$nextTick()
		await flushPromises()

		expect(numberFocusSpy).not.toHaveBeenCalled()
		expect(keyFocusSpy).toHaveBeenCalled()
	})

	it('ne devrait pas valider la clé lorsque displayKey est à false', async () => {
		wrapper = await createWrapper({ displayKey: false, required: true })

		const numberInput = wrapper.find('.number-field input')

		// Saisir un NIR valide
		await numberInput.trigger('focus')
		await numberInput.setValue('2940375120005')
		await numberInput.trigger('blur')
		await wrapper.vm.$nextTick()
		await flushPromises()

		// Le champ numéro ne doit pas avoir d'erreur
		expect(wrapper.vm.numberValidation.errors.value).toEqual([])

		// La validation de la clé ne doit pas s'appliquer (pas de règles)
		expect(wrapper.vm.keyValidation.errors.value).toEqual([])

		// La validation globale doit réussir même sans clé
		const isValid = await wrapper.vm.validateOnSubmit()
		expect(isValid).toBe(true)

		// hasFieldErrors doit être false car seule la validation du numéro compte
		// On accède à hasFieldErrors via le composant car il est exposé par useNirValidation
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- deso
		const componentInstance = wrapper.vm as any
		expect(componentInstance.hasFieldErrors).toBe(false)
	})

	it('devrait ignorer les erreurs de clé lors de la validation globale lorsque displayKey est à false', async () => {
		wrapper = await createWrapper({ displayKey: false })

		const numberInput = wrapper.find('.number-field input')

		// Saisir un NIR valide
		await numberInput.trigger('focus')
		await numberInput.setValue('2940375120005')
		await numberInput.trigger('blur')
		await wrapper.vm.$nextTick()
		await flushPromises()

		// Même si la clé n'est pas affichée, on vérifie que la validation globale ignore bien les erreurs de clé
		// (simuler une erreur de clé qui ne devrait pas impacter la validation)
		const isValid = await wrapper.vm.validateOnSubmit()
		expect(isValid).toBe(true)
	})

	it('ne devrait afficher aucune erreur ni état quand disableErrorHandling est vrai', async () => {
		wrapper = await createWrapper({ required: true, disableErrorHandling: true })

		await wrapper.find('.number-field input').trigger('focus')
		await wrapper.find('.number-field input').trigger('blur')
		await wrapper.vm.$nextTick()
		await flushPromises()

		expect(wrapper.vm.numberValidation.errors.value).toEqual([])
		expect(wrapper.vm.numberValidation.hasError.value).toBe(false)

		await wrapper.find('.key-field input').trigger('focus')
		await wrapper.find('.key-field input').trigger('blur')
		await wrapper.vm.$nextTick()
		await flushPromises()

		expect(wrapper.vm.keyValidation.errors.value).toEqual([])
		expect(wrapper.vm.keyValidation.hasError.value).toBe(false)
	})

	it('devrait valider à chaque changement de valeur quand isValidateOnBlur est faux', async () => {
		wrapper = await createWrapper({ required: true, isValidateOnBlur: false })

		const numberInput = wrapper.find('.number-field input')

		// Saisie d'une valeur invalide sans blur
		await numberInput.setValue('123')
		await wrapper.vm.$nextTick()
		await flushPromises()

		// L'erreur doit apparaître immédiatement, sans blur
		expect(wrapper.vm.numberValidation.errors.value).toContain(locales.errorInvalidNumber)

		// Correction vers une valeur valide
		await numberInput.setValue('2940375120005')
		await wrapper.vm.$nextTick()
		await flushPromises()

		expect(wrapper.vm.numberValidation.errors.value).toEqual([])
	})

	it('devrait afficher les errorMessages injectés depuis le parent', async () => {
		const injectedError = 'Erreur injectée depuis le parent'
		wrapper = await createWrapper({ errorMessages: [injectedError] })

		await wrapper.vm.$nextTick()
		await flushPromises()

		// L'état d'erreur doit refléter le message injecté sans déclencher de validation
		expect(wrapper.vm.numberValidation.hasError.value).toBe(true)
		expect(wrapper.vm.numberValidation.errors.value).toContain(injectedError)
	})

	it('devrait réinitialiser la validation quand modelValue passe à null ou undefined', async () => {
		// Partir d'un NIR invalide pour avoir une erreur
		wrapper = await createWrapper({ required: true, modelValue: '199012345678' })

		await wrapper.vm.validateOnSubmit()
		await wrapper.vm.$nextTick()
		await flushPromises()

		expect(wrapper.vm.numberValidation.errors.value.length).toBeGreaterThan(0)

		// Remettre modelValue à undefined simule un reset depuis le parent
		await wrapper.setProps({ modelValue: undefined })
		await wrapper.vm.$nextTick()
		await flushPromises()

		expect(wrapper.vm.numberValidation.errors.value).toEqual([])
		expect(wrapper.vm.keyValidation.errors.value).toEqual([])
	})
})
