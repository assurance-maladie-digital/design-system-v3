<script setup lang="ts">
	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import { mdiMagnify, mdiPlus } from '@mdi/js'
	import { computed } from 'vue'
	import { useDisplay, useTheme } from 'vuetify'
	import { config } from './config'
	import { locales as defaultLocales } from './locales'

	const props = withDefaults(defineProps<{
		nbTotal?: number
		nbFiltered?: number
		search?: string
		searchLabel?: string
		showAddButton?: boolean
		addButtonLabel?: string
		loading?: boolean
		locales?: typeof defaultLocales
	} & CustomizableOptions>(), {
		nbTotal: 0,
		nbFiltered: undefined,
		search: undefined,
		searchLabel: defaultLocales.search,
		showAddButton: false,
		addButtonLabel: defaultLocales.addBtnLabel,
		loading: false,
		locales: () => defaultLocales,
	})

	defineEmits<{
		(e: 'update:search', value: string): void
		(e: 'add'): void
	}>()

	const options = useCustomizableOptions(config, props)
	const display = useDisplay()
	const theme = useTheme()

	const textFieldClasses = computed(() => ({
		'sy-form-input--s': display.xs.value,
		'flex-grow-0': display.xs.value,
		'flex-grow-1': !display.xs.value,
		'loading': props.loading,
	}))

	const displayNbRows = computed(() => {
		const lines = props.nbFiltered ? `${props.nbFiltered}/${props.nbTotal}` : String(props.nbTotal)
		return props.locales.rowText(
			lines,
			props.nbTotal > 1,
		)
	})
</script>

<template>
	<VToolbar
		v-bind="options.toolbar"
		:class="{ 'v-theme-dark': theme.current.value.dark}"
		class="sy-table-toolbar px-4 py-2 d-flex flex-wrap align-center justify-space-between"
	>
		<p
			v-if="nbTotal > 0"
			class="mb-0 font-weight-bold mr-4 my-3"
			data-test-id="nb-rows"
		>
			{{ displayNbRows }}
		</p>

		<div class="sy-table-toolbar__search">
			<slot name="search-left" />
			<VTextField
				v-bind="options.textField"
				color="primary"
				:model-value="search"
				class="sy-form-input"
				:class="textFieldClasses"
				:disabled="loading"
				:append-inner-icon="mdiMagnify"
				:label="searchLabel"
				data-test-id="search-input"
				@update:model-value="$emit('update:search', $event)"
			/>
			<VBtn
				v-if="showAddButton"
				v-bind="options.addBtn"
				:disabled="loading"
				class="ml-3 mb-0"
				data-test-id="add-btn"
				@click="$emit('add')"
			>
				<VIcon v-bind="options.addIcon">
					{{ mdiPlus }}
				</VIcon>

				<span
					v-show="!display.xs.value"
					v-bind="options.addIconLabel"
				>
					{{ addButtonLabel }}
				</span>
			</VBtn>

			<slot name="search-right" />
		</div>
	</VToolbar>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens';

.sy-table-toolbar {
	min-height: 56px;
}

.loading :deep(.v-field__append-inner) {
	opacity: 0.6 !important;
}

:deep(.v-field--disabled) {
	opacity: 0.7 !important;
}

.sy-table-toolbar__search {
	display: grid;
	grid-auto-columns: auto;
	grid-auto-flow: column;
	margin-left: auto;
	align-items: end;
}

.sy-form-input {
	width: 328px;
}

.sy-form-input--s {
	z-index: 1; // Display content above the table on mobile
	contain: none; // Allow fixed elements to be displayed properly

	:deep(.v-toolbar__content) {
		width: 100%;
		flex-wrap: wrap;
	}
}

.sy-table-toolbar.v-theme--dark :deep() {
	background-color: tokens.$grey-darken-20 !important;

	p,
	.text-primary {
		color: rgba(tokens.$colors-text-ondark, 0.6) !important;
	}

	svg {
		fill: tokens.$colors-text-ondark !important;
	}

	.v-label {
		color: rgba(tokens.$colors-text-ondark, 0.6) !important;
	}

	.v-field__input {
		color: tokens.$colors-text-ondark !important;
	}
}

.v-theme--dark button.v-btn:hover :deep() {
	background: rgba(tokens.$colors-text-ondark, 0.1);
}
</style>
