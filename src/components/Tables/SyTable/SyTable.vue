<script setup lang="ts">
	import { ref, computed, watch, useAttrs, onMounted } from 'vue'
	import type { DataOptions, SortOption, GroupOption } from '../common/types'
	import { LocalStorageUtility } from '@/utils/localStorageUtility'

	const props = defineProps({
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
		const prefix = 'table'
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
			})

			localOptions.value = optionsFacade.value
		},
		{ deep: true },
	)

	localOptions.value = localStorageUtility.getItem(storageKey.value) ?? optionsFacade.value

	onMounted(() => {
		const table = document.querySelector('#sy-table table')
		const caption = document.createElement('caption')
		caption.innerHTML = props.caption
		if (props.caption === 'caption') {
			caption.classList.add('d-sr-only')
		}
		else {
			caption.classList.add('text-subtitle-1')
		}
		table?.prepend(caption)

		const inputs = document.querySelectorAll('#sy-table input')
		inputs.forEach((input) => {
			(input as HTMLElement).removeAttribute('aria-describedby')
		})

		const fields = document.querySelectorAll('#sy-table .v-field')
		fields.forEach((field) => {
			(field as HTMLElement).setAttribute('tabindex', '0')
		})

		const fieldLabels = document.querySelectorAll('#sy-table .v-field')
		fieldLabels.forEach((fieldLabel) => {
			(fieldLabel as HTMLElement).setAttribute('aria-label', 'items per page')
		})

		const fieldTitles = document.querySelectorAll('#sy-table .v-field')
		fieldTitles.forEach((fieldTitle) => {
			(fieldTitle as HTMLElement).setAttribute('title', 'items per page')
		})

		const th = document.querySelectorAll('#sy-table th')
		for (let i = 0; i < th.length; i++) {
			th[i].setAttribute('scope', 'col')
		}
	})
</script>

<template>
	<div
		id="sy-table"
		class="sy-table"
	>
		<VDataTable
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
	</div>
</template>

<style lang="scss" scoped>
@use '@/components/Tables/common/tableStyles' as *;

.sy-table :deep() {
	@include tablestyles;
}
</style>
