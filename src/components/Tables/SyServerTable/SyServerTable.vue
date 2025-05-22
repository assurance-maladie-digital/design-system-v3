<script setup lang="ts">
	import { useAttrs, watch } from 'vue'
	import type { DataOptions } from '../common/types'
	import { useTableUtils } from '../common/tableUtils'

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

	const componentAttributes = useAttrs()

	const {
		propsFacade,
		updateOptions,
		setupAccessibility,
		setupLocalStorage,
	} = useTableUtils({
		tableId: 'sy-server-table',
		prefix: 'server-table',
		suffix: props.suffix,
		itemsPerPage: props.itemsPerPage,
		caption: props.caption,
		serverItemsLength: props.serverItemsLength,
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
		id="sy-server-table"
		class="sy-server-table"
	>
		<VDataTableServer
			v-bind="propsFacade"
			color="primary"
      :items-length="props.serverItemsLength"
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
@use '@/components/Tables/common/tableStyles' as *;

.sy-server-table :deep() {
	@include tablestyles;
}
</style>
