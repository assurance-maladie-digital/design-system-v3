<script setup lang="ts">
	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import { mdiMagnify, mdiPlus } from '@mdi/js'
	import { computed } from 'vue'
	import { useDisplay, useTheme } from 'vuetify'
	import { config } from './config'
	import { locales as defaultLocales } from './locales'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'

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

	defineSlots<{
		searchLeft?: () => undefined
		searchRight?: () => undefined
		filters?: () => undefined
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
		:class="{ 'v-theme-grey-darken80': theme.current.value.dark}"
		class="sy-table-toolbar px-4 py-2 d-flex flex-wrap align-center justify-space-between"
	>
		<p
			v-if="nbTotal > 0"
			class="mb-0 font-weight-bold mr-4 mr-sm-0"
			data-test-id="nb-rows"
		>
			{{ displayNbRows }}
		</p>

		<slot name="filters" />

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
				<SyIcon
					v-bind="options.addIcon"
					:icon="mdiPlus"
					decorative
				/>

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
.sy-table-toolbar {
	min-height: 56px;

	:deep(.v-toolbar__content) {
		width: 100%;
		flex-wrap: wrap;
		flex-direction: row !important;
		overflow: visible;

		@media (width <= 600px) {
			flex-direction: column !important;
		}
	}
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

	@media (width <= 600px) {
		margin-left: 0;
	}
}

.sy-form-input {
	width: 328px;
}

.sy-form-input :deep(input) {
	color: rgb(var(--v-theme-onSurface)) !important;
	opacity: none !important;
}

.sy-form-input :deep(.v-field__input),
.sy-form-input :deep(input),
.sy-form-input :deep(.v-icon),
.sy-form-input :deep(.v-field__clearable),
.sy-form-input :deep(.v-field__append-inner) {
	color: rgb(var(--v-theme-onSurface)) !important;
	opacity: none !important;
}

.sy-form-input--s {
	z-index: 1; // Display content above the table on mobile
	contain: none; // Allow fixed elements to be displayed properly
}

.sy-table-toolbar.v-theme--dark :deep() {
	background-color: rgb(var(--v-theme-grey-darken20)) !important;

	p,
	.text-primary {
		color: rgba(var(--v-theme-onPrimary), 0.6) !important;
	}

	svg {
		fill: rgb(var(--v-theme-onPrimary)) !important;
	}

	.v-label {
		color: rgba(var(--v-theme-onPrimary), 0.6) !important;
	}

	.v-field__input {
		color: rgb(var(--v-theme-onPrimary)) !important;
	}
}

.v-theme--dark button.v-btn:hover :deep() {
	background: rgba(var(--v-theme-onPrimary), 0.1);
}
</style>
