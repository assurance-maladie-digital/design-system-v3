<script setup lang="ts">
	import { computed, type PropType, ref, watch } from 'vue'
	import type { AmeliproCheckboxItem } from './types'
	import AmeliproMessage from '../AmeliproMessage/AmeliproMessage.vue'

	const props = defineProps({
		required: {
			type: Boolean,
			default: false,
		},
		checkbox: {
			type: Object as PropType<AmeliproCheckboxItem>,
			required: true,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		errorDefault: {
			type: Boolean,
			default: false,
		},
		isSwitch: {
			type: Boolean,
			default: false,
		},
		labelLeft: {
			type: Boolean,
			default: false,
		},
		modelValue: {
			type: Boolean,
			default: false,
		},
		requiredErrorMessage: {
			type: String,
			default: 'Sélection obligatoire',
		},
		uniqueId: {
			type: String,
			required: true,
		},
	})

	const isAlreadyCheckedOnce = ref(props.errorDefault)

	const labelColorClasses = computed<string>(() => {
		if (props.disabled) {
			return 'text-ap-grey'
		}

		if (error.value !== '') {
			return 'text-ap-error'
		}

		return 'text-ap-grey-darken-1'
	})

	const currentValue = computed({
		get: () => props.modelValue,
		set: (value: boolean) => {
			isAlreadyCheckedOnce.value = true
			emit('update:model-value', value, props.checkbox)
		},
	})

	const emit = defineEmits(['update:model-value'])

	const emitEvent = () => {
		if (!props.disabled) {
			currentValue.value = !currentValue.value
		}
	}

	const error = computed<string>(() => (isAlreadyCheckedOnce.value === true && props.required === true && currentValue.value === false ? props.requiredErrorMessage : ''))
	const checkErrorCondition = computed<boolean>(() => (isAlreadyCheckedOnce.value === true && props.required === true && currentValue.value === false))

	watch(() => props.errorDefault, (newErrorDefaultValue: boolean) => {
		isAlreadyCheckedOnce.value = newErrorDefaultValue
	})
</script>

<template>
	<div :id="`${uniqueId}-container`">
		<div class="d-flex align-center amelipro-checkbox">
			<div
				:id="uniqueId"
				:aria-checked="modelValue"
				:aria-describedby="checkErrorCondition ? `${uniqueId}-error ` + checkbox.description : checkbox.description"
				:aria-disabled="disabled"
				:aria-invalid="checkErrorCondition ? 'true' : undefined"
				:required="required ? 'true' : undefined"
				class="mr-0 d-inline-flex flex-row align-center text-body-1 amelipro-checkbox-input"
				:class="{
					'amelipro-switch': isSwitch,
					'label--left': labelLeft,
				}"
				role="checkbox"
				:tabindex="disabled ? '-1' : '0'"
				@click="emitEvent"
				@keydown.space="emitEvent"
			>
				<span
					:id="`${uniqueId}-label-text`"
					class="checkbox-label"
					:class="labelColorClasses"
				>
					<slot name="label">
						{{ checkbox.label }}
					</slot>

					<span
						v-if="required"
						aria-hidden="true"
						class="d-inline-flex"
					>
						&nbsp;*
					</span>
					<span
						v-if="required"
						class="d-sr-only"
					>
						&nbsp;Champ obligatoire
					</span>
				</span>
			</div>

			<slot name="append" />
		</div>

		<AmeliproMessage
			v-if="checkErrorCondition"
			no-icon
			text
			type="error"
			:unique-id="`${uniqueId}-error`"
		>
			<p class="mb-0">
				{{ error }}
			</p>
		</AmeliproMessage>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/apTokens';

.amelipro-checkbox-input {
	& .checkbox-label {
		position: relative;
		padding-top: 0.25rem;
		padding-bottom: 0.25rem;
		padding-left: 2rem;
		cursor: pointer;

		&::before {
			position: absolute;
			top: 0.0625rem;
			left: 0;
			width: 1.5rem;
			height: 1.5rem;
			border-radius: 0.4rem;
			border: 3px solid apTokens.$ap-blue-darken1;
			background-color: transparent;
			content: '';
		}
	}

	&[aria-checked='true'] {
		& .checkbox-label {
			&::before {
				background-color: apTokens.$ap-blue-darken1;
			}

			&::after {
				position: absolute;
				top: 0.5rem;
				left: 0.3rem;
				width: 0.9rem;
				height: 0.5rem;
				border-radius: 2px;
				border-bottom: 3px solid apTokens.$ap-white;
				border-left: 3px solid apTokens.$ap-white;
				transform: rotate(-50deg);
				content: '';
			}
		}
	}

	&.label--left {
		& .checkbox-label {
			padding-left: 0;
			padding-right: 2rem;

			&::before {
				left: unset;
				right: 0;
			}

			&::after {
				left: unset;
				right: 0.3rem;
			}
		}
	}

	&.amelipro-switch {
		& .checkbox-label {
			padding-top: 0.4rem;
			padding-bottom: 0.4rem;
			padding-left: 4rem;

			&::before {
				height: apTokens.$switch-track-height;
				width: apTokens.$switch-track-width;
				top: apTokens.$switch-track-top;
				border-radius: 24px;
				background-color: apTokens.$ap-grey;
				border: 0;
			}

			&::after {
				position: absolute;
				height: apTokens.$switch-thumb-height;
				width: apTokens.$switch-thumb-width;
				top: apTokens.$switch-thumb-top;
				left: 4px;
				border-radius: 24px;
				background-color: apTokens.$ap-white;
				border: 0;
				transition: transform 0.3s ease-in-out;
				content: '';
			}
		}

		&[aria-checked='true'] {
			& .checkbox-label {
				&::before {
					background-color: apTokens.$ap-blue-darken1;
				}

				&::after {
					transform: translateX(1.5rem);
				}
			}
		}

		&.label--left {
			& .checkbox-label {
				padding-left: 0;
				padding-right: 4rem;

				&::before {
					left: unset;
					right: 0;
				}

				&::after {
					left: unset;
					right: calc(4px + 1.5rem);
				}
			}
		}
	}

	&[aria-disabled='true'] {
		& .checkbox-label {
			cursor: default;

			&::before {
				opacity: 0.6;
			}
		}
	}
}
</style>
