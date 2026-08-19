import { computed, type MaybeRefOrGetter, toValue, type Ref } from 'vue'

/**
 * Limite le nombre de messages à `max` éléments.
 * Retourne le tableau inchangé si `max` est undefined ou <= 0.
 */
export function limitMessages(messages: string[], max?: number): string[] {
	return max && max > 0 ? messages.slice(0, max) : messages
}

/**
 * Déduplique et filtre les messages vides, puis limite le nombre.
 */
export function normalizeMessages(messages: string[], max?: number): string[] {
	return limitMessages(
		[...new Set(messages.filter(Boolean))],
		max,
	)
}

/**
 * Fusionne des messages externes et internes en dédupliquant puis limitant.
 */
export function mergeMessages(
	externalMessages: string[] | null | undefined,
	internalMessages: string[],
	max?: number,
): string[] {
	return limitMessages(
		[...new Set([
			...(externalMessages ?? []),
			...internalMessages,
		])],
		max,
	)
}

/**
 * Options pour `useDisplayMessages`.
 */
export interface UseDisplayMessagesOptions {
	errors: Ref<string[]>
	warnings: Ref<string[]>
	successes: Ref<string[]>
	externalErrors?: MaybeRefOrGetter<string[] | null | undefined>
	externalWarnings?: MaybeRefOrGetter<string[] | null | undefined>
	externalSuccesses?: MaybeRefOrGetter<string[] | null | undefined>
	maxErrors?: MaybeRefOrGetter<number | undefined>
	hasErrorProp?: MaybeRefOrGetter<boolean | undefined>
	hasWarningProp?: MaybeRefOrGetter<boolean | undefined>
	hasSuccessProp?: MaybeRefOrGetter<boolean | undefined>
	internalHasSuccess?: Ref<boolean>
	disableErrorHandling?: MaybeRefOrGetter<boolean | undefined>
}

/**
 * Composable qui calcule les messages d'affichage et les flags de priorité
 * (erreur > avertissement > succès) à partir d'états internes et externes.
 */
export function useDisplayMessages(options: UseDisplayMessagesOptions) {
	const displayErrors = computed(() => {
		const max = toValue(options.maxErrors)
		return mergeMessages(
			toValue(options.externalErrors) ?? null,
			options.errors.value,
			max,
		)
	})

	const displayWarnings = computed(() => {
		const max = toValue(options.maxErrors)
		return mergeMessages(
			toValue(options.externalWarnings) ?? null,
			options.warnings.value,
			max,
		)
	})

	const displaySuccesses = computed(() => {
		const max = toValue(options.maxErrors)
		return mergeMessages(
			toValue(options.externalSuccesses) ?? null,
			options.successes.value,
			max,
		)
	})

	const displayHasError = computed(() =>
		displayErrors.value.length > 0 || Boolean(toValue(options.hasErrorProp)),
	)

	const displayHasWarning = computed(() =>
		displayWarnings.value.length > 0 || Boolean(toValue(options.hasWarningProp)),
	)

	const displayHasSuccess = computed(() => (
		(
			(options.internalHasSuccess?.value ?? false)
			|| (toValue(options.externalSuccesses)?.length ?? 0) > 0
		)
		&& !displayHasError.value
		&& !displayHasWarning.value
	) || Boolean(toValue(options.hasSuccessProp)))

	return {
		displayErrors,
		displayWarnings,
		displaySuccesses,
		displayHasError,
		displayHasWarning,
		displayHasSuccess,
	}
}
