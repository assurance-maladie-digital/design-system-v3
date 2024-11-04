import { defineComponent, computed } from 'vue'
import type { PropType } from 'vue'
import type { IndexedObject } from '@/types'
import { convertToUnit } from '@/utils/convertToUnit'

export type NumberOrNumberString = PropType<string | number | undefined>

export const Widthable = defineComponent({
	props: {
		maxWidth: {
			type: [Number, String] as NumberOrNumberString,
			default: undefined,
		},
		minWidth: {
			type: [Number, String] as NumberOrNumberString,
			default: undefined,
		},
		width: {
			type: [Number, String] as NumberOrNumberString,
			default: '100%',
		},
	},
	setup(props) {
		const widthStyles = computed((): IndexedObject<string | undefined> => {
			const minWidth = convertToUnit(props.minWidth)
			const maxWidth = convertToUnit(props.maxWidth)
			const width = convertToUnit(props.width)

			return {
				minWidth,
				maxWidth,
				width,
			}
		})

		return {
			widthStyles,
		}
	},
})
