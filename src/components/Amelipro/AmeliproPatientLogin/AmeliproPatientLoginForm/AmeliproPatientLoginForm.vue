<script setup lang="ts">
	import { type PropType, computed } from 'vue'
	import AmeliproAutoCompleteField from '../../AmeliproAutoCompleteField/AmeliproAutoCompleteField.vue'
	import AmeliproBtn from '../../AmeliproBtn/AmeliproBtn.vue'
	import AmeliproMessage from '../../AmeliproMessage/AmeliproMessage.vue'
	import AmeliproTextField from '../../AmeliproTextField/AmeliproTextField.vue'
	import type { AutoCompleteItem } from '../../AmeliproAutoCompleteField/types'
	import type { IPatientLoginForm } from './types'
	import type { ValidationRule } from '@/utils/rules/types'
	import { vMaska } from 'maska/vue'
	import imgVital from '@/assets/amelipro/img/idpa/carte-vitale.svg'
	import apcvLogo from '@/assets/amelipro/img/idpa/apcv_logo.svg'

	const props = defineProps({
		autoCompleteCardItems: {
			type: Array as PropType<AutoCompleteItem[]>,
			default: undefined,
		},
		disableBtnAppVitalCard: {
			type: Boolean,
			default: false,
		},
		disableBtnNir: {
			type: Boolean,
			default: false,
		},
		disableBtnVitalCard: {
			type: Boolean,
			default: false,
		},
		errorMessageAppVitalCard: {
			type: Boolean,
			default: false,
		},
		errorMessageNir: {
			type: Boolean,
			default: false,
		},
		errorMessageVitalCard: {
			type: Boolean,
			default: false,
		},
		loading: {
			type: Boolean,
			default: false,
		},
		modelValue: {
			type: Object as PropType<IPatientLoginForm>,
			default: () => ({ fieldValue: undefined, autoCompleteValue: undefined }),
		},
		noAppVitalCard: {
			type: Boolean,
			default: false,
		},
		noNir: {
			type: Boolean,
			default: false,
		},
		noVitalCard: {
			type: Boolean,
			default: false,
		},
		rulesAutoCompleteCard: {
			type: Array as PropType<ValidationRule[]>,
			default: () => [],
		},
		rulesNir: {
			type: Array as PropType<ValidationRule[]>,
			default: () => [],
		},
		uniqueId: {
			type: String,
			default: undefined,
		},
	})

	const emit = defineEmits(['click:vital-card', 'click:vital-card-app', 'submit:nir', 'update:model-value'])

	const currentValue = computed({
		get: (): IPatientLoginForm => props.modelValue,
		set: (newValue: IPatientLoginForm): void => {
			emit('update:model-value', newValue, props.uniqueId)
		},
	})

	const vitalCardBtnText = computed(() => (props.autoCompleteCardItems ? 'Lire carte virtuelle' : 'Lire la carte'))

	const clickVitalCard = () => emit('click:vital-card', `${props.uniqueId}-vital-card-btn`)
	const clickVitalCardApp = () => emit('click:vital-card-app', `${props.uniqueId}-vital-card-app-btn`)
	const submitNir = () => emit('submit:nir', `${props.uniqueId}-nir-btn`)

	const mask = {
		tokens: {
			'#': { pattern: /\d/ },
			'X': { pattern: /[0-9a-z]/i },
		},
		mask: '#####XX######',
	}
</script>

<template>
	<div aria-live="polite">
		<form v-if="!loading">
			<div
				v-if="!noVitalCard"
				class="mt-4"
			>
				<img
					alt="Carte Vitale"
					class="mx-auto mb-6 d-block"
					:src="imgVital"
				>

				<AmeliproAutoCompleteField
					v-if="autoCompleteCardItems"
					v-model="currentValue.autoCompleteValue"
					:items="autoCompleteCardItems"
					label="Sélectionnez une carte :"
					:rules="rulesAutoCompleteCard"
					:unique-id="`${uniqueId}-select-card`"
				/>

				<AmeliproBtn
					class="w-100"
					:disabled="disableBtnVitalCard"
					:unique-id="`${uniqueId}-vital-card-btn`"
					@click="clickVitalCard"
				>
					{{ vitalCardBtnText }}
				</AmeliproBtn>

				<AmeliproMessage
					v-if="$slots.messageVitalCard"
					align-start
					class="w-100 mt-2"
					text
					:type="errorMessageVitalCard ? 'error' : 'info'"
				>
					<slot name="messageVitalCard" />
				</AmeliproMessage>
			</div>

			<div
				v-if="!noAppVitalCard"
				class="mt-4"
			>
				<img
					alt=""
					class="mx-auto mb-6 d-block"
					:src="apcvLogo"
				>

				<AmeliproBtn
					class="w-100"
					:disabled="disableBtnAppVitalCard"
					:unique-id="`${uniqueId}-vital-card-app-btn`"
					@click="clickVitalCardApp"
				>
					Lire appli carte vitale
				</AmeliproBtn>

				<AmeliproMessage
					v-if="$slots.messageAppVitalCard"
					align-start
					class="w-100 mt-2"
					text
					:type="errorMessageAppVitalCard ? 'error' : 'info'"
				>
					<slot name="messageAppVitalCard" />
				</AmeliproMessage>
			</div>

			<div
				v-if="!noNir"
				class="mt-4"
			>
				<AmeliproTextField
					v-model="currentValue.fieldValue"
					v-maska="mask"
					required
					classes="mt-6"
					clearable
					:counter="13"
					label="Saisir son NIR :"
					:rules="rulesNir"
					:unique-id="`${uniqueId}-nir`"
					@keypress.enter.prevent="submitNir"
				/>

				<AmeliproBtn
					class="w-100"
					:disabled="disableBtnNir"
					:unique-id="`${uniqueId}-nir-btn`"
					@click="submitNir"
				>
					Valider le NIR
				</AmeliproBtn>

				<AmeliproMessage
					v-if="$slots.messageNir"
					align-start
					class="w-100 mt-2"
					text
					:type="errorMessageNir ? 'error' : 'info'"
				>
					<slot name="messageNir" />
				</AmeliproMessage>
			</div>
		</form>

		<div
			v-if="loading"
			aria-busy="true"
			class="d-block mt-8"
		>
			<p class="text-center">
				<span
					aria-hidden="true"
					class="d-block mx-auto my-4"
				>
					<span class="loader" />
				</span>
				Veuillez patienter pendant le chargement...
			</p>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/apTokens';

.loader {
	width: 30px;
	height: 30px;
	border: 4px solid apTokens.$ap-blue-darken1;
	border-bottom-color: transparent;
	border-radius: 50%;
	display: inline-block;
	box-sizing: border-box;
	animation: rotation 1s linear infinite;
}

@keyframes rotation {
	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(360deg);
	}
}
</style>
