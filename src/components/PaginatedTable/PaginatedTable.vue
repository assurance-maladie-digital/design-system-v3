<script setup lang="ts">
	import { ref, computed, watch, useAttrs, onMounted } from 'vue'
	import type { DataOptions, SortOption, GroupOption } from './types'
	import { LocalStorageUtility } from '@/utils/localStorageUtility'

	const props = defineProps({
		serverItemsLength: {
			type: Number,
			default: undefined,
		},
		suffix: {
			type: String,
			default: undefined,
		},
		itemsPerPage: {
			type: Number,
			default: undefined,
		},
		caption: {
			type: String,
			default: '',
		},
		multiSort: {
			type: Boolean,
			default: false,
		},
		mustSort: {
			type: Boolean,
			default: false,
		},
	})

	defineOptions({
		inheritAttrs: false,
	})

	const options = defineModel<Partial<DataOptions>>('options', {
		required: false,
		default: () => ({}),
	})

	const localStorageUtility = new LocalStorageUtility()
	const localOptions = ref({})

	// Generate a unique ID for this table instance
	const uniqueTableId = ref(`paginated-table-${Math.random().toString(36).substr(2, 9)}`)

	const storageKey = computed(() => {
		const prefix = 'pagination'
		return props.suffix ? `${prefix}-${props.suffix}` : prefix
	})

	const componentAttributes = useAttrs()

	const headers = computed(() => {
		if (!Array.isArray(componentAttributes['headers'])) {
			return undefined
		}
		const headers = componentAttributes['headers'].map((header) => {
			const sort = options.value.sortBy?.find((s) => {
				return s.key === header.key
			})
			const title = header.title ?? header.text

			return {
				...header,
				title: title,
				headerProps: {
					'aria-label': sort ? `${title}, trier en fonction de cette colonne` : undefined,
					'aria-sort': sort ? (sort.order === 'asc' ? 'ascending' : 'descending') : 'none',
				},
			}
		})
		return headers
	})

	const optionsFacade = computed(() => {
		return {
			page: options.value.page || componentAttributes['page'],
			itemsPerPage: options.value.itemsPerPage || props.itemsPerPage,
			sortBy: options.value.sortBy,
			groupBy: options.value.groupBy,
			multiSort: options.value.multiSort !== undefined ? options.value.multiSort : props.multiSort,
			mustSort: options.value.mustSort !== undefined ? options.value.mustSort : props.mustSort,
		}
	})

	const propsFacade = computed(() => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { 'onUpdate:options': _, 'caption': __, ...attrs } = componentAttributes

		return {
			...attrs,
			itemsLength: props.serverItemsLength ?? 0,
			headers: headers.value,
			...localOptions.value,
		}
	})

	function updateOptions(tableOptions: SortOption[] | GroupOption[]): void {
		options.value = {
			...options.value,
			...tableOptions,
		}
	}

	watch(
		() => options.value,
		() => {
			if (props.serverItemsLength !== 0) {
				localStorageUtility.setItem(storageKey.value, {
					...optionsFacade.value,
					itemsLength: props.serverItemsLength ?? 0,
				})

				localOptions.value = optionsFacade.value
			}
		},
		{ deep: true },
	)

	localOptions.value = localStorageUtility.getItem(storageKey.value) ?? optionsFacade.value

	onMounted(() => {
		const table = document.querySelector(`#${uniqueTableId.value} table`)
		const caption = document.createElement('caption')
		caption.classList.add('d-sr-only')
		caption.innerHTML = props.caption
		table?.prepend(caption)

		const inputs = document.querySelectorAll(`#${uniqueTableId.value} input`)
		inputs.forEach((input) => {
			(input as HTMLElement).removeAttribute('aria-describedby')
		})

		const fields = document.querySelectorAll(`#${uniqueTableId.value} .v-field`)
		fields.forEach((field) => {
			const element = field as HTMLElement
			element.setAttribute('tabindex', '0')

			// Remove immediately if it exists
			if (element.hasAttribute('aria-controls')) {
				element.removeAttribute('aria-controls')
			}

			// Check again after a delay
			setTimeout(() => {
				if (element.hasAttribute('aria-controls')) {
					element.removeAttribute('aria-controls')
				}
			}, 500)
		})

		const fieldLabels = document.querySelectorAll(`#${uniqueTableId.value} .v-field`)
		fieldLabels.forEach((fieldLabel) => {
			(fieldLabel as HTMLElement).setAttribute('aria-label', 'éléments par page')
		})

		const fieldTitles = document.querySelectorAll(`#${uniqueTableId.value} .v-field`)
		fieldTitles.forEach((fieldTitle) => {
			(fieldTitle as HTMLElement).setAttribute('title', 'éléments par page')
		})

		const th = document.querySelectorAll(`#${uniqueTableId.value} th`)
		for (let i = 0; i < th.length; i++) {
			th[i].setAttribute('scope', 'col')
		}
	})
</script>

<template>
	<div
		:id="uniqueTableId"
		class="sy-paginated-table"
	>
		<VDataTable
			v-if="!serverItemsLength"
			color="primary"
			v-bind="propsFacade"
			@update:options="updateOptions"
		>
			<template
				v-for="slotName in Object.keys($slots)"
				#[slotName]="slotProps"
			>
				<slot
					:name="slotName"
					v-bind="slotProps ?? {}"
				/>
			</template>
		</VDataTable>
		<VDataTableServer
			v-else
			v-bind="propsFacade"
			color="primary"
			@update:options="updateOptions"
		>
			<template
				v-for="slotName in Object.keys($slots)"
				#[slotName]="slotProps"
			>
				<slot
					:name="slotName"
					v-bind="slotProps ?? {}"
				/>
			</template>
		</VDataTableServer>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens';

.sy-paginated-table :deep() {
	table thead tr {
		white-space: nowrap;
	}

	table thead th {
		.v-data-table-header__content {
			opacity: 0.65;
			font-size: 0.875rem;
			font-weight: 700 !important;
		}
	}

	&.row-clickable table tbody tr {
		cursor: pointer;
	}

	&.fixed-min-height {
		.v-data-table__wrapper {
			min-height: 540px;
		}
	}

	&.no-mobile-header {
		.v-data-table-header-mobile {
			display: none;
		}

		table {
			border-top: 2px solid #eee;
		}
	}

	.v-field {
		&--active {
			.v-field__prepend-inner > .v-icon,
			.v-field__append-inner > .v-icon,
			.v-field__clearable > .v-icon {
				opacity: 1;
				color: tokens.$primary-base;
			}
		}

		&--focused {
			border-color: tokens.$primary-base;
			color: tokens.$primary-base;
		}
	}
}
</style>
