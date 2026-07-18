<script lang="ts" setup>
	import { vMaska } from 'maska/vue'
	import { computed } from 'vue'
	import SyTextField from '../Customs/SyTextField/SyTextField.vue'
	import { validationPropsDefaults, type FieldValidationProps } from '@/composables/unifyValidation/useValidation'
	import { useLunarCalendarValidation } from './useLunarCalendarValidation'
	import type { LunarCalendarProps } from './types'
	import { locales as defaultLocales } from './locales'

	const model = defineModel<string>()
	const mask = '##/##/####'

	const props = withDefaults(defineProps<LunarCalendarProps & FieldValidationProps>(), {
		label: '',
		maxYear: undefined,
		minYear: undefined,
		placeholder: undefined,
		isClearable: false,
		displayAppendIcon: false,
		displayPrependIcon: true,
		// Nouvelles props avec defaults
		helpText: '',
		noIcon: false,
		displayAsterisk: false,
		prependTooltip: undefined,
		appendTooltip: undefined,
		tooltipLocation: 'top',
		variantStyle: 'outlined',
		color: 'primary',
		density: 'default',
		loading: false,
		hint: undefined,
		bgColor: 'white',
		baseColor: undefined,
		counter: false,
		id: undefined,
		name: undefined,
		hideDetails: false,
		autocomplete: 'off',
		locales: () => defaultLocales,
		...validationPropsDefaults,
	})

	const { focused, validate, errors, warnings, successes, hasError, hasWarning, hasSuccess, clearValidation } = useLunarCalendarValidation(computed(() => model.value), props)

	defineExpose({
		validateOnSubmit: validate,
		clearValidation,
	})

</script>

<template>
	<SyTextField
		:id="props.id"
		v-model="model"
		v-maska="mask"
		:label="props.label"
		:error-messages="errors"
		:warning-messages="warnings"
		:success-messages="successes"
		:has-error="hasError"
		:has-warning="hasWarning"
		:has-success="hasSuccess"
		:show-success-messages="props.showSuccessMessages"
		:placeholder
		:is-clearable
		:append-icon="props.displayAppendIcon ? 'calendar' : undefined"
		:prepend-icon="props.displayPrependIcon ? 'calendar' : undefined"
		:help-text="props.helpText"
		:no-icon="props.noIcon"
		:display-asterisk="props.displayAsterisk"
		:prepend-tooltip="props.prependTooltip"
		:append-tooltip="props.appendTooltip"
		:tooltip-location="props.tooltipLocation"
		:variant-style="props.variantStyle"
		:color="props.color"
		:density="props.density"
		:loading="props.loading"
		:hint="props.hint"
		:bg-color="props.bgColor"
		:base-color="props.baseColor"
		:counter="props.counter"
		:name="props.name"
		:autocomplete="props.autocomplete"
		:disabled="props.disabled"
		:readonly="props.readonly"
		:required="props.required"
		:hide-details="props.hideDetails"
		:disable-error-handling="true"
		@focus="focused = true"
		@blur="focused = false"
	/>
</template>
