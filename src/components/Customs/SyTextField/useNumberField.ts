import { computed, type Ref } from 'vue'

// Caractères autorisés dans un champ number : chiffres, exposant, signes et séparateur décimal.
const NUMBER_ALLOWED_CHARACTERS_PATTERN = /[^0-9eE+.-]/g
const NUMBER_ALLOWED_SINGLE_CHARACTER_PATTERN = /^[0-9eE+.-]$/
// Préfixe de nombre valide : un seul séparateur décimal, un seul exposant, signes bien placés.
const NUMBER_PREFIX_PATTERN = /^[+-]?\d*\.?\d*(?:[eE][+-]?\d*)?/

/**
 * Regroupe la logique propre au mode `type="number"` de SyTextField.
 *
 * Un champ number est rendu en `type=text` (+ `inputmode=decimal`) pour que `input.value`
 * reste lisible et corrigeable sur tous les navigateurs (Chrome comme Firefox). L'incrément
 * natif étant alors perdu, il est réimplémenté ici (flèches ↑/↓ + boutons +/-).
 */
export function useNumberField(params: {
	type: Ref<string | undefined>
	disabled: Ref<boolean | undefined>
	readonly: Ref<boolean | undefined>
	model: Ref<string | number | null | undefined | string[]>
	attrs: Record<string, unknown>
}) {
	const isNumberField = computed(() => params.type.value === 'number')

	const nativeInputType = computed(() => (isNumberField.value ? 'text' : params.type.value))

	// Retire les caractères interdits puis ne conserve qu'un préfixe de nombre valide.
	const sanitizeNumberValue = (value: string | number | null | undefined | string[]) => {
		if (!isNumberField.value || typeof value !== 'string') {
			return value
		}

		const cleaned = value.replace(NUMBER_ALLOWED_CHARACTERS_PATTERN, '')
		const match = cleaned.match(NUMBER_PREFIX_PATTERN)
		return match ? match[0] : ''
	}

	// Un seul caractère saisi est-il autorisé dans un champ number ? (filtrage clavier)
	const isAllowedNumberCharacter = (char: string) => NUMBER_ALLOWED_SINGLE_CHARACTER_PATTERN.test(char)

	// Une donnée (collage, multi-caractères) contient-elle un caractère interdit ? (beforeinput)
	const hasDisallowedNumberCharacter = (data: string) => data.replace(NUMBER_ALLOWED_CHARACTERS_PATTERN, '') !== data

	const stepValue = (direction: 1 | -1) => {
		if (params.disabled.value || params.readonly.value) {
			return
		}

		const rawStep = Number(params.attrs.step ?? 1)
		const step = Number.isFinite(rawStep) && rawStep > 0 ? rawStep : 1

		const currentNum = Number(params.model.value)
		const base = Number.isFinite(currentNum) ? currentNum : 0

		// Arrondit l'addition AVANT le clamp pour éviter les imprécisions flottantes
		// (ex. pas de 0.1) sans altérer la précision de min/max.
		const decimals = (String(step).split('.')[1] ?? '').length
		let next = Number((base + direction * step).toFixed(decimals))

		const min = params.attrs.min !== undefined && params.attrs.min !== '' ? Number(params.attrs.min) : undefined
		const max = params.attrs.max !== undefined && params.attrs.max !== '' ? Number(params.attrs.max) : undefined
		if (min !== undefined && Number.isFinite(min) && next < min) {
			next = min
		}
		if (max !== undefined && Number.isFinite(max) && next > max) {
			next = max
		}

		params.model.value = String(next)
	}

	// type=number rendu en type=text : on réimplémente l'incrément clavier ↑/↓.
	// Retourne true si la touche a été prise en charge (défaut empêché).
	const handleStepKeydown = (event: KeyboardEvent) => {
		if (!isNumberField.value || (event.key !== 'ArrowUp' && event.key !== 'ArrowDown')) {
			return false
		}

		event.preventDefault()
		stepValue(event.key === 'ArrowUp' ? 1 : -1)
		return true
	}

	return {
		isNumberField,
		nativeInputType,
		sanitizeNumberValue,
		isAllowedNumberCharacter,
		hasDisallowedNumberCharacter,
		stepValue,
		handleStepKeydown,
	}
}
