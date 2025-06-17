<script setup lang="ts">
	import { type PropType, computed } from 'vue'
	import AmeliproBtn from '../AmeliproBtn/AmeliproBtn.vue'
	import type { RouteLocationRaw } from 'vue-router'
	import { locales } from './locales'
	import { mdiChevronRight } from '@mdi/js'
	import { useDisplay } from 'vuetify'

	const props = defineProps({
		birthName: {
			type: String,
			default: undefined,
		},
		birthdate: {
			type: String,
			default: undefined,
		},
		moreInformationHref: {
			type: String,
			default: undefined,
		},
		moreInformationTo: {
			type: [Array, Object, String] as PropType<RouteLocationRaw>,
			default: undefined,
		},
		name: {
			type: String,
			default: undefined,
		},
		noMoreInformation: {
			type: Boolean,
			default: false,
		},
		noPatientChange: {
			type: Boolean,
			default: false,
		},
		patientDoctorInfos: {
			type: String,
			default: undefined,
		},
		patientNir: {
			type: String,
			default: undefined,
		},
		patientOrganism: {
			type: String,
			default: undefined,
		},
		patientStatus: {
			type: String,
			default: undefined,
		},
		patientSystem: {
			type: String,
			default: undefined,
		},
		uniqueId: {
			type: String,
			default: undefined,
		},
	})

	const { smAndDown, smAndUp, mdAndUp, sm, xs, width } = useDisplay()

	const innerWidth = computed<string>(() => {
		if (width.value >= 1240) {
			return '1144px'
		}
		return width.value >= 1072 ? '980px' : '100%'
	})

	const hasBirthName = computed<boolean>(() => props.birthName !== undefined)
	const emit = defineEmits(['click:patient-change'])
	const emitPatientChangeEvent = (): void => emit('click:patient-change')
</script>

<template>
	<div
		:id="uniqueId ? `${uniqueId}-container` : undefined"
		class="w-100 bg-ap-white pa-8 d-flex justify-center amelipro-patient-banner"
		style="position: relative;"
	>
		<div
			:id="uniqueId ? `${uniqueId}-wrapper` : undefined"
			class="amelipro-patient-banner__content"
			:style="`width: ${ innerWidth };`"
		>
			<div
				class="d-flex"
				:class="mdAndUp ? 'justify-space-between align-center' : 'flex-column'"
			>
				<div
					:id="uniqueId ? `${uniqueId}-patient-infos` : undefined"
					class="amelipro-patient-banner__patient-infos"
					:class="{
						'd-inline-flex align-center flex-wrap': mdAndUp,
						'd-flex align-start justify-space-between': sm,
						'd-block': xs,
					}"
				>
					<p
						:id="uniqueId ? `${uniqueId}-identity` : undefined"
						class="mb-4 mb-md-0 text-h5 amelipro-patient-banner__patient-info__name"
					>
						<span class="text-h3 font-weight-semibold d-block d-sm-inline">
							{{ name }}
						</span>
						né(e)
						<span v-if="hasBirthName">
							{{ birthName }}
						</span>
						le {{ birthdate }}
					</p>

					<AmeliproBtn
						v-if="!noPatientChange"
						class="mb-4 mb-md-0 text-none text-h5 amelipro-patient-banner__patient-change__btn"
						:class="smAndUp ? 'mx-4 ' : ''"
						hover-underline
						text
						:unique-id="uniqueId ? `${uniqueId}-patient-change-btn` : undefined"
						@click="emitPatientChangeEvent"
					>
						{{ locales.patientChange }}

						<template #icon>
							{{ mdiChevronRight }}
						</template>
					</AmeliproBtn>
				</div>

				<p
					:id="uniqueId ? `${uniqueId}-patient-doctor-infos` : undefined"
					class="mb-0 text-h5 text-ap-blue-darken-1 amelipro-patient-banner__patient-info__doctor"
				>
					{{ patientDoctorInfos }}
				</p>
			</div>

			<hr class="patient-banner__separator">

			<div
				:id="uniqueId ? `${uniqueId}-main-content` : undefined"
				class="d-flex patient-banner-main"
				:class="{
					'justify-space-between align-center': mdAndUp && !noMoreInformation,
					'align-center': mdAndUp && noMoreInformation,
					'flex-column align-start': smAndDown,
				}"
			>
				<div class="d-flex flex-column flex-sm-row">
					<div :class="smAndUp ? 'mr-16' : ''">
						<p
							:id="uniqueId ? `${uniqueId}-patient-status` : undefined"
							class="mb-4 text-h5 font-weight-regular"
						>
							{{ locales.status }}
							<span class="font-weight-semibold">
								{{ patientStatus }}
							</span>
						</p>

						<p
							:id="uniqueId ? `${uniqueId}-patient-number` : undefined"
							class="mb-4 mb-md-0 text-h5 font-weight-regular"
						>
							{{ locales.nir }}
							<span class="font-weight-semibold">
								{{ patientNir }}
							</span>
						</p>
					</div>

					<div :class="smAndUp ? 'mr-3' : ''">
						<p
							:id="uniqueId ? `${uniqueId}-patient-system` : undefined"
							class="mb-4 text-h5"
						>
							{{ patientSystem }}
						</p>

						<p
							:id="uniqueId ? `${uniqueId}-patient-organism` : undefined"
							class="mb-4 mb-md-0 text-h5"
						>
							{{ patientOrganism }}
						</p>
					</div>
				</div>

				<AmeliproBtn
					v-if="!noMoreInformation"
					bordered
					color="ap-white"
					hover-color="ap-blue-lighten-3"
					:href="moreInformationHref"
					text-color="ap-blue-darken-1"
					:to="moreInformationTo"
					:unique-id="uniqueId ? `${uniqueId}-more-info-btn` : undefined"
				>
					{{ locales.more }}
				</AmeliproBtn>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/apTokens';

.patient-banner__separator {
	height: 3px;
	width: 100%;
	margin: 1rem 0;
	border: 0;
	background-color: apTokens.$ap-grey-lighten2;
}
</style>
