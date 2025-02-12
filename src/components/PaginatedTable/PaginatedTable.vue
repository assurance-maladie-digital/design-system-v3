<script setup lang="ts">
	import { ref, computed, watch, useAttrs } from 'vue'
	import type { PropType } from 'vue'
	import type { DataOptions, SortOption, GroupOption } from './types'
	import { LocalStorageUtility } from '@/utils/localStorageUtility'

	const props = defineProps({
		options: {
			type: Object as PropType<Partial<DataOptions>>,
			required: true,
		},
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
	})

	const emit = defineEmits(['update:options'])

	const localStorageUtility = new LocalStorageUtility()
	const localOptions = ref({})

	const storageKey = computed(() => {
		const prefix = 'pagination'
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
		const sortBy = !props.options.sortBy
			? []
			: Array.isArray(props.options.sortBy)
				? props.options.sortBy
					.filter((key: string) => key)
					.map((key: string, index: number) => ({
						key,
						order: props.options?.sortDesc?.[index] ? 'desc' : 'asc',
					}))
				: [
					{
						key: props.options.sortBy,
						order: props.options.sortDesc ? 'desc' : 'asc',
					},
				]
		const groupBy = !props.options.groupBy
			? []
			: Array.isArray(props.options.groupBy)
				? props.options.groupBy
					.filter((key: string) => key)
					.map((key: string, index: number) => ({
						key,
						order: props.options?.groupDesc?.[index] ? 'desc' : 'asc',
					}))
				: [
					{
						key: props.options.groupBy,
						order: props.options.groupDesc ? 'desc' : 'asc',
					},
				]

		return {
			page: props.options.page || componentAttributes['page'],
			itemsPerPage: props.options.itemsPerPage || props.itemsPerPage,
			sortBy,
			groupBy,
			multiSort: props.options.multiSort,
			mustSort: props.options.mustSort,
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

	function updateOptions(options: SortOption[] | GroupOption[]): void {
		emit('update:options', createUpdatedOptions(options))
	}

	function createUpdatedOptions(options): DataOptions {
		return {
			...options,
			multiSort: optionsFacade.value.multiSort,
			mustSort: optionsFacade.value.mustSort,
			sortBy: createSortBy(options),
			sortDesc: createSortDesc(options),
			groupBy: createGroupBy(options),
			groupDesc: createGroupDesc(options),
		}
	}

	function createSortBy(options): string[] {
		return options.sortBy.filter(sort => sort.key).map(sort => sort.key)
	}

	function createSortDesc(options): boolean[] {
		return options.sortBy.filter(sort => sort.key).map(sort => sort.order === 'desc')
	}

	function createGroupBy(options): string[] {
		return options.groupBy.filter(group => group.key).map(group => group?.key)
	}

	function createGroupDesc(options): boolean[] {
		return options.groupBy.filter(group => group.key).map(group => group?.order === 'desc')
	}

	watch(
		() => props.options,
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
</script>

<template>
	<div>
		{{ propsFacade }}
		<VDataTable
			v-if="!serverItemsLength"
			color="warning"
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
