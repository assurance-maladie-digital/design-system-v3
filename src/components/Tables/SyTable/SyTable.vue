<script setup lang="ts">
	import { useAttrs, watch } from 'vue'
	import type { DataOptions } from '../common/types'
	import { useTableUtils } from '../common/tableUtils'

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
