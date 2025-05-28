<script setup lang="ts">
	import { ref, useAttrs, watch } from 'vue'
	import type { VDataTable } from 'vuetify/components'
	import TableHeader from '../common/TableHeader.vue'
	import { useTableUtils } from '../common/tableUtils'
	import type { DataOptions } from '../common/types'

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
		resizableColumns: {
			type: Boolean,
			default: false,
		},
	})

	const options = defineModel<Partial<DataOptions>>('options', {
		required: false,
		default: () => ({}),
	})

	const componentAttributes = useAttrs()

	const {
		propsFacade,
		updateOptions,
		setupAccessibility,
		setupLocalStorage,
	} = useTableUtils({
		tableId: 'sy-table',
		prefix: 'table',
		suffix: props.suffix,
		itemsPerPage: props.itemsPerPage,
		caption: props.caption,
		componentAttributes,
		options,
	})

	// Setup accessibility features
	setupAccessibility()

	// Setup local storage
	const { watchOptions } = setupLocalStorage()

	// Watch for options changes
	watch(
		() => options.value,
		watchOptions,
		{ deep: true },
	)

	const table = ref<VDataTable>()
</script>

<template>
	<div
		id="sy-table"
		class="sy-table"
	>
		<VDataTable
			ref="table"
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
			<template #headers="headersProps">
				<tr>
					<th
						v-for="column in headersProps.columns"
						:key="(column.key as string)"
					>
						<TableHeader
							:table="table"
							:header-params="headersProps"
							:column="column"
							:resizable-columns="props.resizableColumns"
						/>
					</th>
				</tr>
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
