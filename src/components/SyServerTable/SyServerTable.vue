<script setup lang="ts">
	import { ref, computed, watch, useAttrs, onMounted } from 'vue'
	import type { DataOptions, SortOption, GroupOption } from './types'
	import { LocalStorageUtility } from '@/utils/localStorageUtility'

	const props = defineProps({
		serverItemsLength: {
			type: Number,
			required: true,
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
			default: 'caption',
		},
	})

	const options = defineModel<Partial<DataOptions>>('options', {
		required: false,
		default: () => ({}),
	})

	const localStorageUtility = new LocalStorageUtility()
	const localOptions = ref({})

	const storageKey = computed(() => {
		const prefix = 'server-table'
		return props.suffix ? `${prefix}-${props.suffix}` : prefix
	})

	const componentAttributes = useAttrs()

	const headers = computed(() => {
		if (!Array.isArray(componentAttributes['headers'])) {
			return undefined
		}
		return componentAttributes['headers'].map(header => ({
			...header,
			title: header.title ?? header.text,
		}))
	})

	const optionsFacade = computed(() => {
		return {
			page: options.value.page || componentAttributes['page'],
			itemsPerPage: options.value.itemsPerPage || props.itemsPerPage,
			sortBy: options.value.sortBy,
			groupBy: options.value.groupBy,
			multiSort: options.value.multiSort,
			mustSort: options.value.mustSort,
		}
	})

	const propsFacade = computed(() => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { 'onUpdate:options': _, ...attrs } = componentAttributes

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
			localStorageUtility.setItem(storageKey.value, {
				...optionsFacade.value,
				itemsLength: props.serverItemsLength ?? 0,
			})

			localOptions.value = optionsFacade.value
		},
		{ deep: true },
	)

	localOptions.value = localStorageUtility.getItem(storageKey.value) ?? optionsFacade.value

	onMounted(() => {
		const table = document.querySelector('#sy-server-table table')
		const caption = document.createElement('caption')
		caption.innerHTML = props.caption
		if (props.caption === 'caption') {
			caption.classList.add('d-sr-only')
		}
		else {
			caption.classList.add('text-subtitle-1')
		}
		table?.prepend(caption)

		const inputs = document.querySelectorAll('#sy-server-table input')
		inputs.forEach((input) => {
			(input as HTMLElement).removeAttribute('aria-describedby')
		})

		const fields = document.querySelectorAll('#sy-server-table .v-field')
		fields.forEach((field) => {
			(field as HTMLElement).setAttribute('tabindex', '0')
		})

		const fieldLabels = document.querySelectorAll('#sy-server-table .v-field')
		fieldLabels.forEach((fieldLabel) => {
			(fieldLabel as HTMLElement).setAttribute('aria-label', 'items per page')
		})

		const fieldTitles = document.querySelectorAll('#sy-server-table .v-field')
		fieldTitles.forEach((fieldTitle) => {
			(fieldTitle as HTMLElement).setAttribute('title', 'items per page')
		})

		const th = document.querySelectorAll('#sy-server-table th')
		for (let i = 0; i < th.length; i++) {
			th[i].setAttribute('scope', 'col')
		}
	})
</script>

<template>
	<div
		id="sy-server-table"
		class="sy-server-table"
	>
		<VDataTableServer
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

.sy-server-table :deep() {
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
