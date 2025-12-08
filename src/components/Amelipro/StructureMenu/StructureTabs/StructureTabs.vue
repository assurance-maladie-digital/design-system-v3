<script setup lang="ts">
	import type { IStructureTabs, StructureTab } from './types'
	import { computed, nextTick, type PropType, ref } from 'vue'
	import StructureBtn from '../StructureBtn/StructureBtn.vue'
	import StructureList from '../StructureList/StructureList.vue'
	import { locales } from './locales'
	import { useDisplay } from 'vuetify'

	const props = defineProps({
		ariaLabel: {
			type: String,
			default: undefined,
		},
		ariaLabelledby: {
			type: String,
			default: undefined,
		},
		maxStructuresLoadedDefault: {
			type: Number,
			default: 5,
		},
		modelValue: {
			type: Object as PropType<IStructureTabs>,
			default: undefined,
		},
		searchBar: {
			type: Boolean,
			default: false,
		},
		tabs: {
			type: Array as PropType<StructureTab[]>,
			default: () => [],
		},
		uniqueId: {
			type: String,
			required: true,
		},
	})

	const structureBtns = ref<typeof StructureBtn[]>()
	const { xs } = useDisplay()
	const labelClasses = computed<string | undefined>(() => (xs.value ? 'mb-3' : undefined))
	const emit = defineEmits(['update:model-value'])

	const selected = computed({
		get() {
			return props.modelValue ? props.modelValue.activeTab : 0
		},
		set(value: number) {
			emit('update:model-value', { ...props.modelValue, activeTab: value })
		},
	})

	const structureValues = computed({
		get() {
			return props.modelValue ? props.modelValue.activeValue : undefined
		},
		set(value: string | undefined) {
			emit('update:model-value', { ...props.modelValue, activeValue: value })
		},
	})

	const onClick = async (index: number): Promise<void> => {
		selected.value = index
		await nextTick()
	}

	const pressLeft = async (): Promise<void> => {
		if (selected.value === 0) {
			selected.value = props.tabs.length - 1
		}
		else {
			selected.value -= 1
		}
		await nextTick()
		focusChange()
	}

	const pressRight = async (): Promise<void> => {
		if (selected.value === (props.tabs.length - 1)) {
			selected.value = 0
		}
		else {
			selected.value += 1
		}
		await nextTick()
		focusChange()
	}

	const focusChange = (): void => {
		if (structureBtns.value && selected.value) {
			(structureBtns.value[selected.value].$el as HTMLElement).focus()
		}
	}
</script>

<template>
	<div :id="`${uniqueId}-container`">
		<div
			v-if="tabs.length > 1"
			:ariaLabelledby="`${uniqueId}-label`"
			class="d-flex flex-column flex-sm-row align-start align-sm-center"
			role="tablist"
		>
			<p
				:id="`${uniqueId}-label`"
				class="ma-0 mr-3 font-weight-bold"
				:class="labelClasses"
			>
				{{ locales.label }}
			</p>
			<div class="d-flex flex-column flex-sm-row flex-sm-wrap">
				<StructureBtn
					v-for="(item, index) in tabs"
					:key="index"
					ref="structureBtns"
					:aria-selected="selected === index ? 'true' : 'false'"
					class="mr-0 mr-sm-3 mb-2 mb-sm-1"
					:controls="`structure-panel-${index}`"
					role="tab"
					:selected="index === selected"
					:tabindex="selected === index ? 0 : -1"
					:unique-id="`${uniqueId}-tab-btn-${index}`"
					@click="onClick(index)"
					@keyup.left="pressLeft"
					@keyup.right="pressRight"
				>
					{{ item.label }}
				</StructureBtn>
			</div>
		</div>

		<div
			v-for="(tab, index) in tabs"
			:id="`structure-panel-${index}`"
			:key="index"
			class="mt-3"
			:role="tabs.length > 1 ? 'tabpanel' : undefined"
			:tabindex="selected === index && tabs.length > 1 ? 0 : -1"
		>
			<slot
				v-if="index === selected && searchBar"
				name="searchBar"
			/>

			<StructureList
				v-show="index === selected"
				v-model="structureValues"
				:label="tab.listLabel || locales.listLabel"
				:max-items-loaded-default="maxStructuresLoadedDefault"
				:name="`structures-${index}`"
				:structures="tab.structures"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/apTokens';

.tabs-btn-wrapper {
	@media #{apTokens.$media-only-xs} {
		width: 100% !important;
	}
}
</style>
