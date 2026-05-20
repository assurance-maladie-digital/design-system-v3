import { computed, ref, watch, type Ref } from 'vue'
import { indicatifs } from './indicatifs'
import type { Indicatif, DisplayFormat } from './types'

export function usePhoneIndicatifs(
	defaultDialCode: Ref<string | Indicatif>,
	displayFormat: Ref<DisplayFormat>,
	customIndicatifs: Ref<Indicatif[]>,
	useCustomIndicatifsOnly: Ref<boolean>,
) {
	function getIndicatifDisplayText(indicatif: Indicatif): string {
		switch (displayFormat.value) {
			case 'code-abbreviation':
				return `${indicatif.code} ${indicatif.abbreviation}`
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
		return mergedDialCodes.map(indicatif => ({
			displayText: getIndicatifDisplayText(indicatif),
			...indicatif,
			phoneLength: indicatif.phoneLength || indicatif.mask?.replace(/[^#]/g, '').length,
		}))
	})

	const dialCode = ref<string | Indicatif>()
	watch(defaultDialCode, (newVal) => {
		if (typeof newVal === 'string') {
			const searchDial = dialCodeList.value.find(indicatif => indicatif.code === newVal)
			if (searchDial) {
				dialCode.value = searchDial
			}
		}
		else if (typeof newVal === 'object' && newVal !== null) {
			const searchDial = dialCodeList.value.find(indicatif => indicatif.code === newVal.code) || newVal
			if (searchDial) {
				dialCode.value = searchDial
			}
		}
	}, { immediate: true })

	// Get the pattern and other parameters for the phone field
	const usedIndicatif = computed<Indicatif>(() => {
		const countryCode = (typeof dialCode.value === 'string' ? dialCode.value : dialCode.value?.code) || '+33'

		const dial = dialCodeList.value.find(indicatif => indicatif.code === countryCode)
		if (dial) return dial

		// If no default dial code is found, return the first one in the list
		if (dialCodeList.value[0]) {
			return dialCodeList.value[0]
		}

		// Fallback to a default indicatif if the list is empty
		return indicatifs.find(indicatif => indicatif.code === '+33') as Indicatif
	})

	return {
		dialCode,
		dialCodeList,
		usedIndicatif,
	}
}
