import { computed } from 'vue'
import { convertToUnit } from '@/utils/convertToUnit'

export type NumberOrNumberString = string | number | undefined

export function useWidthable(props: {
	maxWidth?: NumberOrNumberString
	minWidth?: NumberOrNumberString
	width?: NumberOrNumberString
}) {
	// Computed style properties
	const widthStyles = computed<Record<string, string | undefined>>(() => {
		return {
			maxWidth: convertToUnit(props.maxWidth),
			minWidth: convertToUnit(props.minWidth),
			width: convertToUnit(props.width ?? '100%'),
		}
	})

	return {
		widthStyles,
	}
}

export interface Widthable {
	maxWidth?: NumberOrNumberString
	minWidth?: NumberOrNumberString
	width?: NumberOrNumberString
}
