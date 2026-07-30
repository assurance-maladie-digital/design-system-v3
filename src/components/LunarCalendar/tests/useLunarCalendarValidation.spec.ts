import { describe, it, expect } from 'vitest'
import { ref, nextTick } from 'vue'
import { useLunarCalendarValidation } from '../useLunarCalendarValidation'
import { locales as defaultLocales } from '../locales'
import type { LunarCalendarProps } from '../types'

function createProps(overrides: Partial<LunarCalendarProps> = {}): LunarCalendarProps {
	return {
		label: 'Date de naissance',
		placeholder: undefined,
		isClearable: false,
		displayPrependIcon: true,
		displayAppendIcon: false,
		minYear: undefined,
		maxYear: undefined,
		// FieldValidationProps defaults
		required: false,
		errorMessages: null,
		warningMessages: null,
		successMessages: null,
		readonly: false,
		disabled: false,
		customRules: [],
		customWarningRules: [],
		customSuccessRules: [],
		showSuccessMessages: false,
		isValidateOnBlur: true,
		...overrides,
	}
}

describe('useLunarCalendarValidation', () => {
	describe('règle de format DD/MM/YYYY', () => {
		it('ne retourne pas d\'erreur si la valeur est vide', async () => {
			const modelValue = ref('')
			const props = createProps()
			const validation = useLunarCalendarValidation(modelValue, props, ref(defaultLocales))

			await validation.validate()
			await nextTick()

			expect(validation.errors.value).toHaveLength(0)
		})

		it('accepte une date au format DD/MM/YYYY', async () => {
			const modelValue = ref('25/12/2000')
			const props = createProps()
			const validation = useLunarCalendarValidation(modelValue, props, ref(defaultLocales))

			await validation.validate()
			await nextTick()

			expect(validation.errors.value).toHaveLength(0)
		})

		it('retourne une erreur si le format est invalide', async () => {
			const modelValue = ref('25122000')
			const props = createProps()
			const validation = useLunarCalendarValidation(modelValue, props, ref(defaultLocales))

			await validation.validate()
			await nextTick()

			expect(validation.errors.value).toContain('La date est invalide.')
			expect(validation.hasError.value).toBe(true)
		})

		it('retourne une erreur si la date est incomplète', async () => {
			const modelValue = ref('25/12/200')
			const props = createProps()
			const validation = useLunarCalendarValidation(modelValue, props, ref(defaultLocales))

			await validation.validate()
			await nextTick()

			expect(validation.errors.value).toContain('La date est invalide.')
		})
	})

	describe('règle required', () => {
		it('ne retourne pas d\'erreur si non requis et vide', async () => {
			const modelValue = ref('')
			const props = createProps({ required: false })
			const validation = useLunarCalendarValidation(modelValue, props, ref(defaultLocales))

			await validation.validate()
			await nextTick()

			expect(validation.errors.value).toHaveLength(0)
		})

		it('retourne une erreur si requis et vide', async () => {
			const modelValue = ref('')
			const props = createProps({ required: true, label: 'Date' })
			const validation = useLunarCalendarValidation(modelValue, props, ref(defaultLocales))

			await validation.validate()
			await nextTick()

			expect(validation.errors.value).toContain('Le champ Date est requis.')
			expect(validation.hasError.value).toBe(true)
		})

		it('utilise le label dans le message d\'erreur', async () => {
			const modelValue = ref('')
			const props = createProps({ required: true, label: 'Date de naissance' })
			const validation = useLunarCalendarValidation(modelValue, props, ref(defaultLocales))

			await validation.validate()
			await nextTick()

			expect(validation.errors.value).toContain('Le champ Date de naissance est requis.')
		})
	})

	describe('règle minYear', () => {
		it('retourne une erreur si l\'année est inférieure à minYear', async () => {
			const modelValue = ref('25/12/1999')
			const props = createProps({ minYear: 2000 })
			const validation = useLunarCalendarValidation(modelValue, props, ref(defaultLocales))

			await validation.validate()
			await nextTick()

			expect(validation.errors.value).toContain('L\'année doit être supérieure ou égale à 2000.')
			expect(validation.hasError.value).toBe(true)
		})

		it('accepte l\'année égale à minYear', async () => {
			const modelValue = ref('25/12/2000')
			const props = createProps({ minYear: 2000 })
			const validation = useLunarCalendarValidation(modelValue, props, ref(defaultLocales))

			await validation.validate()
			await nextTick()

			expect(validation.errors.value).toHaveLength(0)
		})

		it('accepte l\'année supérieure à minYear', async () => {
			const modelValue = ref('25/12/2020')
			const props = createProps({ minYear: 2000 })
			const validation = useLunarCalendarValidation(modelValue, props, ref(defaultLocales))

			await validation.validate()
			await nextTick()

			expect(validation.errors.value).toHaveLength(0)
		})

		it('ignore minYear si le format est invalide', async () => {
			const modelValue = ref('invalid')
			const props = createProps({ minYear: 2000 })
			const validation = useLunarCalendarValidation(modelValue, props, ref(defaultLocales))

			await validation.validate()
			await nextTick()

			// L'erreur de format est présente mais pas celle de minYear
			expect(validation.errors.value).toContain('La date est invalide.')
			expect(validation.errors.value).not.toContain('L\'année doit être supérieure ou égale à 2000.')
		})
	})

	describe('règle maxYear', () => {
		it('retourne une erreur si l\'année est supérieure à maxYear', async () => {
			const modelValue = ref('25/12/2021')
			const props = createProps({ maxYear: 2020 })
			const validation = useLunarCalendarValidation(modelValue, props, ref(defaultLocales))

			await validation.validate()
			await nextTick()

			expect(validation.errors.value).toContain('L\'année doit être inférieure ou égale à 2020.')
			expect(validation.hasError.value).toBe(true)
		})

		it('accepte l\'année égale à maxYear', async () => {
			const modelValue = ref('25/12/2020')
			const props = createProps({ maxYear: 2020 })
			const validation = useLunarCalendarValidation(modelValue, props, ref(defaultLocales))

			await validation.validate()
			await nextTick()

			expect(validation.errors.value).toHaveLength(0)
		})

		it('accepte l\'année inférieure à maxYear', async () => {
			const modelValue = ref('25/12/2010')
			const props = createProps({ maxYear: 2020 })
			const validation = useLunarCalendarValidation(modelValue, props, ref(defaultLocales))

			await validation.validate()
			await nextTick()

			expect(validation.errors.value).toHaveLength(0)
		})
	})

	describe('règles minYear ET maxYear combinées', () => {
		it('retourne une erreur si l\'année est hors plage (inférieure)', async () => {
			const modelValue = ref('25/12/1999')
			const props = createProps({ minYear: 2000, maxYear: 2020 })
			const validation = useLunarCalendarValidation(modelValue, props, ref(defaultLocales))

			await validation.validate()
			await nextTick()

			expect(validation.errors.value).toContain('L\'année doit être comprise entre 2000 et 2020.')
			expect(validation.hasError.value).toBe(true)
		})

		it('retourne une erreur si l\'année est hors plage (supérieure)', async () => {
			const modelValue = ref('25/12/2021')
			const props = createProps({ minYear: 2000, maxYear: 2020 })
			const validation = useLunarCalendarValidation(modelValue, props, ref(defaultLocales))

			await validation.validate()
			await nextTick()

			expect(validation.errors.value).toContain('L\'année doit être comprise entre 2000 et 2020.')
			expect(validation.hasError.value).toBe(true)
		})

		it('accepte une date dans la plage', async () => {
			const modelValue = ref('25/12/2010')
			const props = createProps({ minYear: 2000, maxYear: 2020 })
			const validation = useLunarCalendarValidation(modelValue, props, ref(defaultLocales))

			await validation.validate()
			await nextTick()

			expect(validation.errors.value).toHaveLength(0)
		})
	})

	describe('clearValidation', () => {
		it('efface les erreurs après clearValidation', async () => {
			const modelValue = ref('invalid')
			const props = createProps()
			const validation = useLunarCalendarValidation(modelValue, props, ref(defaultLocales))

			await validation.validate()
			await nextTick()
			expect(validation.errors.value.length).toBeGreaterThan(0)

			validation.clearValidation()
			await nextTick()

			expect(validation.errors.value).toHaveLength(0)
			expect(validation.hasError.value).toBe(false)
		})
	})

	describe('validate return value', () => {
		it('retourne true si la validation réussit', async () => {
			const modelValue = ref('25/12/2000')
			const props = createProps()
			const validation = useLunarCalendarValidation(modelValue, props, ref(defaultLocales))

			const result = await validation.validate()

			expect(result).toBe(true)
		})

		it('retourne false si la validation échoue', async () => {
			const modelValue = ref('invalid')
			const props = createProps()
			const validation = useLunarCalendarValidation(modelValue, props, ref(defaultLocales))

			const result = await validation.validate()

			expect(result).toBe(false)
		})
	})

	describe('focused ref', () => {
		it('exposed focused ref', () => {
			const modelValue = ref('')
			const props = createProps()
			const validation = useLunarCalendarValidation(modelValue, props, ref(defaultLocales))

			expect(validation.focused).toBeDefined()
			expect(validation.focused.value).toBe(false)
		})
	})
})
