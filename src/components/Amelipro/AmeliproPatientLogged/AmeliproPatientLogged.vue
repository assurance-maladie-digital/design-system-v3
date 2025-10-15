<script setup lang="ts">
	import type { IPatientInfoLabels, IPatientInfos } from './types'
	import { type PropType, computed, ref } from 'vue'
	import AmeliproBtn from '../AmeliproBtn/AmeliproBtn.vue'
	import AmeliproCard from '../AmeliproCard/AmeliproCard.vue'
	import AmeliproCopyBtn from '../AmeliproCopyBtn/AmeliproCopyBtn.vue'
	import AmeliproDialog from '../AmeliproDialog/AmeliproDialog.vue'
	import AmeliproIconBtn from '../AmeliproIconBtn/AmeliproIconBtn.vue'
	import AmeliproMessage from '../AmeliproMessage/AmeliproMessage.vue'
	import AmeliproSelect from '../AmeliproSelect/AmeliproSelect.vue'
	import AmeliproTooltips from '../AmeliproTooltips/AmeliproTooltips.vue'
	import type { SelectItem } from '../AmeliproSelect/types'

	const props = defineProps({
		btnMoreInfo: {
			type: Boolean,
			default: false,
		},
		doctorTooltipRed: {
			type: Boolean,
			default: false,
		},
		errorMessage: {
			type: Boolean,
			default: false,
		},
		labels: {
			type: Object as PropType<IPatientInfoLabels>,
			default: () => ({
				ame: 'AME',
				birthdate: 'Né(e) le',
				btnLabel: 'Changer de patient',
				c2s: 'C2S',
				doctor: 'MT',
				doctorDialogBtn: 'Voir détails MT',
				doctorDialogTitle: 'Médecin traitant',
				exemption: 'Exonération TM',
				exemptionDialogTitle: 'Exonération TM',
				exemptionLine2: 'Date début d\'exonération maternité',
				firstName: 'Prénom',
				fund: 'Caisse',
				fundDialogTitle: 'Coordonnées de l\'organisme de rattachement du patient',
				moreInfo: 'Plus d\'informations',
				mtm: 'Modulation MT',
				name: 'Nom',
				nir: 'NIR',
				plan: 'Régime',
				rank: 'Rang',
				rights: 'Droits à la date du jour',
				selectLabel: 'Autres bénéficiaires :',
			}),
		},
		modelValue: {
			type: [Object, Number, String] as PropType<SelectItem | number | string>,
			default: undefined,
		},
		noPdfBtn: {
			type: Boolean,
			default: false,
		},
		patientInfos: {
			type: Object as PropType<IPatientInfos>,
			default: () => ({}),
		},
		uniqueId: {
			type: String,
			required: true,
		},
	})

	const nirWithSpace = computed<string | undefined>(() => {
		if (props.patientInfos.nir && props.patientInfos.nir.length === 15) {
			return `${props.patientInfos.nir.substring(0, 13)}\xa0${props.patientInfos.nir.substring(13, 15)}`
		}
		if (props.patientInfos.nir) {
			return props.patientInfos.nir
		}
		return undefined
	})

	const doctorDialog = ref(false)
	const exemptionDialog = ref(false)
	const fundDialog = ref(false)

	const emit = defineEmits(['click', 'click:info', 'click:more-info', 'click:pdf', 'update:model-value'])
	const selectValue = computed({
		get: (): SelectItem | number | string | undefined => props.modelValue,
		set: (newValue: SelectItem | number | string | undefined): void => {
			emit('update:model-value', newValue, props.uniqueId)
		},
	})

	const emitClick = () => emit('click', `${props.uniqueId}-btn`, selectValue.value)
	const emitClickInfo = () => emit('click:info', `${props.uniqueId}-info-btn`)
	const emitClickPdf = () => emit('click:pdf', `${props.uniqueId}-pdf-btn`)
	const emitClickMoreInfo = () => emit('click:more-info', `${props.uniqueId}-btn-more-info`)
</script>

<template>
	<AmeliproCard
		no-card-header
		:unique-id="uniqueId"
	>
		<div
			:id="`${uniqueId}-header`"
			class="mb-4 d-flex align-center"
		>
			<h2
				:id="`${uniqueId}-title`"
				class="ident-title"
			>
				Informations Patient
			</h2>

			<div class="d-flex">
				<AmeliproIconBtn
					bordered
					btn-label="Informations"
					class="ml-2"
					icon="aide"
					icon-bg-color="ap-white"
					icon-color="ap-blue-darken-1"
					icon-hover-bg-color="ap-white"
					icon-hover-color="ap-blue-darken-2"
					large
					:unique-id="`${uniqueId}-info-btn`"
					@click="emitClickInfo"
				/>

				<AmeliproIconBtn
					v-if="!noPdfBtn"
					bordered
					btn-label="Télécharger le fichier pdf"
					class="ml-2"
					icon="pdf"
					icon-bg-color="ap-red"
					icon-color="ap-white"
					icon-hover-bg-color="ap-red-darken-1"
					icon-hover-color="ap-white"
					large
					:unique-id="`${uniqueId}-pdf-btn`"
					@click="emitClickPdf"
				/>
			</div>
		</div>
		<div :id="`${uniqueId}-content`">
			<div class="mb-4">
				<p
					v-if="patientInfos.name"
					:id="`${uniqueId}-name`"
					class="mb-1"
				>
					{{ labels.name }}&nbsp;:&nbsp;
					<span class="font-weight-bold">
						{{ patientInfos.name }}
					</span>
				</p>

				<p
					v-if="patientInfos.firstName"
					:id="`${uniqueId}-firstname`"
					class="mb-1"
				>
					{{ labels.firstName }}&nbsp;:&nbsp;
					<span class="font-weight-bold">
						{{ patientInfos.firstName }}
					</span>
				</p>

				<p
					v-if="patientInfos.nir"
					:id="`${uniqueId}-nir`"
					class="mb-1"
				>
					{{ labels.nir }}&nbsp;:&nbsp;

					<span class="d-inline-flex align-center flex-wrap">
						<span class="font-weight-bold">
							{{ nirWithSpace }}
						</span>

						<AmeliproCopyBtn
							:text-to-copy="patientInfos.nir"
							:unique-id="`${uniqueId}-copy-nir-btn`"
						/>
					</span>
				</p>

				<p
					v-if="patientInfos.birthdate"
					:id="`${uniqueId}-birthdate`"
					class="mb-1"
				>
					{{ labels.birthdate }}&nbsp;:&nbsp;
					<span class="font-weight-bold">
						{{ patientInfos.birthdate }}
					</span>
				</p>

				<p
					v-if="patientInfos.rank"
					:id="`${uniqueId}-rank`"
					class="mb-1"
				>
					Rang&nbsp;:&nbsp;
					<span class="font-weight-bold">
						{{ patientInfos.rank }}
					</span>
				</p>
			</div>
			<div class="mb-4">
				<p
					v-if="patientInfos.plan"
					:id="`${uniqueId}-plan`"
					class="mb-1"
				>
					{{ labels.plan }}&nbsp;:&nbsp;
					<span class="font-weight-bold">
						{{ patientInfos.plan }}
					</span>
				</p>

				<p
					v-if="patientInfos.fund"
					:id="`${uniqueId}-fund`"
					class="mb-1"
				>
					{{ labels.fund }}&nbsp;:&nbsp;
					<span>
						<AmeliproBtn
							class="d-inline text-none text-left font-weight-bold dialog-btn"
							text
							underline
							:unique-id="`${uniqueId}-fund-dialog-btn`"
							@click="fundDialog = true"
						>
							{{ patientInfos.fund }}
						</AmeliproBtn>

						<AmeliproTooltips
							v-if="patientInfos.fundTooltip"
							classes="ml-2 d-inline"
							icon-bg-color="ap-blue-darken-1"
							icon-color="ap-white"
							icon-hover-bg-color="ap-blue-darken-2"
							icon-hover-color="ap-white"
							icon-name="information"
							:tooltip-text="patientInfos.fundTooltip"
							:unique-id="`${uniqueId}-fund-tooltip`"
						/>
					</span>
				</p>

				<AmeliproDialog
					v-model="fundDialog"
					:labelledby="`${uniqueId}-fund-dialog-title`"
					:unique-id="`${uniqueId}-fund-dialog`"
				>
					<template #header>
						<h2
							:id="`${uniqueId}-fund-dialog-title`"
							class="ma-0 text-h4"
						>
							{{ labels.fundDialogTitle }}
						</h2>
					</template>

					<template #default>
						<slot name="fundDialog" />
					</template>
				</AmeliproDialog>

				<p
					v-if="patientInfos.center"
					:id="`${uniqueId}-center`"
					class="mb-1"
				>
					{{ labels.center }}&nbsp;:&nbsp;
					<span class="font-weight-bold">
						{{ patientInfos.center }}
					</span>
				</p>
			</div>

			<div class="mb-4">
				<p
					v-if="patientInfos.doctor"
					:id="`${uniqueId}-doctor`"
					class="mb-1"
				>
					{{ labels.doctor }}&nbsp;:&nbsp;

					<slot name="doctor">
						<span>
							<AmeliproBtn
								class="d-inline text-none text-left font-weight-bold dialog-btn"
								text
								underline
								:unique-id="`${uniqueId}-doctor-dialog-btn`"
								@click="doctorDialog = true"
							>
								{{ labels.doctorDialogBtn }}
							</AmeliproBtn>

							<AmeliproTooltips
								v-if="patientInfos.doctorTooltip"
								classes="ml-2 d-inline"
								:icon-bg-color="doctorTooltipRed ? 'ap-red' : 'ap-blue-darken-1'"
								icon-color="ap-white"
								:icon-hover-bg-color="doctorTooltipRed ? 'ap-red-darken-1' : 'ap-blue-darken-2'"
								icon-hover-color="ap-white"
								icon-name="information"
								:tooltip-text="patientInfos.doctorTooltip"
								:unique-id="`${uniqueId}-doctor-tooltip`"
							/>
						</span>
					</slot>
				</p>

				<AmeliproDialog
					v-model="doctorDialog"
					:labelledby="`${uniqueId}-doctor-dialog-title`"
					:unique-id="`${uniqueId}-doctor-dialog`"
				>
					<template #header>
						<h2
							:id="`${uniqueId}-doctor-dialog-title`"
							class="ma-0 text-h4"
						>
							{{ labels.doctorDialogTitle }}
						</h2>
					</template>

					<template #default>
						<slot name="doctorDialog" />
					</template>

					<template #footer>
						<slot name="doctorDialogFooter" />
					</template>
				</AmeliproDialog>

				<p
					v-if="patientInfos.rights"
					:id="`${uniqueId}-rights`"
					class="mb-1"
				>
					{{ labels.rights }}&nbsp;:&nbsp;
					<span class="font-weight-bold">
						{{ patientInfos.rights }}
					</span>
				</p>

				<p
					v-if="patientInfos.exemption || $slots.exemptionDialog"
					:id="`${uniqueId}-exemption`"
					class="mb-1"
				>
					{{ labels.exemption }}&nbsp;:&nbsp;
					<span
						class="font-weight-bold"
					>
						{{ patientInfos.exemption }}
					</span>
					<AmeliproBtn
						v-if="$slots.exemptionDialog"
						class="d-inline text-none text-left font-weight-bold dialog-btn"
						text
						underline
						:unique-id="`${uniqueId}-exemption-dialog-btn`"
						@click="exemptionDialog = true"
					>
						{{ patientInfos.exemptionDialogBtnText }}
					</AmeliproBtn>
				</p>

				<AmeliproDialog
					v-if="$slots.exemptionDialog"
					v-model="exemptionDialog"
					:labelledby="`${uniqueId}-exemption-dialog-title`"
					:unique-id="`${uniqueId}-exemption-dialog`"
				>
					<template #header>
						<h2
							:id="`${uniqueId}-exemption-dialog-title`"
							class="ma-0 text-h4"
						>
							{{ labels.exemptionDialogTitle }}
						</h2>
					</template>

					<template #default>
						<slot name="exemptionDialog" />
					</template>
				</AmeliproDialog>

				<p
					v-if="patientInfos.exemptionLine2"
					:id="`${uniqueId}-exemption-line-2`"
					class="mb-1"
				>
					{{ labels.exemptionLine2 }}&nbsp;:&nbsp;
					<span
						class="font-weight-bold"
					>
						{{ patientInfos.exemptionLine2 }}
					</span>
				</p>

				<p
					v-if="patientInfos.c2s"
					:id="`${uniqueId}-c2s`"
					class="mb-1"
				>
					{{ labels.c2s }}&nbsp;:&nbsp;
					<span class="d-inline-flex align-center flex-wrap">
						<span class="font-weight-bold">
							{{ patientInfos.c2s }}
						</span>

						<AmeliproTooltips
							v-if="patientInfos.c2sTooltip"
							classes="ml-2"
							icon-bg-color="ap-blue-darken-1"
							icon-color="ap-white"
							icon-hover-bg-color="ap-blue-darken-2"
							icon-hover-color="ap-white"
							icon-name="information"
							:tooltip-text="patientInfos.c2sTooltip"
							:unique-id="`${uniqueId}-c2s-tooltip`"
						/>
					</span>
				</p>

				<p
					v-if="patientInfos.ame"
					:id="`${uniqueId}-ame`"
					class="mb-1"
				>
					{{ labels.ame }}&nbsp;:&nbsp;
					<span class="font-weight-bold">
						{{ patientInfos.ame }}
					</span>
				</p>

				<p
					v-if="patientInfos.mtm"
					:id="`${uniqueId}-mtm`"
					class="mb-1"
				>
					{{ labels.mtm }}&nbsp;:&nbsp;
					<span class="font-weight-bold">
						{{ patientInfos.mtm }}
					</span>
				</p>
			</div>

			<slot />

			<slot name="moreInfo">
				<AmeliproBtn
					v-if="btnMoreInfo"
					class="d-block text-none text-left more-info-btn"
					text
					:unique-id="`${uniqueId}-btn-more-info`"
					@click="emitClickMoreInfo"
				>
					{{ labels.moreInfo }}
				</AmeliproBtn>
			</slot>

			<AmeliproSelect
				v-if="patientInfos.selectItems"
				v-model="selectValue"
				classes="mt-4"
				:items="patientInfos.selectItems"
				:label="labels.selectLabel"
				:unique-id="`${uniqueId}-select`"
			/>

			<AmeliproBtn
				class="d-block w-100 patient-change-btn"
				:unique-id="`${uniqueId}-btn`"
				@click="emitClick"
			>
				{{ labels.btnLabel }}
			</AmeliproBtn>

			<AmeliproMessage
				v-if="$slots.message"
				align-start
				class="w-100 mt-2"
				text
				:type="errorMessage ? 'error' : 'info'"
			>
				<slot name="message" />
			</AmeliproMessage>
		</div>
	</AmeliproCard>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/apTokens';

.dialog-btn {
	white-space: normal;
	text-align: left;
}

.more-info-btn,
.patient-change-btn {
	white-space: normal;
}

.ident-title {
	font-size: apTokens.$font-size-xs !important;
	font-weight: apTokens.$ap-font-weight-bold;
	text-transform: uppercase;
}
</style>
