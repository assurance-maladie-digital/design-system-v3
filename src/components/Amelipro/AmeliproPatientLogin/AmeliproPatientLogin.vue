<script setup lang="ts">
	import { type PropType, computed } from 'vue'
	import type { AutoCompleteItem } from '../AmeliproAutoCompleteField/types'
	import type { IPatientLogin } from './types'
	import AmeliproBtn from '../AmeliproBtn/AmeliproBtn.vue'
	import AmeliproCard from '../AmeliproCard/AmeliproCard.vue'
	import AmeliproDialog from '../AmeliproDialog/AmeliproDialog.vue'
	import AmeliproPatientLoginForm from './AmeliproPatientLoginForm/AmeliproPatientLoginForm.vue'
	import { useDisplay } from 'vuetify'
	import type { ValidationRule } from '@/utils/rules/types'

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
			type: Object as PropType<IPatientLogin>,
			default: () => ({ dialog: false, formValue: { fieldValue: undefined, autoCompleteValue: undefined } }),
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
			required: true,
		},
	})

	const { mdAndUp } = useDisplay()
	const emit = defineEmits(['click:vital-card', 'click:vital-card-app', 'submit:nir', 'update:model-value'])

	const componentValue = computed({
		get: (): IPatientLogin => props.modelValue,
		set: (newValue: IPatientLogin): void => {
			emit('update:model-value', newValue, `${props.uniqueId}`)
		},
	})

	const clickVitalCard = () => emit('click:vital-card', props.modelValue, `${props.uniqueId}-form-vital-card-btn`)
	const clickVitalCardApp = () => emit('click:vital-card-app', props.modelValue, `${props.uniqueId}-form-vital-card-app-btn`)
	const submitNir = () => emit('submit:nir', props.modelValue, `${props.uniqueId}-form-nir-btn`)
</script>

<template>
	<div :id="uniqueId">
		<AmeliproCard no-card-header>
			<h2
				:id="`${uniqueId}-title`"
				class="ident-title "
			>
				Identification patient
			</h2>

			<AmeliproPatientLoginForm
				v-if="mdAndUp"
				v-model="componentValue.formValue"
				:auto-complete-card-items="autoCompleteCardItems"
				:disable-btn-app-vital-card="disableBtnAppVitalCard"
				:disable-btn-nir="disableBtnNir"
				:disable-btn-vital-card="disableBtnVitalCard"
				:error-message-app-vital-card="errorMessageAppVitalCard"
				:error-message-nir="errorMessageNir"
				:error-message-vital-card="errorMessageVitalCard"
				:loading="loading"
				:no-app-vital-card="noAppVitalCard"
				:no-nir="noNir"
				:no-vital-card="noVitalCard"
				:rules-auto-complete-card="rulesAutoCompleteCard"
				:rules-nir="rulesNir"
				:unique-id="`${uniqueId}-form`"
				@click:vital-card="clickVitalCard"
				@click:vital-card-app="clickVitalCardApp"
				@submit:nir="submitNir"
			>
				<template
					v-if="$slots.messageAppVitalCard"
					#messageAppVitalCard
				>
					<slot name="messageAppVitalCard" />
				</template>

				<template
					v-if="$slots.messageNir"
					#messageNir
				>
					<slot name="messageNir" />
				</template>

				<template
					v-if="$slots.messageVitalCard"
					#messageVitalCard
				>
					<slot name="messageVitalCard" />
				</template>
			</AmeliproPatientLoginForm>

			<div
				v-if="!mdAndUp"
				class="mt-6 w-100"
			>
				<AmeliproBtn
					class="w-100"
					:unique-id="`${uniqueId}-dialog-btn`"
					@click="componentValue.dialog = true"
				>
					Identifier
				</AmeliproBtn>

				<AmeliproDialog
					v-model="componentValue.dialog"
					:labelledby="`${uniqueId}-dialog-title`"
					:unique-id="`${uniqueId}-dialog`"
				>
					<template #header>
						<h2
							:id="`${uniqueId}-dialog-title`"
							class="ma-0 text-h4"
						>
							Identification patient
						</h2>
					</template>

					<template #default>
						<AmeliproPatientLoginForm
							v-model="componentValue.formValue"
							:auto-complete-card-items="autoCompleteCardItems"
							:disable-btn-app-vital-card="disableBtnAppVitalCard"
							:disable-btn-nir="disableBtnNir"
							:disable-btn-vital-card="disableBtnVitalCard"
							:error-message-app-vital-card="errorMessageAppVitalCard"
							:error-message-nir="errorMessageNir"
							:error-message-vital-card="errorMessageVitalCard"
							:loading="loading"
							:no-app-vital-card="noAppVitalCard"
							:no-nir="noNir"
							:no-vital-card="noVitalCard"
							:rules-auto-complete-card="rulesAutoCompleteCard"
							:rules-nir="rulesNir"
							:unique-id="`${uniqueId}-form`"
							@click:vital-card="clickVitalCard"
							@click:vital-card-app="clickVitalCardApp"
							@submit:nir="submitNir"
						>
							<template
								v-if="$slots.messageAppVitalCard"
								#messageAppVitalCard
							>
								<slot name="messageAppVitalCard" />
							</template>

							<template
								v-if="$slots.messageNir"
								#messageNir
							>
								<slot name="messageNir" />
							</template>

							<template
								v-if="$slots.messageVitalCard"
								#messageVitalCard
							>
								<slot name="messageVitalCard" />
							</template>
						</AmeliproPatientLoginForm>
					</template>
				</AmeliproDialog>
			</div>
		</AmeliproCard>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/apTokens';

.ident-title {
	font-size: apTokens.$font-size-xs !important;
	text-align: center;
	font-weight: apTokens.$ap-font-weight-bold;
	text-transform: uppercase;

	@media #{apTokens.$media-up-md} {
		text-align: left;
	}
}
</style>
