<script setup lang="ts">
	import { type PropType, computed } from 'vue'
	import type { IndexedObject } from '@/components/Amelipro/types'

	const props = defineProps({
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
	})

	const computedStyles = computed<IndexedObject>(() => {
		const mainStyles: IndexedObject = { backgroundColor: 'computed-background-color' }

		if (props.bordered) {
			mainStyles.border = '1px solid black' // Exemple de style de bordure
		}

		if (props.color) {
			mainStyles.color = props.color
		}

		return mainStyles
	})
</script>

<template>
	<div
		:id="uniqueId"
		:class="['test-component', classes]"
		:style="computedStyles"
	>
		<h1>{{ requiredString }}</h1>
		<p
			v-if="nullStringProp === null"
			class="test-null-string"
		>
			Null string prop is null
		</p>
		<p
			v-if="undefinedStringProp === undefined"
			class="test-undefined-string"
		>
			Undefined string prop is undefined
		</p>
		<p
			v-if="stringProp"
			class="test-string-prop"
		>
			{{ stringProp }}
		</p>
		<p
			v-if="!booleanProp"
			class="test-boolean-false"
		>
			Boolean prop is false
		</p>
		<p
			v-if="bordered"
			class="test-bordered-true"
		>
			Bordered is true
		</p>
		<p
			v-if="!bordered"
			class="test-bordered-false"
		>
			Bordered is false
		</p>
		<p
			v-if="color"
			class="test-color-set"
		>
			Color is set to {{ color }}
		</p>
		<p
			v-if="!color"
			class="test-color-not-set"
		>
			Color is not set
		</p>
		<div
			v-if="requiredBoolean"
			class="test-required-boolean"
		>
			Required boolean is true
		</div>
	</div>
</template>
