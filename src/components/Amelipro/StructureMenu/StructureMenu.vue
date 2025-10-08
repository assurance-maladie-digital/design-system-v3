<script setup lang="ts">
	import type { IStructureTabs, StructureTab } from './StructureTabs/types'
	import { type PropType, computed, ref } from 'vue'
	import AmeliproBtn from '../AmeliproBtn/AmeliproBtn.vue'
	import AmeliproCheckbox from '../AmeliproCheckbox/AmeliproCheckbox.vue'
	import AmeliproDialog from '../AmeliproDialog/AmeliproDialog.vue'
	import AmeliproMessage from '../AmeliproMessage/AmeliproMessage.vue'
	import AmeliproTooltips from '../AmeliproTooltips/AmeliproTooltips.vue'
	import type { IStructureMenuValue } from './types'
	import StructureTabs from './StructureTabs/StructureTabs.vue'
	import { locales } from './locales'

	const props = defineProps({
		maxStructuresLoadedDefault: {
			type: Number,
			default: 5,
		},
		modelValue: {
			type: Object as PropType<IStructureMenuValue>,
			default: () => ({ dialog: false }),
		},
		structuresTabs: {
			type: Array as PropType<StructureTab[]>,
			default: () => [],
		},
		switchValue: {
			type: String,
			default: 'Structure par défaut',
		},
		uniqueId: {
			type: String,
			required: true,
		},
		userAdeli: {
			type: String,
			required: true,
		},
		userName: {
			type: String,
			required: true,
		},
		userProfession: {
			type: String,
			required: true,
		},
		userRpps: {
			type: String,
			required: true,
		},
	})

	const switchModel = ref(false)

	const emit = defineEmits(['cancel', 'change', 'update:model-value', 'validate'])
	const emitChangeEvent = (value: boolean): void => {
		dialog.value = value
		emit('change', dialog.value)
	}

	const emitCancelEvent = (): void => {
		emit('cancel')
		emitChangeEvent(false)
	}

	const emitConfirmEvent = (): void => {
		emit('validate', {
			defaultStructure: switchModel.value,
			selected: selectedStructure.value,
		})
		emitChangeEvent(false)
	}

	const selectedStructure = computed({
		get() {
			return { activeTab: props.modelValue.activeTab, activeValue: props.modelValue.activeValue }
		},
		set(value: IStructureTabs) {
			emit('update:model-value', { ...props.modelValue, ...value })
		},
	})

	const dialog = computed({
		get() {
			return props.modelValue.dialog
		},
		set(value: boolean) {
			emit('update:model-value', { ...props.modelValue, dialog: value })
		},
	})
</script>

<template>
	<AmeliproDialog
		v-model="dialog"
		:labelledby="`${uniqueId}-structure-menu-title`"
		:unique-id="`${uniqueId}-structure-menu`"
		width="800"
		@change="emitChangeEvent(false)"
		@confirm="emitConfirmEvent"
	>
		<template #header>
			<h2
				:id="`${uniqueId}-structure-menu-title`"
				class="ma-0 text-h3"
			>
				{{ locales.title }}
			</h2>
		</template>

		<template #default>
			<div
				:id="`${uniqueId}-structure-menu-content`"
				class="py-3"
			>
				<div
					:id="`${uniqueId}-structure-menu-first-part`"
					class="d-flex flex-column flex-md-row justify-md-space-between"
				>
					<div>
						<p
							:id="`${uniqueId}-structure-menu-user-name`"
							class="ma-0 body-1 font-weight-bold"
						>
							{{ userName }}
						</p>

						<p
							:id="`${uniqueId}-structure-menu-user-profession`"
							class="ma-0 body-2 font-weight-bold"
						>
							{{ userProfession }}
						</p>

						<p
							:id="`${uniqueId}-structure-menu-user-numbers`"
							class="ma-0 body-2 mb-5"
						>
							{{ locales.labelRPPS }} {{ userRpps }} {{ locales.labelAdeli }} {{ userAdeli }}
						</p>
					</div>

					<AmeliproMessage
						align-start
						class="message-width mb-4 mb-md-0"
						text
						type="info"
						:unique-id="`${uniqueId}-structure-message`"
					>
						<p
							:id="`${uniqueId}-structure-menu-message-text`"
							class="mb-0"
						>
							{{ locales.infoMessage }}
						</p>
					</AmeliproMessage>
				</div>

				<StructureTabs
					v-model="selectedStructure"
					aria-labelledby="structure-menu-title"
					:max-items-loaded-default="maxStructuresLoadedDefault"
					:tabs="structuresTabs"
					:unique-id="`${uniqueId}-structure-menu-tabs`"
				>
					<template #searchBar>
						<slot name="searchBar" />
					</template>
				</StructureTabs>

				<div
					:id="`${uniqueId}-structure-menu-`"
					class="d-flex justify-end align-start mt-2"
				>
					<AmeliproCheckbox
						v-model="switchModel"
						:checkbox="{
							description: 'Default-structure-switch-description',
							label: locales.switchLabel,
							value: switchValue,
						}"
						is-switch
						label-left
						:unique-id="`${uniqueId}-switch-structure-defaut`"
					/>

					<AmeliproTooltips
						classes="ml-2 mt-1"
						:tooltip-text="locales.switchDescription"
						:unique-id="`${uniqueId}-default-structure-switch-description`"
					/>
				</div>
			</div>
		</template>

		<template #footer>
			<div
				:id="`${uniqueId}-default-structure-footer`"
				class="d-flex flex-column flex-sm-row justify-sm-space-between"
			>
				<AmeliproBtn
					class="order-sm-1"
					:unique-id="`${uniqueId}-default-structure-confirm-btn`"
					@click="emitConfirmEvent"
				>
					{{ locales.confirmLabel }}
				</AmeliproBtn>

				<AmeliproBtn
					bordered
					class="mt-2 mt-sm-0 order-sm-0"
					color="ap-white"
					hover-color="ap-blue-lighten-3"
					text-color="ap-blue-darken-1"
					:unique-id="`${uniqueId}-default-structure-cancel-btn`"
					@click="emitCancelEvent"
				>
					{{ locales.cancelLabel }}
				</AmeliproBtn>
			</div>
		</template>
	</AmeliproDialog>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/apTokens';

.v-input.amelipro-switch {
	margin-top: 0;
}

.message-width {
	width: 50% !important;
	max-width: 50% !important;

	@media #{apTokens.$media-down-md} {
		width: 100% !important;
		max-width: 100% !important;
	}
}
</style>
