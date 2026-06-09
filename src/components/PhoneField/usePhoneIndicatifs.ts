import { computed, ref, watch, type Ref } from 'vue'
import { indicatifs } from './indicatifs'
import type { Indicatif, DisplayFormat } from './types'

export function usePhoneIndicatifs(
	dialCodeProp: Ref<string | Indicatif>,
	displayFormat: Ref<DisplayFormat>,
	customIndicatifs: Ref<Indicatif[]>,
	useCustomIndicatifsOnly: Ref<boolean>,
) {
	function getIndicatifDisplayText(indicatif: Indicatif): string {
		switch (displayFormat.value) {
			case 'code-abbreviation':
				return `${indicatif.code} (${indicatif.abbreviation})`
			case 'code-country':
				return `${indicatif.code} ${indicatif.countryFr || indicatif.country}`
			case 'country':
				return indicatif.countryFr || indicatif.country
			case 'abbreviation':
				return indicatif.abbreviation
			default:
				return indicatif.code
		}
	}

	const dialCodeList = computed(() => {
		const mergedDialCodes = useCustomIndicatifsOnly.value ? customIndicatifs.value : [...indicatifs, ...customIndicatifs.value]
		return mergedDialCodes.map((indicatif) => {
			const countryName = indicatif.countryFr || indicatif.country
			const plainDisplayText = getIndicatifDisplayText(indicatif)
			let displayText = escapeHtml(plainDisplayText)

			if (displayFormat.value === 'code-abbreviation' || displayFormat.value === 'abbreviation') {
				const safeCountry = escapeHtml(countryName)
				const safeAbbr = escapeHtml(indicatif.abbreviation)
				displayText = displayText.replace(safeAbbr, `<abbr title="${safeCountry}">${safeAbbr}</abbr>`)
			}

			return {
				...indicatif,
				displayText,
				plainDisplayText,
				phoneLength: indicatif.phoneLength || indicatif.mask?.replace(/[^#]/g, '').length,
			}
		})
	})

	const internalDialCode = ref<Indicatif>(
		getIndicatif(dialCodeProp.value) || getFallbackIndicatif(),
	)
	watch(dialCodeList, () => {
		const foundIndicatif = getIndicatif(internalDialCode.value)
		if (!foundIndicatif) {
			internalDialCode.value = getFallbackIndicatif()
		}
	})

	watch(dialCodeProp, (newVal) => {
		const foundIndicatif = getIndicatif(newVal)
		if (foundIndicatif) {
			internalDialCode.value = foundIndicatif
		}
	}, { immediate: true })

	function getIndicatif(dialCode: string | Indicatif | null | undefined): Indicatif | undefined {
		const countryCode = (typeof dialCode === 'string' ? dialCode : dialCode?.code)
		return dialCodeList.value.find(indicatif => indicatif.code === countryCode)
	}

	function getFallbackIndicatif(): Indicatif {
		return dialCodeList.value.find(indicatif => indicatif.code === '+33')
			|| dialCodeList.value[0]
			|| indicatifs.find(indicatif => indicatif.code === '+33')!
	}

	return {
		internalDialCode,
		dialCodeList,
	}
}

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;')
}
