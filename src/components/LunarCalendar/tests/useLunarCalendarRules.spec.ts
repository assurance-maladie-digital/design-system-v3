import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useLunarCalendarRules } from '../useLunarCalendarRules'

function getRules(opts: {
	successMessage?: string
	required?: boolean
	minYear?: number
	maxYear?: number
}) {
	const { rules } = useLunarCalendarRules(
		ref(opts.successMessage),
		ref(opts.required),
		ref(opts.minYear),
		ref(opts.maxYear),
	)
	return rules.value
}

type CustomRule = { type: 'custom', options: { validate: (v: string) => boolean, message: string } }

describe('useLunarCalendarRules', () => {
	describe('règle required', () => {
		it('n\'ajoute pas de règle required si required est false', () => {
			const rules = getRules({ required: false })
			expect(rules.some(r => r.type === 'required')).toBe(false)
		})

		it('ajoute une règle required si required est true', () => {
			const rules = getRules({ required: true })
			expect(rules.some(r => r.type === 'required')).toBe(true)
		})

		it('la règle required contient le bon message', () => {
			const rules = getRules({ required: true })
			const req = rules.find(r => r.type === 'required')
			expect(req?.options.message).toBe('Ce champ est requis.')
		})

		it('la règle required contient le successMessage si fourni', () => {
			const rules = getRules({ required: true, successMessage: 'Bravo' })
			const req = rules.find(r => r.type === 'required')
			expect(req?.options.successMessage).toBe('Bravo')
		})
	})

	describe('règle format DD/MM/YYYY', () => {
		it('valide une date au format DD/MM/YYYY', () => {
			const rules = getRules({})
			const fmt = rules.find(r => r.type === 'custom') as CustomRule
			expect(fmt.options.validate('25/12/2000')).toBe(true)
		})

		it('rejette une date sans slashs', () => {
			const rules = getRules({})
			const fmt = rules.find(r => r.type === 'custom') as CustomRule
			expect(fmt.options.validate('25122000')).toBe(false)
		})

		it('rejette une date incomplète', () => {
			const rules = getRules({})
			const fmt = rules.find(r => r.type === 'custom') as CustomRule
			expect(fmt.options.validate('25/12/200')).toBe(false)
		})

		it('rejette une chaîne vide', () => {
			const rules = getRules({})
			const fmt = rules.find(r => r.type === 'custom') as CustomRule
			expect(fmt.options.validate('')).toBe(false)
		})
	})

	describe('règle minYear seulement', () => {
		it('retourne true si le format est invalide (year null)', () => {
			const rules = getRules({ minYear: 2000 })
			const minRule = rules.filter(r => r.type === 'custom')[1] as CustomRule
			expect(minRule.options.validate('invalid')).toBe(true)
		})

		it('retourne true si l\'année >= minYear', () => {
			const rules = getRules({ minYear: 2000 })
			const minRule = rules.filter(r => r.type === 'custom')[1] as CustomRule
			expect(minRule.options.validate('25/12/2000')).toBe(true)
		})

		it('retourne false si l\'année < minYear', () => {
			const rules = getRules({ minYear: 2000 })
			const minRule = rules.filter(r => r.type === 'custom')[1] as CustomRule
			expect(minRule.options.validate('25/12/1999')).toBe(false)
		})

		it('contient le bon message', () => {
			const rules = getRules({ minYear: 2000 })
			const minRule = rules.filter(r => r.type === 'custom')[1] as CustomRule
			expect(minRule.options.message).toBe('L\'année doit être supérieure ou égale à 2000.')
		})
	})

	describe('règle maxYear seulement', () => {
		it('retourne true si le format est invalide (year null)', () => {
			const rules = getRules({ maxYear: 2020 })
			const maxRule = rules.filter(r => r.type === 'custom')[1] as CustomRule
			expect(maxRule.options.validate('invalid')).toBe(true)
		})

		it('retourne true si l\'année <= maxYear', () => {
			const rules = getRules({ maxYear: 2020 })
			const maxRule = rules.filter(r => r.type === 'custom')[1] as CustomRule
			expect(maxRule.options.validate('25/12/2020')).toBe(true)
		})

		it('retourne false si l\'année > maxYear', () => {
			const rules = getRules({ maxYear: 2020 })
			const maxRule = rules.filter(r => r.type === 'custom')[1] as CustomRule
			expect(maxRule.options.validate('25/12/2021')).toBe(false)
		})

		it('contient le bon message', () => {
			const rules = getRules({ maxYear: 2020 })
			const maxRule = rules.filter(r => r.type === 'custom')[1] as CustomRule
			expect(maxRule.options.message).toBe('L\'année doit être inférieure ou égale à 2020.')
		})
	})

	describe('règle minYear ET maxYear', () => {
		it('retourne true si le format est invalide (year null)', () => {
			const rules = getRules({ minYear: 2000, maxYear: 2020 })
			const rangeRule = rules.filter(r => r.type === 'custom')[1] as CustomRule
			expect(rangeRule.options.validate('invalid')).toBe(true)
		})

		it('retourne true si l\'année est dans la plage', () => {
			const rules = getRules({ minYear: 2000, maxYear: 2020 })
			const rangeRule = rules.filter(r => r.type === 'custom')[1] as CustomRule
			expect(rangeRule.options.validate('25/12/2010')).toBe(true)
		})

		it('retourne false si l\'année est avant minYear', () => {
			const rules = getRules({ minYear: 2000, maxYear: 2020 })
			const rangeRule = rules.filter(r => r.type === 'custom')[1] as CustomRule
			expect(rangeRule.options.validate('25/12/1999')).toBe(false)
		})

		it('retourne false si l\'année est après maxYear', () => {
			const rules = getRules({ minYear: 2000, maxYear: 2020 })
			const rangeRule = rules.filter(r => r.type === 'custom')[1] as CustomRule
			expect(rangeRule.options.validate('25/12/2021')).toBe(false)
		})

		it('contient le bon message', () => {
			const rules = getRules({ minYear: 2000, maxYear: 2020 })
			const rangeRule = rules.filter(r => r.type === 'custom')[1] as CustomRule
			expect(rangeRule.options.message).toBe('L\'année doit être comprise entre 2000 et 2020.')
		})
	})

	describe('getYearFromModel (via les règles)', () => {
		it('retourne null si le modèle n\'a pas 3 parties', () => {
			const rules = getRules({ minYear: 2000 })
			const minRule = rules.filter(r => r.type === 'custom')[1] as CustomRule
			expect(minRule.options.validate('25/12')).toBe(true)
		})

		it('retourne null si l\'année n\'a pas 4 chiffres', () => {
			const rules = getRules({ minYear: 2000 })
			const minRule = rules.filter(r => r.type === 'custom')[1] as CustomRule
			expect(minRule.options.validate('25/12/200')).toBe(true)
		})

		it('retourne null si l\'année n\'est pas un nombre', () => {
			const rules = getRules({ minYear: 2000 })
			const minRule = rules.filter(r => r.type === 'custom')[1] as CustomRule
			expect(minRule.options.validate('25/12/abcd')).toBe(true)
		})
	})

	describe('aucune règle year si minYear et maxYear sont undefined', () => {
		it('ne génère que 1 règle custom (format) sans min/max', () => {
			const rules = getRules({})
			const customRules = rules.filter(r => r.type === 'custom')
			expect(customRules.length).toBe(1)
		})
	})
})
