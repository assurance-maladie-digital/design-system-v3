<script setup lang="ts">
	import { ref, computed, watch, useAttrs, useId, onMounted } from 'vue'
	import type { DataOptions, SortOption, GroupOption } from './types'
	import { LocalStorageUtility } from '@/utils/localStorageUtility'
	import Pagination from './Pagination.vue'
	import type { VDataTable } from 'vuetify/components/VDataTable'
	import { locales as defaultLocales } from './locales'
	import { useLocales } from '@/composables/useLocales'
	import type { DeepPartial } from '@/utils/locales/mergeLocales'

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
		locales: {
			type: Object as () => DeepPartial<typeof defaultLocales>,
			default: () => ({}),
		},
	})

	defineOptions({
		inheritAttrs: false,
	})

	const locales = useLocales(defaultLocales, () => props.locales)

	const options = defineModel<Partial<DataOptions>>('options', {
		required: false,
		default: () => ({}),
	})

	const localStorageUtility = new LocalStorageUtility()
	const localOptions = ref({})

	// Generate a unique ID for this table instance
	const uniqueTableId = ref(`paginated-table-${useId()}`)

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
					'aria-label': sort ? locales.value.sortColumnLabel(title) : undefined,
					'aria-sort': sort ? (sort.order === 'asc' ? 'ascending' : 'descending') : 'none',
					'scope': 'col',
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
		caption.textContent = props.caption
		table?.prepend(caption)

		// Target the items-per-page select input specifically in the footer
		const itemsPerPageInput = document.querySelector(`#${uniqueTableId.value} .v-data-table-footer__items-per-page input`) as HTMLInputElement | null
		if (itemsPerPageInput) {
			itemsPerPageInput.removeAttribute('aria-describedby')
			itemsPerPageInput.setAttribute('aria-label', locales.value.itemsPerPageLabel)
			itemsPerPageInput.setAttribute('title', locales.value.itemsPerPageLabel)
		}

		const itemsPerPageField = document.querySelector(`#${uniqueTableId.value} .v-data-table-footer__items-per-page .v-field`) as HTMLElement | null
		if (itemsPerPageField) {
			itemsPerPageField.setAttribute('tabindex', '0')

			if (itemsPerPageField.hasAttribute('aria-controls')) {
				itemsPerPageField.removeAttribute('aria-controls')
			}

			setTimeout(() => {
				if (itemsPerPageField.hasAttribute('aria-controls')) {
					itemsPerPageField.removeAttribute('aria-controls')
				}
			}, 500)
		}

		const th = document.querySelectorAll(`#${uniqueTableId.value} th`)
		for (const el of th) {
			el.setAttribute('tabindex', '0')
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
			<template #bottom="args">
				<slot
					name="bottom"
					v-bind="args"
				>
					<Pagination>
						<template #prepend>
							<slot name="footer.prepend" />
						</template>
					</Pagination>
				</slot>
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
			<template #bottom="args">
				<slot
					name="bottom"
					v-bind="args"
				>
					<Pagination>
						<template #prepend>
							<slot name="footer.prepend" />
						</template>
					</Pagination>
				</slot>
			</template>
		</VDataTableServer>
	</div>
</template>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern */

.sy-paginated-table :deep() {
	table thead tr {
		white-space: nowrap;
	}

	table thead th {
		.v-data-table-header__content {
			color: rgba(var(--v-theme-onSurface), 0.65);
			font-size: 0.875rem;
			font-weight: 700 !important;
		}

		// Les `<th>` sont rendus focusables (tabindex 0) pour le tri au clavier → ring DS
		// primary. Inset (-2px) car les cellules d'en-tête sont adjacentes.
		&:focus-visible {
			outline: 2px solid rgb(var(--v-theme-primary));
			outline-offset: -2px;
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
				color: rgb(var(--v-theme-primary));
			}
		}

		&--focused {
			border-color: rgb(var(--v-theme-primary));
		}
	}
}
</style>
