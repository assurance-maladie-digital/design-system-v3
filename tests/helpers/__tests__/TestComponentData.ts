import type { ComponentProps } from 'vue-component-type-helpers'
import type { ExpectedPropOptions } from '@tests/types'
import type { PropType } from 'vue'
import TestComponent from './TestComponent.vue'

export interface TestComponentProps {
	booleanProp?: boolean
	nullStringProp?: string | null
	requiredBoolean: boolean
	requiredString: string
	stringProp?: string
	undefinedStringProp?: string
}
export const expectedPropOptions: ExpectedPropOptions<typeof TestComponent> = {
	booleanProp: {
		type: Boolean,
		default: true,
	},
	bordered: {
		type: Boolean,
		default: false,
	},
	classes: {
		type: String,
		default: undefined,
	},
	color: {
		type: String,
		default: undefined,
	},
	nullStringProp: {
		type: [String, null] as PropType<string | null>,
		default: null,
	},
	requiredBoolean: {
		type: Boolean,
		required: true,
	},
	requiredString: {
		type: String,
		required: true,
	},
	stringProp: {
		type: String,
		default: 'String prop default value',
	},
	undefinedStringProp: {
		type: String,
		default: undefined,
	},
	uniqueId: {
		type: String,
		required: true,
	},
}

export const requiredPropValues = (): ComponentProps<typeof TestComponent> => ({
	requiredBoolean: true,
	requiredString: 'required-required-prop',
	uniqueId: 'required-required-unique-id',
})

export const modifiedPropValues = (): ComponentProps<typeof TestComponent> => ({
	booleanProp: false,
	bordered: true,
	classes: 'modified-class',
	color: 'modified-color',
	nullStringProp: 'Modified null string prop value',
	requiredBoolean: false,
	requiredString: 'modified-required-prop',
	stringProp: 'Modified string prop value',
	undefinedStringProp: 'Modified undefined string prop value',
	uniqueId: 'modified-modified-unique-id',
})
